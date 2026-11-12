import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {root} from './content-loader.mjs';
import {loadVisuals} from './visual-content-loader.mjs';
const runtime=process.env.UNITY_ATLAS_NODE_MODULES;
const require=runtime?createRequire(path.join(runtime,'package.json')):createRequire(import.meta.url);
const {chromium}=require('playwright');
const base=process.argv.find(arg=>arg.startsWith('http'))||'http://127.0.0.1:4174/';
const {figures,mapping}=loadVisuals();
const checks=[],errors=[];const check=(pass,label)=>checks.push({pass:!!pass,label});
const directory=path.join(root,'artifacts');fs.mkdirSync(directory,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'msedge'});
const context=await browser.newContext({viewport:{width:1440,height:1050}});
const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
async function loadImages(){
  const images=page.locator('.official-image');
  for(let i=0;i<await images.count();i++){
    const img=images.nth(i);await img.scrollIntoViewIfNeeded();
    await img.evaluate(async image=>{try{await image.decode();}catch{}});
    check(await img.evaluate(image=>image.complete&&image.naturalWidth>0),'官方图已实际加载 '+await img.getAttribute('src'));
  }
}
try{
  await page.goto(base+'#editor');await page.locator('.editor-guide').waitFor();
  check(await page.locator('.official-figure').count()===5,'操作地图有5幅真实官方图');await loadImages();
  await page.locator('[data-visual="editor-overview"]').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(directory,'visual-editor-desktop.png'),animations:'disabled'});
  const open=page.locator('[data-visual="editor-overview"] .official-image-button');await open.click();
  check(await page.locator('#visual-dialog').evaluate(el=>el.open),'点击图片可打开读图窗口');
  check(await page.locator('#visual-dialog .figure-marker').count()===3,'放大图保留三个定位数字');
  check((await page.locator('#visual-dialog .visual-original').getAttribute('href'))===figures[0].source,'读图窗口指向对应官方原页');
  await page.locator('[data-visual-zoom]').click();
  check(await page.locator('.visual-dialog-scroll').evaluate(el=>el.scrollWidth>el.clientWidth),'2倍放大后可滚动查看');
  await page.locator('[data-visual-zoom]').click();
  await page.screenshot({path:path.join(directory,'visual-reader-desktop.png'),animations:'disabled'});
  await page.keyboard.press('Escape');check(!(await page.locator('#visual-dialog').evaluate(el=>el.open)),'Esc关闭图片');
  check(await open.evaluate(el=>el===document.activeElement),'关闭后焦点回到原图按钮');
  const seen=new Set(['editor-overview','hierarchy-window','empty-inspector','console-window','play-controls']);
  for(const [id,uses] of Object.entries(mapping)){
    await page.goto(base+'#lesson/'+id);await page.locator('.lesson-header').waitFor();
    check(await page.locator('.official-figure').count()===uses.length,id+'插图数量正确');
    for(const use of uses){const figure=page.locator('.concept-section').nth(use.section).locator('[data-visual="'+use.visual+'"]');check(await figure.count()===1,id+'插在对应原理段落后 '+use.visual);}
    const need=uses.some(u=>!seen.has(u.visual));if(need){await loadImages();uses.forEach(u=>seen.add(u.visual));}
  }
  check(seen.size===figures.length,'14种原图均经真实浏览器加载');
  await page.goto(base+'#lesson/l050');await page.locator('[data-visual="animator-state-graph"]').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(directory,'visual-animator-desktop.png'),animations:'disabled'});
  await page.locator('#open-search').click();await page.locator('#search-input').fill('先沿Entry箭头');
  check(await page.locator('.search-result[href="#lesson/l047"]').count()>0,'读图标题纳入全文搜索');await page.keyboard.press('Escape');
  await page.goto(base+'#lesson/l001');await page.emulateMedia({media:'print'});
  check(await page.locator('.figure-reading').count()===3&&await page.locator('.figure-reading').first().isVisible(),'打印保留三幅读图说明');
  check(await page.locator('.figure-source a').first().isVisible(),'打印保留图片官方来源');await page.emulateMedia({media:'screen'});
  await page.locator('#focus-mode').click();await page.locator('.official-image-button').first().click();await page.keyboard.press('Escape');
  check(await page.locator('body').evaluate(el=>el.classList.contains('reading-focus')),'关闭图片后仍保持沉浸阅读');await page.keyboard.press('Escape');
  for(const width of [320,390,768,1024]){
    await page.setViewportSize({width,height:844});
    for(const route of ['#editor','#lesson/l001','#lesson/l011','#lesson/l050']){
      await page.goto(base+route);check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),width+'px无横向溢出 '+route);
    }
  }
  await page.setViewportSize({width:390,height:844});await page.goto(base+'#editor');
  await page.locator('[data-visual="editor-overview"]').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(directory,'visual-editor-mobile.png'),animations:'disabled'});
  await page.locator('[data-visual="editor-overview"] .official-image-button').click();await page.locator('[data-visual-zoom]').click();
  check(await page.locator('.visual-dialog-scroll').evaluate(el=>el.scrollWidth>el.clientWidth),'手机可放大并滚动');
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'手机读图窗口不撑宽页面');
  await page.screenshot({path:path.join(directory,'visual-reader-mobile.png'),animations:'disabled'});
  await page.goto(base+'#lesson/l001');check(!(await page.locator('#visual-dialog').evaluate(el=>el.open)),'切换课程会关闭图片窗口');
  const blocked=await context.newPage();await blocked.route('https://docs.unity.com/api/media**',route=>route.abort());
  await blocked.goto(base+'#editor');const target=blocked.locator('[data-visual="editor-overview"]');await target.scrollIntoViewIfNeeded();
  await target.locator('.image-fallback').waitFor({state:'visible'});
  check(await target.locator('.figure-reading').isVisible(),'图片请求失败时保留中文操作说明');check(await target.locator('.figure-source a').isVisible(),'图片请求失败时保留官方原页入口');
  check(!(await target.locator('.official-image-button').isVisible()),'失败时隐藏损坏图片按钮');await blocked.close();
  const offline=await context.newPage();await offline.goto('file:///'+path.join(root,'index.html').replaceAll('\\','/')+'#lesson/l001');
  check(await offline.locator('.official-figure').count()===3,'离线文件模式也呈现图文框架');check(await offline.locator('.lesson-header').count()===1,'离线模式保持课程可读');await offline.close();
}catch(error){errors.push(error.stack);}
check(errors.length===0,'无浏览器运行错误');
const report={checkedAt:new Date().toISOString(),base,checks:checks.length,passed:checks.filter(c=>c.pass).length,failures:checks.filter(c=>!c.pass),errors};
fs.writeFileSync(path.join(directory,'visual-browser-audit.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await context.close();await browser.close();if(report.failures.length||errors.length)process.exitCode=1;
