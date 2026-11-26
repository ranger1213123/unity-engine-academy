import fs from 'node:fs';
import path from 'node:path';
import {root, loadContent, loadFoundations} from './content-loader.mjs';

const errors = [];
const modules = loadContent();
const foundations = loadFoundations();
const chapter = modules.find(item => item.number === 2);
const lessons = new Map((chapter?.lessons || []).map(item => [item.id, item]));

function check(condition, message) {
  if (!condition) errors.push(message);
}

function textOf(value) {
  return JSON.stringify(value || '');
}

function codeFiles(lesson) {
  if (lesson?.code?.files) return lesson.code.files;
  if (lesson?.code?.source) return [{filename: lesson.code.filename, source: lesson.code.source}];
  return [];
}

check(chapter?.lessons?.length === 5, '第二章应保持 5 课');
check(Object.keys(foundations).length>=30,'前六章应至少有30份首次概念卡');
for(const lesson of modules.slice(0,6).flatMap(item=>item.lessons))check(foundations[lesson.id]?.concepts?.length>=2,`${lesson.id}缺首次概念卡`);

const l006 = lessons.get('l006');
const l007 = lessons.get('l007');
const l008 = lessons.get('l008');
const l009 = lessons.get('l009');
const l010 = lessons.get('l010');

check(!textOf(l006?.theory).includes('缓存引用'), 'l006 不应抢先重复教授“缓存引用”');
check(!textOf(l007?.theory).includes('GetComponent'), 'l007 不应在组件获取课之前依赖 GetComponent');
check(codeFiles(l007).some(item => item.filename === 'SpeedCaller.cs'), 'l007 必须提供完整 SpeedCaller.cs');

const componentMethods = [
  'GetComponent<T>()',
  'TryGetComponent<T>',
  'GetComponents<T>()',
  'GetComponentInChildren<T>()',
  'GetComponentsInChildren<T>()',
  'GetComponentInParent<T>()',
  'GetComponentsInParent<T>()'
];
for (const method of componentMethods)
  check(textOf(l008).includes(method), `l008 缺少方法说明：${method}`);
check((l008?.teaching?.comparison?.rows || []).length === 7, 'l008 方法选择表应有 7 行');
check(codeFiles(l008).some(item => item.filename === 'ComponentLookupProbe.cs'), 'l008 必须提供 ComponentLookupProbe.cs');
check(codeFiles(l008).some(item => item.filename === 'RendererDependency.cs'), 'l008 必须保留独立依赖实验');

check(!textOf(l009).includes('Domain Reload'), 'l009 入门正文不应提前引入 Domain Reload');
check(!textOf(l009).includes('static event'), 'l009 入门正文不应以 static event 起步');
check(codeFiles(l009).some(item => item.filename === 'SignalHub.cs'), 'l009 必须提供发布者脚本');
check(codeFiles(l009).some(item => item.filename === 'ListenerProbe.cs'), 'l009 必须提供监听者脚本');

check(!textOf(l010).includes('Cooldown'), 'l010 应只讲列表与场景对象，不再混入冷却模型');
check(codeFiles(l010).some(item => item.filename === 'ListLifetimeProbe.cs'), 'l010 必须提供列表寿命探针');

const chapterTheory = chapter?.lessons?.map(item => ({
  id: item.id,
  cacheMentions: (textOf(item.theory).match(/缓存/g) || []).length
})) || [];
check(chapterTheory.filter(item => item.cacheMentions > 0).every(item => item.id === 'l008'), '第二章“缓存”主题应集中在 l008');

const transformPoint=(foundations.l016?.concepts||[]).find(item=>item.term==='TransformPoint');
check(!!transformPoint,'l016必须首次定义TransformPoint');
for(const field of ['kind','plain','syntax','caller','input','output','doesNot'])check(transformPoint?.[field]?.trim(),`TransformPoint概念卡缺${field}`);
check(!Object.entries(foundations).some(([id,value])=>Number(id.slice(1))<16&&(value.concepts||[]).some(item=>item.term==='TransformPoint')),'l016之前不应提前使用TransformPoint概念卡');

const report = {
  checkedAt: new Date().toISOString(),
  chapter: chapter?.title,
  lessons: chapter?.lessons?.length || 0,
  componentMethods: componentMethods.length,
  chapterTheory,
  errors
};
fs.writeFileSync(path.join(root, 'beginner-continuity-audit.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
