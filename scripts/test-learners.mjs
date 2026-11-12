import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {randomUUID} from 'node:crypto';
import {root} from './content-loader.mjs';
import path from 'node:path';

const source = fs.readFileSync(path.join(root, 'learner-store.js'), 'utf8');
const empty = () => ({schema:1, completed:[], bookmarks:[], notes:{}, answers:{}, checks:{}, seconds:{}, lastLesson:null, theme:'light', updatedAt:null});
const copy = value => JSON.parse(JSON.stringify(value));
const normalizeState = value => {
  assert.equal(value?.schema, 1);
  return {...empty(), ...copy(value)};
};
function storage() {
  const data = new Map();
  return {getItem:key=>data.get(key) ?? null, setItem:(key,value)=>data.set(key,String(value))};
}
function boot(disk = storage(), session = storage()) {
  const window = {localStorage:disk, sessionStorage:session, crypto:{randomUUID}};
  vm.runInNewContext(source, {window});
  return window.createLearnerStore({defaults:empty, normalizeState});
}
const snapshot = store => copy(store.load());

test('different browsers start with distinct identities and do not share any learning data', () => {
  const alice = boot(), bob = boot();
  const data = alice.load();
  Object.assign(data, {completed:['l011'], bookmarks:['l020'], notes:{l011:'Alice 的预测'}, answers:{l011:[0,1,2]}, checks:{l011:[true,true,true]}, seconds:{l011:94}, lastLesson:'l011', theme:'dark'});
  alice.save(data);
  assert.notEqual(alice.activeId, bob.activeId);
  assert.deepEqual(snapshot(bob), empty());
  assert.equal(snapshot(alice).notes.l011, 'Alice 的预测');
});

test('profiles isolate all fields, survive reload, and keep each tab on its own selected profile', () => {
  const disk = storage(), sessionA = storage(), sessionB = storage();
  const alice = boot(disk, sessionA), idA = alice.activeId;
  const recordA = alice.load();
  Object.assign(recordA, {completed:['l001'], bookmarks:['l002'], notes:{l001:'A'}, answers:{l001:[0,0,0]}, checks:{l001:[true,true,true]}, seconds:{l001:42}, lastLesson:'l001', theme:'dark'});
  alice.save(recordA);
  const bob = boot(disk, sessionB), idB = bob.create('小林');
  bob.select(idB);
  assert.deepEqual(snapshot(bob), empty());
  const recordB = bob.load(); recordB.notes.l001 = 'B'; bob.save(recordB);
  assert.equal(boot(disk, sessionA).activeId, idA);
  assert.equal(boot(disk, sessionB).activeId, idB);
  assert.equal(snapshot(alice).notes.l001, 'A');
  assert.equal(snapshot(bob).notes.l001, 'B');
  bob.select(idA);
  assert.deepEqual(snapshot(bob), copy(recordA));
});

test('upgrading preserves every legacy field, keeps the original backup, and never imports it twice', () => {
  const disk = storage();
  const legacy = {...empty(), completed:['l003'], notes:{l003:'已有笔记'}, bookmarks:['l004'], seconds:{l003:123}, answers:{l003:[2,1,0]}, checks:{l003:[true,false,true]}, lastLesson:'l003'};
  const original = JSON.stringify(legacy); disk.setItem('engine-atlas-v1', original);
  const store = boot(disk); assert.deepEqual(snapshot(store), legacy);
  const current = store.load(); current.notes.l003 = '升级后的记录'; store.save(current);
  assert.equal(snapshot(boot(disk)).notes.l003, '升级后的记录');
  assert.equal(disk.getItem('engine-atlas-v1'), original);
});

test('two tabs preserve unrelated edits and completion removals, and accumulate focus time', () => {
  const disk = storage(), first = boot(disk);
  const initial = first.load(); initial.completed = ['l011']; first.save(initial);
  const second = boot(disk);
  const a = first.load(), b = second.load();
  a.notes.l011 = '第一课记录'; a.completed = []; a.seconds.l011 = 4; first.save(a);
  b.notes.l012 = '第二课记录'; b.bookmarks = ['l012']; b.seconds.l011 = 3; second.save(b);
  const saved = snapshot(first);
  assert.deepEqual(saved.notes, {l011:'第一课记录', l012:'第二课记录'});
  assert.deepEqual(saved.completed, []);
  assert.deepEqual(saved.bookmarks, ['l012']);
  assert.equal(saved.seconds.l011, 7);
});

test('restoring a backup replaces only the active profile', () => {
  const store = boot(), firstId = store.activeId;
  const a = store.load(); a.notes.l001 = '保留'; store.save(a);
  const secondId = store.create('第二档案'); store.select(secondId);
  const b = store.load(); b.notes.l002 = '将被替换'; store.save(b);
  store.save({...empty(), notes:{l003:'从备份恢复'}}, {replace:true});
  assert.deepEqual(snapshot(store).notes, {l003:'从备份恢复'});
  store.select(firstId); assert.deepEqual(snapshot(store).notes, {l001:'保留'});
});

test('blocked storage keeps this session usable and reports that it cannot persist data', () => {
  const denied = {getItem(){throw new Error('denied');},setItem(){throw new Error('denied');}};
  const store = boot(denied, denied), firstId = store.activeId;
  const data = store.load(); data.notes.l001 = '临时记录'; store.save(data);
  assert.equal(store.available, false);
  const secondId = store.create('临时第二人'); store.select(secondId);
  assert.deepEqual(snapshot(store), empty());
  store.select(firstId); assert.equal(snapshot(store).notes.l001, '临时记录');
});

test('a quota failure after loading does not erase the previously loaded record in memory', () => {
  const disk = storage(), first = boot(disk);
  const data = first.load(); data.notes.l001 = '原笔记'; first.save(data);
  const second = boot(disk); second.load();
  disk.setItem = () => {throw new Error('quota');};
  second.rename('新名字');
  const after = second.load(); after.bookmarks = ['l011']; second.save(after);
  assert.equal(second.available, false);
  assert.equal(snapshot(second).notes.l001, '原笔记');
  assert.deepEqual(snapshot(second).bookmarks, ['l011']);
});

test('damaged saved state remains untouched and can be recovered in a new profile', () => {
  const disk = storage(), first = boot(disk), key = 'engine-atlas-learner-v2:' + first.activeId;
  disk.setItem(key, '{damaged');
  const second = boot(disk); const temporary = second.load(); temporary.notes.l001 = '本次记录'; second.save(temporary);
  assert.equal(disk.getItem(key), '{damaged');
  assert.equal(second.available, false);
  assert.ok(second.message.includes('原数据已保留'));
  const newId = second.create('恢复档案'); second.select(newId); second.save(temporary, {replace:true});
  assert.equal(snapshot(second).notes.l001, '本次记录');
  assert.equal(second.available, true);
});

test('a damaged index is preserved, and names are validated', () => {
  const disk = storage(); disk.setItem('engine-atlas-learners-v2', '{bad index');
  const store = boot(disk); const data = store.load(); data.notes.l001 = '临时记录'; store.save(data); store.save(store.load()); store.create('临时档案');
  assert.equal(snapshot(store).notes.l001, '临时记录');
  assert.equal(disk.getItem('engine-atlas-learners-v2'), '{bad index');
  assert.equal(store.available, false);
  assert.throws(()=>store.create('   ')); assert.throws(()=>store.rename('名'.repeat(41)));
});
