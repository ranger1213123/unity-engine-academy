import fs from 'node:fs';
import path from 'node:path';
import {root,loadContent} from './content-loader.mjs';
import {loadVisuals} from './visual-content-loader.mjs';
const {figures,mapping}=loadVisuals();
const lessons=new Map(loadContent().flatMap(m=>m.lessons).map(l=>[l.id,l]));
const errors=[],results=[];const ids=new Set();
for(const figure of figures){
  if(ids.has(figure.id))errors.push('重复图片ID '+figure.id);ids.add(figure.id);
  for(const field of ['title','image','source','sourceTitle','version','alt','action','note'])if(!figure[field]?.trim())errors.push(figure.id+' 缺 '+field);
  if(!figure.read?.length||!figure.read.every(s=>s.trim()))errors.push(figure.id+' 缺读图顺序');
  if(!(figure.width>0&&figure.height>0))errors.push(figure.id+' 缺尺寸');
  for(const marker of figure.markers||[])if(!(marker.x>=0&&marker.x<=100&&marker.y>=0&&marker.y<=100&&marker.label))errors.push(figure.id+' 定位标记无效');
}
for(const [id,uses] of Object.entries(mapping))for(const use of uses){if(!lessons.has(id)||!lessons.get(id).theory[use.section]||!ids.has(use.visual))errors.push('无效插图位置 '+id+' '+JSON.stringify(use));}
await Promise.all(figures.map(async figure=>{
  const result={id:figure.id,image:figure.image,source:figure.source,checkedAt:new Date().toISOString()};
  try{
    for(const url of [figure.image,figure.source]){const parsed=new URL(url);if(parsed.protocol!=='https:'||!/(^|\.)(unity3d\.com|unity\.com)$/.test(parsed.hostname))throw new Error('不是官方HTTPS地址');}
    const [image,page]=await Promise.all([fetch(figure.image,{signal:AbortSignal.timeout(25000)}),fetch(figure.source,{signal:AbortSignal.timeout(25000)})]);
    const html=await page.text();result.imageStatus=image.status;result.imageType=image.headers.get('content-type');result.pageStatus=page.status;result.pageTitle=html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];result.finalPageURL=page.url;
    await image.arrayBuffer();
    const src=new URL(figure.image);result.foundInSource=html.includes(src.searchParams.get('file'))||html.includes(figure.image);
    if(image.status!==200||!result.imageType?.startsWith('image/')||page.status!==200||/page not found/i.test(result.pageTitle||'')||!result.foundInSource)throw new Error('图片或来源页不可用，或来源页未找到这张图');
  }catch(error){result.error=error.message;errors.push(figure.id+' '+error.message);}
  results.push(result);
}));
const report={checkedAt:new Date().toISOString(),figures:figures.length,illustratedLessons:Object.keys(mapping).length,note:'检查官方来源、图像响应类型与页面内确有引用；图义与中文注解另经实际看图复核。原图仍由Unity托管，离线或网络受限时网页保留注解与原页入口。',errors,results};
fs.writeFileSync(path.join(root,'visual-sources-audit.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,results:undefined},null,2));if(errors.length)process.exitCode=1;
