import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {root,loadContent} from './content-loader.mjs';
const runtimeModules=process.env.UNITY_ATLAS_NODE_MODULES;
const require=runtimeModules?createRequire(path.join(runtimeModules,'package.json')):createRequire(import.meta.url);
const {chromium}=require('playwright');
const base=process.argv.find(arg=>arg.startsWith('http')) || 'http://127.0.0.1:4174/';
const draft=process.argv.includes('--draft');
const directory=path.join(root,'artifacts');fs.mkdirSync(directory,{recursive:true});
const failures=[],checks=[],errors=[];
function check(condition,label){checks.push({label,pass:!!condition});if(!condition)failures.push(label);}
const browser=await chromium.launch({headless:true,channel:'msedge'});
const context=await browser.newContext({viewport:{width:1440,height:1050},acceptDownloads:true});
const page=await context.newPage();
page.on('pageerror',error=>errors.push(error.message));
const modules=loadContent(),lessons=modules.flatMap(module=>module.lessons);
const first=(draft?lessons.find(lesson=>lesson.teaching):null)||lessons[0];
try{
  await page.goto(base,{waitUntil:'networkidle'});
  check(await page.locator('.hero h1').isVisible(),'首页主标题可见');
  const counts=await page.evaluate(()=>window.ENGINE_ATLAS);
  check(draft||counts.lessons===100,'加载100课');check(draft||counts.modules===20,'加载20章');check(draft||counts.hours===500,'总课时500');
  await page.screenshot({path:path.join(directory,'desktop-home.png'),fullPage:true});
  await page.getByRole('button',{name:'搜索知识、组件、API…'}).click();
  await page.getByRole('searchbox',{name:'搜索教材'}).fill('Awake');
  check(await page.locator('.search-result').count()>0,'全文搜索可找到Awake');
  await page.keyboard.press('Escape');
  await page.goto(base+'#lesson/'+first.id);
  await page.locator('.lesson-header h1').waitFor();
  check(await page.locator('.concept-section').count()>=3,'课程理论章节加载');
  check(await page.locator('.lab-step').count()>=2,'课程实验加载');
  if(!draft||first.teaching){
    check(await page.locator('.opening-question').textContent()===first.teaching.question,'导读呈现本课的具体问题');
    check(await page.locator('.walkthrough>li').count()===first.teaching.walkthrough.length,'分步例题完整显示');
    check(!(await page.locator('.prediction-answer').evaluate(element=>element.open)),'预测答案默认折叠');
    check(!(await page.locator('.prediction-explanation').isVisible()),'折叠时不提前显示预测答案');
    await page.locator('.prediction-answer>summary').click();
    check(await page.locator('.prediction-explanation').isVisible(),'点击后可阅读预测解析');
    await page.locator('.prediction-answer>summary').click();
    await page.emulateMedia({media:'print'});
    check(await page.locator('.prediction-explanation').isVisible(),'打印时包含折叠的预测解析');
    await page.emulateMedia({media:'screen'});
    await page.locator('[data-section="start"]').click();
    check(page.url().endsWith('#lesson/'+first.id),'导读目录跳转保留当前课程路由');
    await page.locator('#start').screenshot({path:path.join(directory,'editorial-guide-desktop.png')});
    await page.getByRole('button',{name:'搜索知识、组件、API…'}).click();
    await page.getByRole('searchbox',{name:'搜索教材'}).fill(first.teaching.prediction.question);
    check(await page.locator('.search-result[href="#lesson/'+first.id+'"]').count()>0,'导读中的预测问题也可以全文搜索');
    await page.keyboard.press('Escape');
  }
  check(await page.locator('#complete-lesson').isDisabled(),'未通过验收不能完成');
  const note='实验预测：禁用再启用不应再次 Start。<script>alert("xss")</script>';
  await page.locator('#lesson-notes').fill(note);
  await page.locator('#bookmark').click();
  for(let i=0;i<first.quiz.length;i++)await page.locator(`input[name="quiz-${first.id}-${i}"][value="${first.quiz[i].answer}"]`).check();
  await page.locator('#grade-quiz').click();
  check((await page.locator('#quiz-summary').textContent()).includes('100%'),'自测答案与解析正确');
  for(let i=0;i<3;i++)await page.locator(`input[data-check="${i}"]`).check();
  check(await page.locator('#complete-lesson').isEnabled(),'自测和实验验收齐全后可以完成');
  await page.locator('#complete-lesson').click();
  await page.reload();
  check((await page.locator('#complete-lesson').textContent()).includes('已完成'),'完成状态刷新后保留');
  check(await page.locator('#lesson-notes').inputValue()===note,'笔记自动保存并保留字面文本');
  check(await page.locator('#bookmark').getAttribute('aria-pressed')==='true','收藏刷新后保留');
  await page.screenshot({path:path.join(directory,'desktop-lesson.png'),fullPage:true});
  await page.locator('#focus-mode').click();check(await page.locator('body').evaluate(body=>body.classList.contains('reading-focus')),'沉浸阅读可进入');
  await page.keyboard.press('Escape');check(!(await page.locator('body').evaluate(body=>body.classList.contains('reading-focus'))),'Esc退出沉浸阅读');
  await page.locator('#theme-toggle').click();check(await page.locator('html').evaluate(html=>html.classList.contains('dark')),'暗色主题可切换');
  await page.screenshot({path:path.join(directory,'dark-lesson.png'),fullPage:false});
  await page.locator('#theme-toggle').click();
  await page.locator('#timer-toggle-inline').click();
  await page.waitForFunction(()=>document.getElementById('focus-timer-inline').textContent!=='00:00');
  await page.locator('#timer-toggle-inline').click();
  check((await page.locator('#focus-timer-inline').textContent())!=='00:00','专注计时启动和暂停可用');
  if(!draft){const multiple=lessons.find(lesson=>lesson.code?.files?.length>1);await page.goto(base+'#lesson/'+multiple.id);check(await page.locator('[data-copy-code]').count()===multiple.code.files.length,'多文件示例分块展示并可分别复制');}
  await page.goto(base+'#notes');
  check((await page.locator('.note-entry p').textContent())===note,'笔记页安全渲染特殊字符');
  const downloadPromise=page.waitForEvent('download');await page.locator('#export-progress').click();const download=await downloadPromise;
  const exported=JSON.parse(fs.readFileSync(await download.path(),'utf8'));
  check(exported.completed.includes(first.id)&&exported.notes[first.id]===note,'导出包含进度和笔记');
  const imported={...exported,notes:{...exported.notes,[first.id]:'导入恢复测试'}};
  const importPath=path.join(directory,'test-import.json');fs.writeFileSync(importPath,JSON.stringify(imported));
  page.once('dialog',dialog=>dialog.accept());await page.locator('#import-file').setInputFiles(importPath);
  await page.waitForFunction(()=>document.getElementById('toast').textContent.includes('恢复'));
  await page.goto(base+'#lesson/'+first.id);check(await page.locator('#lesson-notes').inputValue()==='导入恢复测试','导入可恢复学习记录');
  await page.goto(base+'#references');await page.locator('#reference-search').fill('Transform');check(await page.locator('.source-row').count()>0,'官方文档可筛选');
  await page.goto(base+'#components');await page.locator('#component-search').fill('Rigidbody2D');check(await page.locator('.component-entry').count()===1,'组件速查可筛选职责与课程');
  await page.goto(base+'#lab/lifecycle');await page.locator('#life-create').click();check((await page.locator('#life-log').textContent()).includes('Awake'),'生命周期创建触发Awake');
  await page.locator('#life-frame').click();await page.locator('#life-toggle').click();await page.locator('#life-toggle').click();await page.locator('#life-frame').click();
  const log=await page.locator('#life-log').textContent();check((log.match(/Start/g)||[]).length===1&&(log.match(/OnEnable/g)||[]).length===2,'重新启用重复OnEnable而Start只一次');
  await page.screenshot({path:path.join(directory,'lifecycle-lab.png'),fullPage:true});
  await page.goto(base+'#lab/physics');await page.locator('#physics-next').click();check((await page.locator('#physics-stats').textContent()).includes('0物理步'),'60FPS第一帧不足一个50Hz物理步');
  await page.locator('#physics-next').click();check((await page.locator('#physics-stats').textContent()).includes('1物理步'),'第二帧发生物理步');
  await page.locator('#physics-scale').selectOption('0');await page.locator('#physics-ten').click();check((await page.locator('#physics-stats').textContent()).includes('0物理步'),'timeScale0停止固定步进');
  if(!draft){for(const lesson of lessons){await page.goto(base+'#lesson/'+lesson.id);check((await page.locator('.lesson-header h1').textContent())===lesson.title,`${lesson.id}正文路由正确`);check(await page.locator('.quiz-item').count()===lesson.quiz.length,`${lesson.id}测验完整`);check(await page.locator('.opening-question').textContent()===lesson.teaching.question,`${lesson.id}具体问题对应正确`);check(await page.locator('.walkthrough>li').count()===lesson.teaching.walkthrough.length,`${lesson.id}分步例题完整`);}}
  const mobile=await context.newPage();await mobile.setViewportSize({width:390,height:844});
  for(const route of ['#home','#roadmap','#lesson/'+first.id,'#lesson/l011','#lesson/l014','#lab/lifecycle','#lab/physics','#notes','#references','#components']){
    await mobile.goto(base+route);await mobile.locator('#main').waitFor();
    check(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'390px无横向溢出 '+route);
  }
  await mobile.goto(base+'#home');await mobile.screenshot({path:path.join(directory,'mobile-home.png'),fullPage:true});
  if(!draft||first.teaching){await mobile.goto(base+'#lesson/'+first.id);await mobile.locator('#start').screenshot({path:path.join(directory,'editorial-guide-mobile.png')});await mobile.goto(base+'#home');}
  await mobile.locator('#menu-toggle').click();check(await mobile.locator('.sidebar').isVisible(),'移动端目录可打开');await mobile.locator('#mobile-scrim').click({position:{x:320,y:300}}).catch(()=>mobile.locator('#menu-toggle').click());
  await mobile.close();
  await page.goto(base+'#lesson/l011');
  check(await page.locator('.teaching-comparison tbody tr').count()===3,'生命周期对照表显示三种初始条件');
  await page.locator('#toast').waitFor({state:'hidden'});
  await page.locator('#start').screenshot({path:path.join(directory,'lifecycle-guide.png')});
  for(const width of [320,768,1024]){await page.setViewportSize({width,height:900});for(const route of ['#home','#lesson/'+first.id,'#lesson/l011','#lesson/l014','#components']){await page.goto(base+route);check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width}px无横向溢出 ${route}`);}}
  // 静态文件模式不依赖 fetch、模块加载器或服务端路由。
  const offline=await context.newPage();await offline.goto('file:///'+path.join(root,'index.html').replaceAll('\\','/'));check((await offline.evaluate(()=>window.ENGINE_ATLAS?.lessons))===lessons.length,'双击离线文件也可加载全书');await offline.close();
}catch(error){failures.push(error.stack);}
check(errors.length===0,'浏览器无JavaScript运行错误');
const report={checkedAt:new Date().toISOString(),base,draft,checks:checks.length,passed:checks.filter(item=>item.pass).length,failures,errors,details:checks};
fs.writeFileSync(path.join(root,'browser-audit.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({...report,details:undefined},null,2));
await browser.close();if(failures.length)process.exitCode=1;
