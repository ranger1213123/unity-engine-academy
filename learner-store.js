'use strict';
// Local learning profiles work on GitHub Pages and when index.html is opened offline.
(() => {
  const INDEX_KEY = 'engine-atlas-learners-v2';
  const ACTIVE_KEY = 'engine-atlas-active-learner-v2';
  const STATE_PREFIX = 'engine-atlas-learner-v2:';
  const LEGACY_KEY = 'engine-atlas-v1';
  const clone = value => JSON.parse(JSON.stringify(value));
  const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  window.createLearnerStore = function ({defaults, normalizeState}) {
    const memory = new Map(), damaged = new Set();
    let disk, tabStorage, diskFailed = false, indexDamaged = false;
    let message = '', baseline;
    try { disk = window.localStorage; } catch { diskFailed = true; }
    try { tabStorage = window.sessionStorage; } catch { /* Selection still works in this tab. */ }
    function read(key) {
      if (!diskFailed && !indexDamaged) {
        try { const value = disk.getItem(key); if (value !== null) memory.set(key, value); return value; } catch { diskFailed = true; }
      }
      return memory.get(key) ?? null;
    }
    function write(key, value) {
      memory.set(key, value);
      if (!diskFailed && !indexDamaged) {
        try { disk.setItem(key, value); return true; } catch { diskFailed = true; }
      }
      return false;
    }
    function makeId() {
      return window.crypto?.randomUUID?.() || 'local-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
    }
    function validName(name) {
      const value = String(name || '').trim();
      if (!value || value.length > 40) throw new Error('请填写 1–40 个字符的档案名称。');
      return value;
    }
    function parseIndex(raw) {
      const value = JSON.parse(raw);
      if (value?.schema !== 2 || !Array.isArray(value.profiles) || !value.profiles.length) throw new Error('档案目录格式错误');
      const profiles = value.profiles.map(profile => {
        if (!/^[a-zA-Z0-9-]{8,100}$/.test(profile?.id)) throw new Error('档案编号错误');
        return {id:profile.id, name:validName(profile.name), createdAt:typeof profile.createdAt === 'string' ? profile.createdAt : null};
      });
      if (new Set(profiles.map(profile => profile.id)).size !== profiles.length) throw new Error('档案编号重复');
      return {schema:2, profiles, preferredId:value.preferredId};
    }
    let index;
    const rawIndex = read(INDEX_KEY);
    if (rawIndex) {
      try { index = parseIndex(rawIndex); }
      catch {
        // Preserve the original data; never replace a damaged index with an empty one.
        indexDamaged = true;
        message = '原有档案目录无法读取，原数据已保留。当前使用临时档案，请导出本次记录。';
      }
    }
    if (!index) {
      const profile = {id:makeId(), name:'我的学习档案', createdAt:new Date().toISOString()};
      index = {schema:2, profiles:[profile], preferredId:profile.id};
      let initial = defaults();
      const old = read(LEGACY_KEY);
      if (old && !indexDamaged) {
        try { initial = normalizeState(JSON.parse(old)); }
        catch { message = '旧版记录无法读取，原数据已保留。你可以导入备份恢复。'; }
      }
      // Write the state before the index; the untouched v1 key also remains as a backup.
      write(STATE_PREFIX + profile.id, JSON.stringify(initial));
      write(INDEX_KEY, JSON.stringify(index));
    }
    function refreshIndex() {
      if (indexDamaged) return;
      try { const latest = read(INDEX_KEY); if (latest) index = parseIndex(latest); }
      catch { /* Keep this tab's readable directory until the next reload. */ }
    }
    let selected;
    try { selected = tabStorage?.getItem(ACTIVE_KEY); } catch { /* Local fallback below. */ }
    let activeId = index.profiles.some(profile => profile.id === selected) ? selected
      : index.profiles.some(profile => profile.id === index.preferredId) ? index.preferredId : index.profiles[0].id;
    function rememberSelection() {
      try { tabStorage?.setItem(ACTIVE_KEY, activeId); } catch { /* Optional per-tab selection. */ }
    }
    rememberSelection();
    function readState() {
      const raw = read(STATE_PREFIX + activeId);
      try { baseline = raw ? normalizeState(JSON.parse(raw)) : defaults(); }
      catch {
        damaged.add(activeId);
        message = '当前档案的原记录无法读取，原数据已保留。请切换或新建档案，并用备份恢复。';
        baseline = defaults();
      }
      return clone(baseline);
    }
    function merge(latest, before, draft) {
      for (const field of ['completed', 'bookmarks']) {
        const values = new Set(latest[field]);
        for (const id of before[field]) if (!draft[field].includes(id)) values.delete(id);
        for (const id of draft[field]) if (!before[field].includes(id)) values.add(id);
        latest[field] = [...values];
      }
      for (const field of ['notes', 'answers', 'checks']) {
        for (const id of new Set([...Object.keys(before[field]), ...Object.keys(draft[field])])) {
          if (equal(before[field][id], draft[field][id])) continue;
          if (Object.hasOwn(draft[field], id)) latest[field][id] = draft[field][id];
          else delete latest[field][id];
        }
      }
      for (const [id, seconds] of Object.entries(draft.seconds)) {
        const delta = seconds - (before.seconds[id] || 0);
        if (delta > 0) latest.seconds[id] = (latest.seconds[id] || 0) + delta;
      }
      for (const field of ['theme', 'lastLesson']) if (before[field] !== draft[field]) latest[field] = draft[field];
      latest.updatedAt = draft.updatedAt;
      return normalizeState(latest);
    }
    return {
      get available() { return !diskFailed && !indexDamaged && !damaged.has(activeId); },
      get message() { return message; },
      get activeId() { return activeId; },
      get name() { refreshIndex(); return index.profiles.find(profile => profile.id === activeId)?.name || '临时学习档案'; },
      list() { refreshIndex(); return clone(index.profiles); },
      load:readState,
      save(state, {replace = false} = {}) {
        let clean = normalizeState(state);
        if (!replace && baseline && !damaged.has(activeId)) {
          try {
            const raw = read(STATE_PREFIX + activeId);
            clean = merge(raw ? normalizeState(JSON.parse(raw)) : defaults(), baseline, clean);
          } catch {
            damaged.add(activeId);
            message = '当前档案的原记录无法读取，原数据已保留。请导出本次记录后新建档案。';
          }
        }
        baseline = clone(clean);
        if (!damaged.has(activeId)) write(STATE_PREFIX + activeId, JSON.stringify(clean));
        return clone(clean);
      },
      create(name) {
        const profile = {id:makeId(), name:validName(name), createdAt:new Date().toISOString()};
        refreshIndex();
        write(STATE_PREFIX + profile.id, JSON.stringify(defaults()));
        index.profiles.push(profile);
        write(INDEX_KEY, JSON.stringify(index));
        return profile.id;
      },
      select(id) {
        refreshIndex();
        if (!index.profiles.some(profile => profile.id === id)) throw new Error('找不到这个学习档案。');
        activeId = id;
        if (!indexDamaged) message = '';
        index.preferredId = id;
        rememberSelection();
        write(INDEX_KEY, JSON.stringify(index));
        return readState();
      },
      rename(name) {
        const clean = validName(name);
        refreshIndex();
        index.profiles.find(profile => profile.id === activeId).name = clean;
        write(INDEX_KEY, JSON.stringify(index));
      }
    };
  };
})();
