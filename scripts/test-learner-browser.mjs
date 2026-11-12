import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {root, loadContent} from './content-loader.mjs';

const runtimeModules = process.env.UNITY_ATLAS_NODE_MODULES;
const require = runtimeModules ? createRequire(path.join(runtimeModules, 'package.json')) : createRequire(import.meta.url);
const {chromium} = require('playwright');
const base = process.argv.find(arg => arg.startsWith('http')) || 'http://127.0.0.1:4174/';
const first = loadContent()[0].lessons[0];
const browser = await chromium.launch({headless:true, channel:'msedge'});
const checks = [], errors = [];
const directory = path.join(root, 'artifacts'); fs.mkdirSync(directory, {recursive:true});
function check(pass, label) { checks.push({label, pass:!!pass}); }
async function open(context, route = '#lesson/l001') {
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base + route, {waitUntil:'networkidle'});
  return page;
}
async function go(page, route) {
  await page.goto(base + route);
  await page.locator('#main').waitFor();
}
async function create(page, name) {
  await go(page, '#learners');
  await page.locator('#new-learner-name').fill(name);
  await page.locator('#create-learner button').click();
  await page.waitForFunction(value => document.getElementById('learner-name').textContent === value, name);
}
async function choose(page, name) {
  await go(page, '#learners');
  await page.locator('.learner-card').filter({has:page.getByRole('heading', {name, exact:true})}).getByRole('button').click();
  await page.waitForFunction(value => document.getElementById('learner-name').textContent === value, name);
}
async function download(page) {
  const pending = page.waitForEvent('download');
  await page.locator('#export-progress').click();
  return JSON.parse(fs.readFileSync(await (await pending).path(), 'utf8'));
}
async function complete(page) {
  for (let i=0; i<first.quiz.length; i++) await page.locator(`input[name="quiz-l001-${i}"][value="${first.quiz[i].answer}"]`).check();
  await page.locator('#grade-quiz').click();
  for (let i=0; i<3; i++) await page.locator(`input[data-check="${i}"]`).check();
  await page.locator('#complete-lesson').click();
}

try {
  const contextA = await browser.newContext({viewport:{width:1440, height:1000}, acceptDownloads:true, reducedMotion:'reduce'});
  const contextB = await browser.newContext({acceptDownloads:true});
  const alice = await open(contextA), visitorB = await open(contextB);
  check(await alice.locator('#lesson-notes').inputValue() === '', '新访问者没有预置笔记');
  check(await alice.locator('#side-progress-text').textContent() === '学习旅程 · 0 / 100 课', '新访问者从零进度开始');
  await alice.locator('#lesson-notes').fill('Alice 独立的学习记录');
  await alice.locator('#bookmark').click();
  await complete(alice);
  await alice.locator('#theme-toggle').click();
  await alice.locator('#timer-toggle-inline').click();
  await alice.waitForFunction(() => document.getElementById('focus-timer-inline').textContent !== '00:00');
  await alice.locator('#timer-toggle-inline').click();
  const before = await download(alice);
  check(before.completed.includes('l001') && before.bookmarks.includes('l001') && before.seconds.l001 > 0, '第一档案保存完成状态、收藏与计时');
  await visitorB.reload();
  check(await visitorB.locator('#lesson-notes').inputValue() === '', '另一访问者看不到第一人的笔记');
  check(await visitorB.locator('#bookmark').getAttribute('aria-pressed') === 'false', '另一访问者没有第一人的收藏');
  check(await visitorB.locator('#side-progress-text').textContent() === '学习旅程 · 0 / 100 课', '另一访问者没有第一人的进度');
  check(await visitorB.locator('#focus-timer-inline').textContent() === '00:00', '另一访问者没有第一人的计时');
  check(!(await visitorB.locator('html').evaluate(element=>element.classList.contains('dark'))), '另一访问者独立保存主题');

  await create(alice, '小林的学习档案');
  await go(alice, '#lesson/l001');
  check(await alice.locator('#lesson-notes').inputValue() === '', '同一浏览器新档案的笔记为空');
  check(await alice.locator('#bookmark').getAttribute('aria-pressed') === 'false', '同一浏览器新档案的收藏为空');
  check(await alice.locator('#complete-lesson').isDisabled(), '新档案没有继承自测与实作验收');
  check(await alice.locator('#focus-timer-inline').textContent() === '00:00', '新档案没有继承专注时间');
  check(!(await alice.locator('html').evaluate(element=>element.classList.contains('dark'))), '新档案的主题独立');
  await alice.locator('#lesson-notes').fill('小林的新笔记：<script>window.leaked=true</script>');
  // Navigate immediately, before the note debounce: switching must flush the old profile.
  await alice.locator('.primary-nav a[data-route="learners"]').click();
  await alice.locator('.learner-card').filter({has:alice.getByRole('heading',{name:'我的学习档案',exact:true})}).getByRole('button').click();
  await go(alice, '#lesson/l001');
  check(await alice.locator('#lesson-notes').inputValue() === 'Alice 独立的学习记录', '切回原档案可恢复原笔记');
  check((await alice.locator('#complete-lesson').textContent()).includes('已完成'), '原档案的完成进度保留');
  check(await alice.locator('#bookmark').getAttribute('aria-pressed') === 'true', '原档案的收藏保留');
  check(await alice.locator('html').evaluate(element=>element.classList.contains('dark')), '原档案的主题保留');
  await alice.reload();
  check(await alice.locator('#learner-name').textContent() === '我的学习档案', '刷新后保留当前档案选择');

  const otherTab = await open(contextA, '#learners');
  await create(otherTab, '另一个标签页');
  await alice.reload();
  check(await alice.locator('#learner-name').textContent() === '我的学习档案', '另一个标签页切档案不会切换本页身份');
  check(await alice.locator('#lesson-notes').inputValue() === 'Alice 独立的学习记录', '另一个标签页切档案不会串写本页笔记');
  await choose(alice, '小林的学习档案');
  await go(alice, '#lesson/l001');
  check((await alice.locator('#lesson-notes').inputValue()).startsWith('小林的新笔记'), '切换前尚未延迟保存的笔记也保留');
  check(await otherTab.locator('#learner-name').textContent() === '另一个标签页', '每个标签页分别保留其选择');
  const secondExport = await download(alice);
  check(secondExport.learnerName === '小林的学习档案' && secondExport.completed.length === 0 && !JSON.stringify(secondExport).includes('Alice 独立'), '导出仅包含当前档案并标明名称');
  await go(alice, '#notes');
  check((await alice.locator('.note-entry p').textContent()).includes('<script>'), '笔记中的标记按文字显示');
  check(!(await alice.evaluate(()=>window.leaked)), '笔记内容不会执行脚本');

  await go(alice, '#learners');
  const specialName = '<img src=x onerror=alert(1)>';
  await alice.locator('#rename-learner-name').fill(specialName);
  await alice.locator('#rename-learner button').click();
  check(await alice.locator('#learner-name').textContent() === specialName, '名称按原文字保存');
  check(await alice.locator('.learner-card img').count() === 0, '档案名称不会注入HTML');
  await alice.locator('#rename-learner-name').fill('小林的学习档案');
  await alice.locator('#rename-learner button').click();
  await alice.locator('#toast').waitFor({state:'hidden'});
  await alice.screenshot({path:path.join(directory, 'learner-profiles-desktop.png'), fullPage:true});
  for (const width of [320,390,768,1024]) {
    await alice.setViewportSize({width, height:900});
    check(await alice.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1), `${width}px 档案管理无横向溢出`);
  }
  await alice.setViewportSize({width:390, height:844});
  await alice.screenshot({path:path.join(directory, 'learner-profiles-mobile.png'), fullPage:true});

  const legacyContext = await browser.newContext();
  await legacyContext.addInitScript(value => {
    if (!localStorage.getItem('legacy-fixture-installed')) {
      localStorage.setItem('engine-atlas-v1', JSON.stringify(value));
      localStorage.setItem('legacy-fixture-installed', 'true');
    }
  }, before);
  const legacy = await open(legacyContext);
  check(await legacy.locator('#lesson-notes').inputValue() === 'Alice 独立的学习记录', '旧版网页记录自动迁移');
  check((await legacy.locator('#complete-lesson').textContent()).includes('已完成'), '迁移保留旧版完成状态');
  await legacy.locator('#lesson-notes').fill('迁移后的新内容');
  await go(legacy, '#learners'); await legacy.reload(); await go(legacy, '#lesson/l001');
  check(await legacy.locator('#lesson-notes').inputValue() === '迁移后的新内容', '刷新不会反复导入旧版记录覆盖新内容');

  const blockedContext = await browser.newContext();
  await blockedContext.addInitScript(()=>{
    Object.defineProperty(window, 'localStorage', {get(){throw new Error('storage blocked');}});
  });
  const blocked = await open(blockedContext);
  check(await blocked.locator('#storage-status').isVisible(), '浏览器禁止存储时持续显示备份提示');
  await blocked.locator('#lesson-notes').fill('临时笔记');
  await go(blocked, '#notes');
  check((await blocked.locator('.note-entry p').textContent()) === '临时笔记', '禁止存储时仍可在本次页面记录笔记');
  const blockedExport = await download(blocked);
  check(blockedExport.notes.l001 === '临时笔记', '禁止存储时仍能导出本次记录');
  await blockedContext.close(); await legacyContext.close(); await contextB.close(); await contextA.close();
} catch (error) {
  checks.push({label:error.stack, pass:false});
}
check(errors.length === 0, '浏览器无JavaScript错误');
const report = {checkedAt:new Date().toISOString(), base, checks:checks.length, passed:checks.filter(item=>item.pass).length, failures:checks.filter(item=>!item.pass), errors, details:checks};
fs.writeFileSync(path.join(directory, 'learner-browser-audit.json'), JSON.stringify(report,null,2));
console.log(JSON.stringify({...report,details:undefined},null,2));
await browser.close();
if (report.failures.length) process.exitCode = 1;
