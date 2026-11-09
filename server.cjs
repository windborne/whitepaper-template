const http=require('node:http'),fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto');
const {render,validateSettings}=require('./renderer.cjs');
const root=__dirname,port=Number(process.env.PORT||8743),jobs=new Map();let queued=0,tail=Promise.resolve();
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.pdf':'application/pdf','.woff2':'font/woff2'};
function send(res,status,body,type='text/plain; charset=utf-8'){res.writeHead(status,{'Content-Type':type,'X-Content-Type-Options':'nosniff','Cache-Control':'no-store'});res.end(body)}
function expire(){for(const [id,job]of jobs)if(Date.now()-job.created>1800000){jobs.delete(id);fs.rm(job.dir,{recursive:true,force:true}).catch(()=>{})}}
const server=http.createServer(async(req,res)=>{
 try{
  if(![`127.0.0.1:${port}`,`localhost:${port}`].includes(req.headers.host))return send(res,403,'Local connections only');
  const url=new URL(req.url,'http://'+req.headers.host);expire();
  if(url.pathname==='/api/export'&&req.method==='POST'){
   if(req.headers.origin!=='http://'+req.headers.host||!/^application\/json(?:;|$)/.test(req.headers['content-type']||''))return send(res,403,'Same-origin JSON request required');
   if(queued>=4)return send(res,429,'Export queue is full; try again shortly');
   let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>8192)return send(res,413,'Request too large')}
   let data;try{data=JSON.parse(body);validateSettings(data.settings);if(typeof data.document!=='string'||! /^[a-zA-Z0-9][a-zA-Z0-9_-]*\.html$/.test(data.document))throw Error('Invalid document')}catch(e){return send(res,400,e.message)}
   const source=path.join(root,data.document);try{const real=await fs.realpath(source);if(path.dirname(real)!==root)throw Error();await fs.access(real)}catch{return send(res,404,'Document not found')}
   queued++;const job=tail.then(async()=>{const id=crypto.randomUUID();const dir=path.join(root,'.cache',id);await fs.mkdir(dir,{recursive:true});const file=path.join(dir,data.document.replace(/\.html$/,'.pdf'));try{await render(source,file,data.settings);jobs.set(id,{file,dir,created:Date.now()});return '/generated/'+id+'/'+path.basename(file)}catch(e){await fs.rm(dir,{recursive:true,force:true});throw e}});tail=job.catch(()=>{});
   try{const result=await job;send(res,200,JSON.stringify({url:result}),'application/json')}finally{queued--}return;
  }
  if(req.method!=='GET'&&req.method!=='HEAD')return send(res,405,'Method not allowed');
  if(url.pathname.startsWith('/generated/')){const id=url.pathname.split('/')[2],job=jobs.get(id);if(!job)return send(res,404,'PDF expired. Return to the document and generate it again.');res.setHeader('Content-Disposition','inline; filename="'+path.basename(job.file)+'"');return send(res,200,await fs.readFile(job.file),'application/pdf')}
  let pathname=decodeURIComponent(url.pathname);if(pathname==='/')pathname='/specimen.html';
  // Expose document assets only, never repository internals or local paths.
  if(pathname.split('/').some(p=>p.startsWith('.'))||!Object.hasOwn(types,path.extname(pathname)))return send(res,404,'Not found');
  const file=await fs.realpath(path.join(root,pathname));if(!file.startsWith(root+path.sep))return send(res,403,'Not allowed');
  send(res,200,await fs.readFile(file),types[path.extname(file)]);
 }catch(e){console.error(e.message);send(res,e.code==='ENOENT'?404:500,e.code==='ENOENT'?'Not found':'PDF export failed. Check the server terminal for details.')}
});
server.listen(port,'127.0.0.1',()=>console.log(`Whitepaper editor: http://127.0.0.1:${port}/specimen.html`));
