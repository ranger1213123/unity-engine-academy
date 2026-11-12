import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {root,loadContent} from './content-loader.mjs';
const editor=process.env.UNITY_ATLAS_EDITOR || path.resolve(root,'../newunity/Editor');
const assemblies=process.env.UNITY_ATLAS_ASSEMBLIES || path.resolve(root,'../projects/tinysword/Library/ScriptAssemblies');
const data=path.join(editor,'Data');
const compiler=path.join(data,'DotNetSdkRoslyn/csc.dll');
const host=path.join(data,'NetCoreRuntime/dotnet.exe');
const netstandard=path.join(data,'NetStandard/ref/2.1.0/netstandard.dll');
if(![compiler,host,netstandard].every(filename=>fs.existsSync(filename)))throw new Error('未找到Unity 6.3自带编译器，可通过UNITY_ATLAS_EDITOR指定编辑器目录。');
function dlls(directory){return fs.existsSync(directory)?fs.readdirSync(directory).filter(name=>name.endsWith('.dll')).map(name=>path.join(directory,name)):[];}
const references=[netstandard,path.join(data,'NetStandard/compat/2.1.0/shims/netfx/mscorlib.dll'),...dlls(path.join(data,'Managed/UnityEngine')),...dlls(assemblies).filter(filename=>!filename.endsWith('Assembly-CSharp.dll'))];
// NUnit不是UnityEngine模块，测试课在明确的Test程序集前提下编译。
const packageCache=path.resolve(assemblies,'../../Library/PackageCache');
if(fs.existsSync(packageCache))for(const name of fs.readdirSync(packageCache).filter(name=>name.startsWith('com.unity.ext.nunit'))){const filename=path.join(packageCache,name,'net40/unity-custom/nunit.framework.dll');if(fs.existsSync(filename))references.push(filename);}
const directory=fs.mkdtempSync(path.join(os.tmpdir(),'unity-atlas-compile-'));
const modules=loadContent();
const results=[];
for(const lesson of modules.flatMap(module=>module.lessons)){
  const files=lesson.code?.files || (lesson.code?.source?[lesson.code]:[]);
  if(!files.length||lesson.code.language!=='csharp')continue;
  const source=files.map(file=>file.source).join('\n');
  if(/using Unity\.Entities|using Unity\.AI\.Navigation|using UnityEngine\.AddressableAssets|using Unity\.Cinemachine|using Cinemachine/.test(source)){
    results.push({lesson:lesson.id,status:'skipped',reason:'示例依赖未安装的可选包；教材需明确安装前提。'});continue;
  }
  const filenames=files.map((file,index)=>{const filename=path.join(directory,lesson.id+'-'+index+'.cs');fs.writeFileSync(filename,file.source);return filename;});
  const rsp=path.join(directory,lesson.id+'.rsp');
  fs.writeFileSync(rsp,['/nologo','/utf8output','/target:library','/nostdlib+','/langversion:latest','/unsafe+','/define:UNITY_EDITOR;UNITY_STANDALONE_WIN;UNITY_6000_3_OR_NEWER',...references.map(filename=>'/reference:"'+filename+'"'),'/out:"'+path.join(directory,lesson.id+'.dll')+'"',...filenames.map(filename=>'"'+filename+'"')].join('\n'));
  const result=spawnSync(host,[compiler,'@'+rsp],{encoding:'utf8',timeout:30000,windowsHide:true});
  const output=(result.stdout||'')+(result.stderr||'');
  results.push({lesson:lesson.id,filename:lesson.code.filename,status:result.status===0?'compiled':'failed',output:output.trim()});
  if(result.status!==0)console.log(lesson.id+' '+output.trim());
}
const report={checkedAt:new Date().toISOString(),editor,compiled:results.filter(result=>result.status==='compiled').length,failed:results.filter(result=>result.status==='failed').length,skipped:results.filter(result=>result.status==='skipped').length,note:'使用Unity 6.3自带Roslyn和当前项目已安装程序集，在独立临时目录逐例编译。只验证C#语法和引用API，不代表运行时行为、场景配置或跨示例集成已在Unity中测试。未修改或启动用户项目。',temporaryDirectory:directory,results};
fs.writeFileSync(path.join(root,'code-audit.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({...report,results:undefined},null,2));if(report.failed)process.exitCode=1;
