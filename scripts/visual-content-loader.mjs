import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {root} from './content-loader.mjs';
export function loadVisuals(){
  const context={window:{}};vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root,'official-visuals.js'),'utf8'),context,{timeout:3000});
  return {figures:context.window.UNITY_OFFICIAL_VISUALS,mapping:context.window.UNITY_LESSON_VISUALS};
}
