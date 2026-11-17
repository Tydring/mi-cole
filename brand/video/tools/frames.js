const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file:///home/user/mi-cole/brand/video/sting.html');await p.evaluate(()=>document.fonts.ready);
const N=240;for(let i=0;i<N;i++){await p.evaluate(t=>render(t),i/30);
await p.screenshot({path:`frames/${String(i).padStart(4,'0')}.png`});}
await b.close();})();
