import fs from 'node:fs';
import path from 'node:path';
import {root} from './content-loader.mjs';
import edits from './editorial-feedback-content.mjs';
const baseline=JSON.parse(fs.readFileSync(path.join(root,'artifacts/editorial-baseline.json'),'utf8'));
const module=structuredClone(baseline.modules.find(item=>item.number===13));
for(const lesson of module.lessons){
  const edit=edits[lesson.id];if(!edit)throw new Error('缺少修订 '+lesson.id);
  lesson.theory=edit.theory;
  lesson.teaching=edit.teaching;
  lesson.goals=edit.goals;
  lesson.code.explanation=edit.explanation;
  if(edit.codeTitle)lesson.code.title=edit.codeTitle;
  lesson.lab=lesson.lab.map((lab,index)=>({...lab,...edit.labs[index]}));
  lesson.quiz=lesson.quiz.map((quiz,index)=>({...quiz,...edit.quiz[index]}));
  lesson.summary=edit.summary;
  if(edit.pitfalls)lesson.pitfalls=edit.pitfalls;
  if(edit.exercise)lesson.exercise={...lesson.exercise,...edit.exercise};
  const count=(lesson.theory.flatMap(section=>section.paragraphs).join('').match(/\p{Script=Han}/gu)||[]).length;
  if(count<900)throw new Error(lesson.id+'正文不足900汉字：'+count);
  console.log(lesson.id+'：'+count+'汉字，正文已改写');
}
fs.writeFileSync(path.join(root,'content/chapter-13.js'),'window.COURSE_MODULES.push('+JSON.stringify(module,null,2)+');\n');
