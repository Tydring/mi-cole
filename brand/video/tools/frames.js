const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const [W,H]=process.argv[3].split('x').map(Number);const p=await b.newPage({viewport:{width:W,height:H}});
await p.goto('file:///home/user/mi-cole/brand/video/sting.html?r='+process.argv[2]);await p.evaluate(()=>document.fonts.ready);
const N=315;for(let i=0;i<N;i++){await p.evaluate(t=>render(t),i/30);
await p.screenshot({path:`frames_${process.argv[2]}/${String(i).padStart(4,'0')}.png`});}
await b.close();})();
