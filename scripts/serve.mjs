import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {root} from './content-loader.mjs';
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.md':'text/plain; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
let port=Number(process.argv[2])||4173;
const server=http.createServer((request,response)=>{
  try{
    const url=new URL(request.url,'http://127.0.0.1');
    const requested=decodeURIComponent(url.pathname);
    const filename=path.resolve(root,'.'+(requested==='/'?'/index.html':requested));
    if(filename!==root&&!filename.startsWith(root+path.sep)){response.writeHead(403);response.end('Forbidden');return;}
    const stat=fs.statSync(filename);
    if(!stat.isFile())throw new Error('Not a file');
    response.writeHead(200,{'Content-Type':mime[path.extname(filename)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    fs.createReadStream(filename).pipe(response);
  }catch{response.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});response.end('文件不存在');}
});
server.on('error',error=>{if(error.code==='EADDRINUSE'&&port<4190){port++;server.listen(port,'127.0.0.1');}else{console.error(error);process.exit(1);}});
server.listen(port,'127.0.0.1',()=>console.log(`引擎之内：http://127.0.0.1:${port}`));
