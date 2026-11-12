import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {root,loadContent} from './content-loader.mjs';
const runtimeModules=process.env.UNITY_ATLAS_NODE_MODULES;
const require=runtimeModules?createRequire(path.join(runtimeModules,'package.json')):createRequire(import.meta.url);
const {chromium}=require('playwright');
const base=process.argv.find(arg=>arg.startsWith('http'))||'http://127.0.0.1:4174/';
const directory=path.join(root,'artifacts');fs.mkdirSync(directory,{recursive:true});
const checks=[],errors=[];
const check=(pass,label)=>checks.push({pass:!!pass,label});
const plain=s=>s.replaceAll(String.fromCharCode(96),'');
const browser=await chromium.launch({headless:true,channel:'msedge'});
const context=await browser.newContext({viewport:{width:1440,height:1050}});
const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
const lessons=loadContent().flatMap(module=>module.lessons);
try{
  await page.goto(base);
  check(await page.locator('.editor-entry a[href="#editor"]').isVisible(),'首页提供编辑器地图入口');
  await page.goto(base+'#editor');await page.locator('.editor-guide').waitFor();
  check(await page.locator('.editor-window').count()===6,'地图提供六窗口的用途与菜单');
  check((await page.locator('.editor-guide').textContent()).includes('Window > General > Console'),'地图给出Console完整入口');
  await page.screenshot({path:path.join(directory,'editor-map-desktop.png'),fullPage:true});
  for(const lesson of lessons){
    await page.goto(base+'#lesson/'+lesson.id);await page.locator('.lesson-header').waitFor();
    const contexts=await page.evaluate(()=>{
      const text=selector=>[...document.querySelectorAll(selector)].map(el=>el.textContent);
      const before=(a,b)=>!!(a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING);
      return {scenario:text('.lesson-scenario p'),purpose:text('.lesson-purpose'),prediction:text('.prediction-scenario'),quiz:text('.quiz-scenario'),setup:[...document.querySelectorAll('.lab-setup')].map(el=>[...el.querySelectorAll('li')].map(li=>li.textContent)),labPurpose:text('.lab-purpose'),order:before(document.querySelector('.lesson-scenario'),document.querySelector('.opening-question'))&&before(document.querySelector('.prediction-scenario'),document.querySelector('.prediction-question'))&&[...document.querySelectorAll('.quiz-item')].every(el=>before(el.querySelector('.quiz-scenario'),el.querySelector('h3')))&&[...document.querySelectorAll('.lab-step')].every(el=>before(el.querySelector('.lab-purpose'),el.querySelector('.lab-setup'))&&before(el.querySelector('.lab-setup'),el.querySelector('.lab-actions')))};
    });
    check(contexts.scenario[0]===plain(lesson.teaching.scenario)&&contexts.purpose[0]==='学会以后：'+plain(lesson.teaching.purpose)&&contexts.prediction[0]==='情景：'+plain(lesson.teaching.prediction.scenario),lesson.id+'导读情景/用途/预测情景完整');
    check(contexts.quiz.length===lesson.quiz.length&&contexts.quiz.every((s,i)=>s==='情景：'+plain(lesson.quiz[i].scenario)),lesson.id+'每题情景完整');
    check(contexts.setup.length===lesson.lab.length&&contexts.setup.every((s,i)=>JSON.stringify(s)===JSON.stringify(lesson.lab[i].setup.map(plain)))&&contexts.labPurpose.length===lesson.lab.length&&contexts.labPurpose.every((s,i)=>s==='为什么做：'+plain(lesson.lab[i].purpose)),lesson.id+'实验准备与目的完整');
    check(contexts.order,lesson.id+'情景先于问题、准备先于操作');
  }
  const first=lessons[0];await page.goto(base+'#lesson/'+first.id);
  check(await page.locator('.lesson-header + .editor-entry a').count()===1,'第一课开头提供地图入口');
  for(const [label,query] of [['开篇情景',first.teaching.scenario],['课程用途',first.teaching.purpose],['预测情景',first.teaching.prediction.scenario],['自测情景',first.quiz[0].scenario],['实验准备',first.lab[0].setup[0]],['实验目的',first.lab[0].purpose]]){
    await page.locator('#open-search').click();await page.locator('#search-input').fill(query);
    check(await page.locator('.search-result[href="#lesson/'+first.id+'"]').count()>0,label+'可搜索');await page.keyboard.press('Escape');
  }
  await page.emulateMedia({media:'print'});
  for(const selector of ['.lesson-scenario','.lesson-purpose','.prediction-scenario','.quiz-scenario','.lab-setup','.lab-purpose'])check(await page.locator(selector).first().isVisible(),'打印保留 '+selector);
  await page.emulateMedia({media:'screen'});
  const mixed=lessons.find(lesson=>lesson.code?.files?.some(file=>file.language==='csharp')&&lesson.code.files.some(file=>file.language==='json'));
  if(mixed){await page.goto(base+'#lesson/'+mixed.id);check(await page.locator('.code-block[data-language="csharp"]').count()===mixed.code.files.filter(file=>file.language==='csharp').length,'混合示例分别标识C#');check(await page.locator('.code-block[data-language="json"]').count()===mixed.code.files.filter(file=>file.language==='json').length,'混合示例分别标识JSON');}
  for(const width of [320,390,768,1024]){
    await page.setViewportSize({width,height:844});
    for(const route of ['#home','#editor','#lesson/l001','#lesson/l078']){
      await page.goto(base+route);check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),width+'px无横向溢出 '+route);
    }
    if(width===390){await page.goto(base+'#editor');await page.screenshot({path:path.join(directory,'editor-map-mobile.png'),fullPage:true});}
  }
}catch(error){errors.push(error.stack);}
check(errors.length===0,'无浏览器运行错误');
const report={checkedAt:new Date().toISOString(),base,checks:checks.length,passed:checks.filter(item=>item.pass).length,failures:checks.filter(item=>!item.pass),errors};
fs.writeFileSync(path.join(directory,'context-browser-audit.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
await browser.close();if(report.failures.length||errors.length)process.exitCode=1;
