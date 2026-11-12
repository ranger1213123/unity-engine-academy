import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.resolve(import.meta.dirname, '..');
const baseline = JSON.parse(fs.readFileSync(path.join(root, 'artifacts/editorial-baseline.json'), 'utf8'));
const context = { window: { COURSE_MODULES: [] } };
vm.createContext(context);
for (let n = 7; n <= 12; n++) {
  vm.runInContext(fs.readFileSync(path.join(root, 'content', `chapter-${String(n).padStart(2, '0')}.js`), 'utf8'), context);
}
const protectedFields = lesson => ({
  id: lesson.id, prerequisites: lesson.prerequisites, hours: lesson.hours, timePlan: lesson.timePlan,
  code: lesson.code && { source: lesson.code.source, files: lesson.code.files, filename: lesson.code.filename, language: lesson.code.language },
  references: lesson.references, labs: lesson.lab.map(lab => lab.minutes),
  points: lesson.exercise.rubric.map(item => item.points), answers: lesson.quiz.map(item => item.answer)
});
const hash = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const results = [];
for (const module of context.window.COURSE_MODULES) {
  const previous = baseline.modules.find(m => m.id === module.id);
  for (const lesson of module.lessons) {
    const old = previous.lessons.find(l => l.id === lesson.id);
    const oldParagraphs = new Set(old.theory.flatMap(section => section.paragraphs));
    const paragraphs = lesson.theory.flatMap(section => section.paragraphs);
    const theoryHan = paragraphs.join('').match(/\p{Script=Han}/gu)?.length ?? 0;
    const result = {
      id: lesson.id, theoryHan, protectedFieldsMatch: hash(protectedFields(old)) === hash(protectedFields(lesson)),
      retainedOldParagraphs: paragraphs.filter(p => oldParagraphs.has(p)).length,
      workedSteps: lesson.teaching.walkthrough.length,
      shortestWorkedStep: Math.min(...lesson.teaching.walkthrough.map(step => step.text.length)),
      hasPredictionAnswer: Boolean(lesson.teaching.prediction.question && lesson.teaching.prediction.answer),
      changedLabs: JSON.stringify(lesson.lab) !== JSON.stringify(old.lab),
      changedQuizText: JSON.stringify(lesson.quiz) !== JSON.stringify(old.quiz)
    };
    if (!result.protectedFieldsMatch || result.retainedOldParagraphs || theoryHan < 900 || result.workedSteps < 3 || result.shortestWorkedStep < 30 || !result.hasPredictionAnswer || !result.changedLabs || !result.changedQuizText) {
      throw new Error(`Editorial audit failed: ${JSON.stringify(result)}`);
    }
    results.push(result);
  }
}
const report = { checkedAt: new Date().toISOString(), scope: 'm07–m12 / l031–l060', lessons: results.length,
  theoryHan: results.reduce((sum, item) => sum + item.theoryHan, 0), minTheoryHan: Math.min(...results.map(item => item.theoryHan)),
  protectedMismatches: results.filter(item => !item.protectedFieldsMatch).length, retainedOldParagraphs: 0, results };
fs.writeFileSync(path.join(root, 'artifacts/editorial-systems-audit.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ ...report, results: undefined }, null, 2));
