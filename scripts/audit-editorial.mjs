import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {root,loadContent} from './content-loader.mjs';
const baselinePath=path.join(root,'artifacts','editorial-baseline.json');
const modules=loadContent();
const hash=value=>crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const stable=lesson=>({id:lesson.id,hours:lesson.hours,prerequisites:lesson.prerequisites,timePlan:lesson.timePlan,code:{language:lesson.code?.language,files:lesson.code?.files||(lesson.code?.source?[{filename:lesson.code.filename,source:lesson.code.source}]:[])},references:lesson.references.map(ref=>ref.url),labMinutes:lesson.lab.map(item=>item.minutes),rubric:lesson.exercise.rubric.map(item=>item.points),quizAnswers:lesson.quiz.map(item=>item.answer)});
if(process.argv.includes('--snapshot')){
  if(fs.existsSync(baselinePath))throw new Error('语言修订基线已存在，不能覆盖');
  fs.mkdirSync(path.dirname(baselinePath),{recursive:true});
  fs.writeFileSync(baselinePath,JSON.stringify({createdAt:new Date().toISOString(),modules},null,2));
  const directory=path.join(root,'artifacts','editorial-before');
  fs.mkdirSync(directory,{recursive:true});
  for(const file of ['app.js','styles.css','AUTHORING.md','REVIEW.md',...Array.from({length:20},(_,i)=>'content/chapter-'+String(i+1).padStart(2,'0')+'.js')]){
    const target=path.join(directory,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(root,file),target);
  }
  console.log('已保存100课修订前正文、教学数据与原始文件。');
}else{
  const before=new Map(JSON.parse(fs.readFileSync(baselinePath,'utf8')).modules.flatMap(module=>module.lessons).map(lesson=>[lesson.id,lesson]));
  const errors=[],results=[];
  for(const lesson of modules.flatMap(module=>module.lessons)){
    const old=before.get(lesson.id),guide=lesson.teaching;
    const rewritten=hash(old?.theory)!==hash(lesson.theory);
    const originalParagraphs=old.theory.flatMap(section=>section.paragraphs);
    const currentParagraphs=new Set(lesson.theory.flatMap(section=>section.paragraphs));
    const retainedParagraphs=originalParagraphs.filter(paragraph=>currentParagraphs.has(paragraph)).length;
    const stableContent=hash(stable(old))===hash(stable(lesson));
    const complete=!!(guide?.question?.length>=12&&guide?.keyIdea?.length>=35&&guide?.walkthrough?.length>=3&&guide.walkthrough.every(step=>step.title&&step.text?.length>=30)&&guide?.prediction?.question&&guide.prediction.answer?.length>=30);
    if(!rewritten)errors.push(lesson.id+' 原理正文未修订');
    if(rewritten&&retainedParagraphs/originalParagraphs.length>.25)errors.push(lesson.id+' 仍保留过多未改写段落，需人工复读');
    if(!complete)errors.push(lesson.id+' 缺少完整导读、推导例题或预测解析');
    if(!stableContent)errors.push(lesson.id+' 代码、引用、评分或课程结构变化，需复核');
    results.push({id:lesson.id,rewritten,retainedParagraphs,guideComplete:complete,stableContent});
  }
  const report={checkedAt:new Date().toISOString(),lessons:results.length,rewritten:results.filter(item=>item.rewritten).length,guides:results.filter(item=>item.guideComplete).length,stable:results.filter(item=>item.stableContent).length,errors,results};
  fs.writeFileSync(path.join(root,'editorial-audit.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify({...report,results:undefined},null,2));if(errors.length)process.exitCode=1;
}
