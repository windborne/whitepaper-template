const fs=require('node:fs/promises'),path=require('node:path');const {render}=require('./renderer.cjs');
(async()=>{
 const args=process.argv.slice(2),i=args.indexOf('--settings');let settings={};if(i>=0){settings=JSON.parse(args[i+1]);args.splice(i,2)}
 if(args.length!==2)throw Error('Usage: node publish.cjs source.html output-directory [--settings JSON]');
 const source=path.resolve(args[0]),dest=path.resolve(args[1]),name=path.basename(source),pdf=name.replace(/\.html$/,'.pdf');
 if(!name.endsWith('.html')||dest===path.dirname(source))throw Error('Publish to a separate directory');
 await fs.mkdir(dest,{recursive:true});const effective=await render(source,path.join(dest,pdf),settings);
 let html=await fs.readFile(source,'utf8');const re=/<script\b[^>]*\bid="document-config"[^>]*>([\s\S]*?)<\/script>/;
 const match=html.match(re);if(!match)throw Error('Missing document-config');const cfg=JSON.parse(match[1]);cfg.defaults={...cfg.defaults,...effective};cfg.published=true;cfg.publishedSettings=effective;cfg.pdf=pdf;
 html=html.replace(re,()=>'<script type="application/json" id="document-config">'+JSON.stringify(cfg).replaceAll('<','\\u003c')+'</script>');
 await fs.writeFile(path.join(dest,name),html);
 for(const file of ['style.css','fonts.css','controls.js','licenses','LICENSE-LUCIDE'])await fs.cp(path.join(__dirname,file),path.join(dest,file),{recursive:true});
 // Copy additional local image/font assets referenced directly by the document.
 for(const match of html.matchAll(/(?:src|href)="([^"#]+\.(?:svg|png|jpg|jpeg|webp|woff2?))(?:[?#][^"]*)?"/gi)){
  const relative=decodeURIComponent(match[1]);if(/^(?:[a-z]+:|\/)/i.test(relative))continue;
  const asset=await fs.realpath(path.resolve(path.dirname(source),relative));if(!asset.startsWith(path.dirname(source)+path.sep)||relative.split('/').includes('..'))throw Error('Asset must be inside document directory: '+relative);
  await fs.mkdir(path.dirname(path.join(dest,relative)),{recursive:true});await fs.copyFile(asset,path.join(dest,relative));
 }
 console.log('Published '+path.join(dest,name)+' with matching '+pdf);
})().catch(e=>{console.error(e.message);process.exitCode=1});
