import fs from 'node:fs';
import path from 'node:path';
import {root,loadContent} from './content-loader.mjs';
const sources=new Map();
for(const module of loadContent())for(const lesson of module.lessons)for(const ref of lesson.references){if(!sources.has(ref.url))sources.set(ref.url,{url:ref.url,label:ref.label,lessons:[]});sources.get(ref.url).lessons.push(lesson.id);}
const previousPath=path.join(root,'sources-audit.json');
const previous=fs.existsSync(previousPath)?JSON.parse(fs.readFileSync(previousPath,'utf8')):{sources:[]};
const cache=new Map((previous.sources||[]).map(source=>[source.url,source]));
const force=process.argv.includes('--force');
const entries=[...sources.values()];
const results=[];
let cursor=0;
const decode=text=>text.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;|&#x27;/g,"'");
async function audit(source){
  const cached=cache.get(source.url);
  if(!force&&cached?.status===200&&Date.now()-new Date(cached.checkedAt).getTime()<86400000){results.push({...cached,excerpt:cached.excerpt?.slice(0,300),lessons:source.lessons});return;}
  let result={...source,checkedAt:new Date().toISOString()};
  for(let attempt=0;attempt<2;attempt++){
    try{
      const response=await fetch(source.url,{signal:AbortSignal.timeout(25000),headers:{'User-Agent':'Unity-Engine-Atlas-Documentation-Check/1.0'}});
      const html=await response.text();
      const title=decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||'').replace(/\s+/g,' ').trim();
      let body=html;const start=html.indexOf('id="page-content-container"');if(start>=0)body=html.slice(start);
      body=decode(body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim();
      result={...result,status:response.status,finalURL:response.url,title,excerpt:body.slice(0,300)};
      if(response.status===200&&/page not found|404 not found|page cannot be found/i.test(title))result.status=404;
      break;
    }catch(error){result.error=error.message;}
  }
  results.push(result);
  console.log(`${result.status||'ERR'} ${source.url}`);
}
await Promise.all(Array.from({length:6},async()=>{while(cursor<entries.length){const source=entries[cursor++];await audit(source);}}));
results.sort((a,b)=>a.url.localeCompare(b.url));
const failed=results.filter(source=>source.status!==200);
const report={checkedAt:new Date().toISOString(),total:results.length,ok:results.length-failed.length,failed:failed.length,note:'HTTP和标题检查表示当时链接可用，不代表逐行人工核实了全部文档。excerpt是核对来源的短摘录；教材正文为原创解释。',sources:results};
fs.writeFileSync(previousPath,JSON.stringify(report,null,2));
console.log(JSON.stringify({total:report.total,ok:report.ok,failed:failed.map(source=>({url:source.url,status:source.status,error:source.error}))},null,2));
if(failed.length)process.exitCode=1;
