const fs=require('node:fs/promises'),path=require('node:path'),{execFileSync}=require('node:child_process');
async function doctor(){
 const python=require('./runtime.cjs').python();
 const py=JSON.parse(execFileSync(python,['-c','import sys,json,pypdf; assert sys.version_info >= (3,10); print(json.dumps({"python":sys.version.split()[0],"pypdf":pypdf.__version__}))'],{encoding:'utf8'}));
 const {chromium}=require('playwright');let browser;
 try{browser=await chromium.launch({headless:true,...(process.env.CHROME?{executablePath:process.env.CHROME}:{})});var browserVersion=browser.version()}finally{await browser?.close()}
 const output=path.join(__dirname,'.cache','setup-check.pdf');
 await require('./renderer.cjs').render(path.join(__dirname,'starter.html'),output,{contents:'two'});
 const pages=Number(execFileSync(python,['-c','from pypdf import PdfReader; import sys; r=PdfReader(sys.argv[1]); assert len(r.pages)>0; assert r.named_destinations; print(len(r.pages))',output],{encoding:'utf8'}));
 const toolchain={checkedAt:new Date().toISOString(),platform:process.platform,arch:process.arch,node:process.version,playwright:require('playwright/package.json').version,browser:browserVersion,browserSource:process.env.CHROME?'CHROME override':'Playwright Chromium',...py};
 await fs.writeFile(path.join(__dirname,'toolchain.json'),JSON.stringify(toolchain,null,2)+'\n');
 console.log(`PDF export verified (${pages} pages, resolved contents destinations). Toolchain recorded in toolchain.json.`);
}
doctor().catch(e=>{console.error('Setup check failed: '+e.message+'\nRun node setup.cjs. On Linux, its default installs required browser OS libraries; use --skip-system-deps only when those are already installed. CHROME can select an installed browser.');process.exitCode=1});
