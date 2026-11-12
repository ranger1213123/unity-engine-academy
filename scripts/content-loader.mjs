import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function loadContent() {
  const context = {window: {COURSE_MODULES: []}};
  vm.createContext(context);
  const directory = path.join(root, 'content');
  if (!fs.existsSync(directory)) return [];
  for (const filename of fs.readdirSync(directory).filter(name => /^chapter-\d{2}\.js$/.test(name)).sort()) {
    vm.runInContext(fs.readFileSync(path.join(directory, filename), 'utf8'), context, {filename,timeout:3000});
  }
  return context.window.COURSE_MODULES.sort((a,b) => a.number-b.number);
}
