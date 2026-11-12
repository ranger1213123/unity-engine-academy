import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const baseline=JSON.parse(fs.readFileSync(path.join(root,'artifacts/editorial-baseline.json'),'utf8'));
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const fixed=l=>({id:l.id,hours:l.hours,prerequisites:l.prerequisites,timePlan:l.timePlan,code:l.code?{filename:l.code.filename,source:l.code.source,files:l.code.files,language:l.code.language}:null,urls:l.references.map(r=>r.url),minutes:l.lab.map(x=>x.minutes),points:l.exercise.rubric.map(x=>x.points),answers:l.quiz.map(x=>x.answer)});
for(const chapter of process.argv.slice(2).map(Number)){
 if(chapter<1||chapter>6)throw Error('Only chapters 01–06');
 const edits=(await import('./editorial-foundations/ch'+String(chapter).padStart(2,'0')+'.mjs')).default;
 const module=structuredClone(baseline.modules.find(m=>m.number===chapter));
 for(const key of ['title','subtitle','description'])if(edits.$module?.[key])module[key]=edits.$module[key];
 for(const l of module.lessons){
  const e=edits[l.id];if(!e)throw Error('Missing '+l.id);const before=hash(fixed(l));
  l.theory=e.t.map(([title,body])=>({title,paragraphs:body.split('\n\n').map(s=>s.trim()).filter(Boolean)}));
  l.teaching={question:e.q,keyIdea:e.k,walkthrough:e.w.map(([title,text])=>({title,text})),prediction:{question:e.p[0],answer:e.p[1]}};
  if(e.table)l.teaching.comparison=e.table;
  if(e.ct)l.code.title=e.ct;
  if(e.title)l.title=e.title;if(e.g)l.goals=e.g;if(e.c)l.code.explanation=e.c;
  if(e.z)l.quiz=l.quiz.map((o,i)=>({...o,...e.z[i]}));
  if(e.l)l.lab=l.lab.map((o,i)=>({...o,...e.l[i]}));
  if(e.f)l.pitfalls=e.f;if(e.e)l.exercise={...l.exercise,...e.e};if(e.s)l.summary=e.s;
  if(e.rubricText)l.exercise.rubric=l.exercise.rubric.map((r,i)=>({...r,item:e.rubricText[i]||r.item}));
  if(hash(fixed(l))!==before)throw Error('Protected data changed '+l.id);
  const han=(l.theory.flatMap(t=>t.paragraphs).join('').match(/[\u4e00-\u9fff]/g)||[]).length;
  if(han<900)throw Error(l.id+': only '+han+' Han characters');
  console.log(l.id+': '+han+' 汉字，正文已改写');
 }
 fs.writeFileSync(path.join(root,'content/chapter-'+String(chapter).padStart(2,'0')+'.js'),'window.COURSE_MODULES.push('+JSON.stringify(module,null,2)+');\n');
}
