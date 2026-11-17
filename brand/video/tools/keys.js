const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('console',m=>console.log('console:',m.text()));p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file:///home/user/mi-cole/brand/video/sting.html');await p.evaluate(()=>document.fonts.ready);
const ts=JSON.parse(process.argv[2]);
for(const t of ts){await p.evaluate(t=>render(t),t);await p.screenshot({path:`key_${t}.png`});}
await b.close();})();
