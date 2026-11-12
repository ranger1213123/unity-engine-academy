import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { refine } from './editorial-systems/refinements.mjs';
import { polishSupplementary } from './editorial-systems/supplementary.mjs';

const root = path.resolve(import.meta.dirname, '..');
const baseline = JSON.parse(fs.readFileSync(path.join(root, 'artifacts/editorial-baseline.json'), 'utf8'));
const moduleCopy = {
  7: { subtitle: '先理解物体为何下落、碰撞与穿透', description: '分清显示、碰撞形状和刚体模拟，再用数值与实验学习力、速度、接触过滤、空间查询和高速碰撞。' },
  8: { subtitle: '一步步解释二维角色怎样运动', description: '从刚体类型与碰撞条件开始，学习二维查询、输入到速度的转换，以及穿透和抖动的不同原因。' },
  9: { subtitle: '追踪图片和模型怎样成为项目资源', description: '用实际尺寸、切片和引用关系理解导入设置、Sprite、Prefab与资源依赖，让别人也能重复得到相同结果。' },
  10: { subtitle: '让Idle从帧数据真正播放起来', description: '先验证图片和绑定，再连接Animator状态与过渡；理解参数、动作时点和根运动，按证据定位动画故障。' },
  11: { subtitle: '从世界位置推导最终屏幕画面', description: '用投影和绘制实验理解相机、URP光照、排序、材质与离屏纹理，再测量实际渲染成本。' },
  12: { subtitle: '让界面在不同尺寸与输入下正常工作', description: '比较uGUI与UI Toolkit，推导坐标和布局，接通点击与导航，并验证数据刷新、列表复用和界面性能。' }
};
const numbers = process.argv.slice(2).map(Number);
for (const number of numbers.length ? numbers : [7, 8, 9, 10, 11, 12]) {
  const name = `chapter-${String(number).padStart(2, '0')}`;
  const { default: revisions } = await import(pathToFileURL(path.join(import.meta.dirname, 'editorial-systems', `${name}.mjs`)));
  const module = structuredClone(baseline.modules.find(m => m.number === number));
  Object.assign(module, moduleCopy[number]);
  for (const lesson of module.lessons) {
    const r = refine(lesson.id, revisions[lesson.id]);
    if (!r) throw new Error(`Missing revision ${lesson.id}`);
    lesson.theory = r.theory.map(([title, text]) => ({ title, paragraphs: text.split('\n\n') }));
    const han = lesson.theory.map(s => s.paragraphs.join('')).join('').match(/\p{Script=Han}/gu)?.length ?? 0;
    if (han < 900) throw new Error(`${lesson.id}: theory only ${han} Han`);
    if (r.teaching.walkthrough.some(step => step.text.length < 30)) throw new Error(`${lesson.id}: short worked step`);
    lesson.teaching = r.teaching;
    if (r.goals) lesson.goals = r.goals;
    if (r.summary) lesson.summary = r.summary;
    if (r.explanation && lesson.code) lesson.code.explanation = r.explanation;
    if (r.labs) lesson.lab.forEach((lab, i) => {
      const [title, steps, result] = r.labs[i];
      Object.assign(lab, { title, steps, result });
    });
    if (r.quiz) lesson.quiz.forEach((quiz, i) => {
      const [question, options, explanation] = r.quiz[i];
      Object.assign(quiz, { question, options, explanation });
    });
    if (r.exercise) Object.assign(lesson.exercise, r.exercise);
    polishSupplementary(lesson);
    console.log(`${lesson.id} ${han} Han, ${lesson.teaching.walkthrough.length} worked steps`);
  }
  const output = `// 第二版：逐课重写原理与教学引导；代码与来源沿用审定快照。\nwindow.COURSE_MODULES.push(${JSON.stringify(module, null, 2)});\n`;
  fs.writeFileSync(path.join(root, 'content', `${name}.js`), output);
}
