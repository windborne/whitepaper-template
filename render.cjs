const {render}=require('./renderer.cjs');
const path=require('node:path');
(async()=>{
 const args=process.argv.slice(2),optionIndex=args.indexOf('--settings');let settings={};
 if(optionIndex>=0){if(!args[optionIndex+1])throw Error('--settings needs a JSON object');settings=JSON.parse(args[optionIndex+1]);args.splice(optionIndex,2)}
 const docs=args.length?[args[0]]:['starter.html','specimen.html','conop.html','stress-report.html'];
 for(const file of docs){const out=args[1]||file.replace(/\.html$/i,'.pdf');if(path.resolve(out)===path.resolve(file))throw Error('Output must differ from HTML source');await render(path.resolve(file),path.resolve(out),settings);console.log('Wrote '+out)}
})().catch(e=>{console.error(e.message);process.exitCode=1});
