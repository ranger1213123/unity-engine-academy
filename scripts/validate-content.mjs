import fs from 'node:fs';
import path from 'node:path';
import {root, loadContent} from './content-loader.mjs';
const errors=[];
const warnings=[];
const modules=loadContent();
const lessons=modules.flatMap(module=>module.lessons);
const ids=new Set(lessons.map(lesson=>lesson.id));
const han=text=>(String(text).match(/\p{Script=Han}/gu)||[]).length;
const codeFiles=lesson=>lesson.code?.files || (lesson.code?.source?[lesson.code]:[]);
function assert(condition,message){if(!condition)errors.push(message);}
assert(modules.length===20,`期望20章，实际${modules.length}`);
assert(lessons.length===100,`期望100课，实际${lessons.length}`);
assert(ids.size===lessons.length,'课程id重复');
let hours=0,characters=0,codeSamples=0,quizCount=0,labCount=0;
const contentCounts=[];
for(const [index,module] of modules.entries()){
  assert(module.number===index+1,`章节序号错误 ${module.id}`);
  assert(module.id===`m${String(index+1).padStart(2,'0')}`,`章节id错误 ${module.id}`);
  assert(module.lessons.length===5,`${module.id}必须5课`);
  assert(module.title&&module.description&&module.subtitle,`${module.id}缺章说明`);
  assert(module.lessons.filter(lesson=>codeFiles(lesson).length).length>=3,`${module.id}少于3个代码示例`);
  for(const [offset,lesson] of module.lessons.entries()){
    const expectedId=`l${String(index*5+offset+1).padStart(3,'0')}`;
    assert(lesson.id===expectedId,`课程id错误${lesson.id},期望${expectedId}`);
    assert(lesson.hours===5,`${lesson.id}课时不是5`);hours+=lesson.hours;
    assert(lesson.title&&lesson.goals?.length>=3,`${lesson.id}缺标题/学习目标`);
    assert(lesson.teaching?.scenario?.trim()&&lesson.teaching?.purpose?.trim(),`${lesson.id}缺导读情景/学习用途`);
    assert(lesson.teaching?.prediction?.scenario?.trim(),`${lesson.id}缺独立预测情景`);
    assert(Array.isArray(lesson.prerequisites),`${lesson.id}缺先修声明`);
    for(const id of lesson.prerequisites||[]){assert(ids.has(id),`${lesson.id}先修${id}不存在`);assert(Number(id.slice(1))<Number(lesson.id.slice(1)),`${lesson.id}先修不能指向本课/未来课${id}`);}
    assert(lesson.theory?.length>=3,`${lesson.id}理论少于3节`);
    const text=(lesson.theory||[]).map(section=>section.paragraphs?.join(' ')||'').join(' ');
    const count=han(text);characters+=count;contentCounts.push({id:lesson.id,title:lesson.title,han:count});
    assert(count>=900,`${lesson.id}理论汉字仅${count},要求900`);
    for(const section of lesson.theory||[])assert(section.title&&section.paragraphs?.length,`${lesson.id}理论结构不完整`);
    assert(lesson.lab?.length>=2,`${lesson.id}实验少于2组`);
    assert(lesson.lab?.reduce((sum,lab)=>sum+lab.minutes,0)===120,`${lesson.id}实验总时长不是120分钟`);
    for(const lab of lesson.lab||[]){assert(lab.title&&lab.steps?.length>=3&&lab.result,`${lesson.id}实验步骤或预期不足`);assert(lab.purpose?.trim()&&Array.isArray(lab.setup)&&lab.setup.length>0&&lab.setup.every(item=>typeof item==='string'&&item.trim()),`${lesson.id}实验缺目的/可操作准备`);}
    assert(lesson.timePlan?.reduce((sum,item)=>sum+item.minutes,0)===300,`${lesson.id}学习预算不是300分钟`);
    assert(lesson.pitfalls?.length>=2,`${lesson.id}故障不足2例`);
    for(const item of lesson.pitfalls||[])assert(item.symptom&&item.cause&&item.fix,`${lesson.id}故障说明不完整`);
    assert(lesson.exercise?.brief&&lesson.exercise?.deliverables?.length>=2,`${lesson.id}缺迁移练习或产物`);
    assert(lesson.exercise?.rubric?.reduce((sum,item)=>sum+item.points,0)===100,`${lesson.id}评分不合100`);
    assert(lesson.quiz?.length>=3,`${lesson.id}测验不足3题`);
    for(const quiz of lesson.quiz||[]){assert(quiz.scenario?.trim(),`${lesson.id}测验缺独立情景`);assert(quiz.question&&quiz.explanation&&quiz.options?.length>=3,`${lesson.id}测验不完整`);assert(Number.isInteger(quiz.answer)&&quiz.answer>=0&&quiz.answer<quiz.options.length,`${lesson.id}测验答案越界`);assert(new Set(quiz.options).size===quiz.options.length,`${lesson.id}测验选项重复`);}
    assert(lesson.references?.length>=2,`${lesson.id}官方引用不足2条`);
    for(const ref of lesson.references||[]){try{const url=new URL(ref.url);assert(url.protocol==='https:'&&/(^|\.)(unity3d\.com|unity\.com|unity\.cn)$/.test(url.hostname),`${lesson.id}引用非Unity官方${ref.url}`);assert(ref.label,`${lesson.id}文档缺标题`);}catch{errors.push(`${lesson.id}引用URL无效${ref.url}`);}}
    assert(lesson.summary?.length>=2,`${lesson.id}复盘问题不足`);
    if(codeFiles(lesson).length){codeSamples+=codeFiles(lesson).length;assert(lesson.code.title&&lesson.code.explanation?.length,`${lesson.id}代码缺标题/前提解释`);for(const file of codeFiles(lesson)){assert(file.filename&&file.source,`${lesson.id}代码缺文件名/正文`);if(/TODO|NotImplementedException|\.\.\.省略|其余代码省略/.test(file.source))errors.push(`${lesson.id}代码包含未实现占位`);if((file.language||lesson.code.language)==='json'){try{JSON.parse(file.source);}catch{errors.push(`${lesson.id} ${file.filename}不是有效JSON`);}}}}
    if(/待补充|敬请期待|正文占位/.test(text))errors.push(`${lesson.id}正文存在占位内容`);
    quizCount+=lesson.quiz.length;labCount+=lesson.lab.length;
  }
}
assert(hours===500,`合计课时${hours}不是500`);
const duplicateTitles=lessons.map(lesson=>lesson.title).filter((title,index,all)=>all.indexOf(title)!==index);
assert(duplicateTitles.length===0,'课程标题重复：'+duplicateTitles.join('、'));
const report={checkedAt:new Date().toISOString(),modules:modules.length,lessons:lessons.length,hours,theoryHanCharacters:characters,codeSamples,quizQuestions:quizCount,labs:labCount,minTheoryHan:Math.min(...contentCounts.map(item=>item.han)),contentCounts,errors,warnings};
fs.writeFileSync(path.join(root,'content-audit.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({...report,contentCounts:undefined},null,2));
if(errors.length)process.exitCode=1;
