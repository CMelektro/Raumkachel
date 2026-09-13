// Run with PLAYWRIGHT_MODULE and CHROMIUM_PATH pointing to local test tools.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import assert from 'node:assert/strict';
const dir=path.dirname(fileURLToPath(import.meta.url));
const pw=await import(process.env.PLAYWRIGHT_MODULE||'playwright-core');
const browser=await (pw.chromium||pw.default.chromium).launch({executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--use-gl=disabled','--disable-software-rasterizer'],headless:true});
const page=await browser.newPage({viewport:{width:1280,height:800}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const out=path.join(dir,'browser-output');fs.mkdirSync(out,{recursive:true});
try{
 await page.goto('file://'+path.resolve(dir,'../Vorschau.html'));
 const original=await page.evaluate(()=>JSON.parse(JSON.stringify(previewState)));
 await page.goto('file://'+path.resolve(dir,'../RoomTile/module.html'));
 await page.evaluate(s=>{window.testState=s;window.testCommands=[];window.requestAction=(...args)=>testCommands.push(args);handleMessage(s)},original);
 const report=await page.evaluate(()=>{
  let checks=0;const check=(ok,msg)=>{checks++;if(!ok)throw Error(msg)};const clone=()=>JSON.parse(JSON.stringify(testState));const exists=id=>!!document.getElementById(id);
  for(let mask=0;mask<256;mask++){
   const s=clone();[...s.lights,...s.sockets,...s.blinds].forEach((d,i)=>d.enabled=!!(mask&(1<<i)));handleMessage(s);
   [...s.lights,...s.sockets,...s.blinds].forEach(d=>{check(exists(d.id+'Graphic')===d.enabled,'graphic activation '+mask+' '+d.id);check(exists(d.id+'Card')===d.enabled,'card activation '+mask+' '+d.id)});
  }
  for(let i=0;i<4;i++)for(let mask=0;mask<4;mask++){
   const s=clone();const d=s.lights[i];d.useSwitch=!!(mask&1);d.useDim=!!(mask&2);handleMessage(s);
   check(exists(d.id+'Switch')===d.useSwitch,'light switch visibility');check(exists(d.id+'Range')===d.useDim,'light dim visibility');check(exists(d.id+'Graphic'),'graphic remains active');
  }
  for(let i=0;i<2;i++)for(let mask=0;mask<8;mask++){
   const s=clone();const d=s.blinds[i];d.useMove=!!(mask&1);d.useStop=!!(mask&2);d.usePosition=!!(mask&4);handleMessage(s);
   check(exists(d.id+'Up')===d.useMove,'up visibility');check(exists(d.id+'Down')===d.useMove,'down visibility');check(exists(d.id+'Stop')===d.useStop,'stop visibility');check(exists(d.id+'Range')===d.usePosition,'position visibility');
  }
  const types=['pendant','floor','spots','led','panel','wall'];const bounds=[];
  for(const room of Object.keys(ROOM_PRESETS))for(const type of types){
   const s=clone();s.room=room;s.lights.forEach(d=>{d.type=type;d.enabled=true;d.autoPosition=true});handleMessage(s);
   for(const d of s.lights){
    const n=document.getElementById(d.id+'Source'),b=n.getBBox(),matrix=document.getElementById('scene').getScreenCTM().inverse().multiply(n.getScreenCTM());
    const a=new DOMPoint(b.x,b.y).matrixTransform(matrix),z=new DOMPoint(b.x+b.width,b.y+b.height).matrixTransform(matrix);
    check(Number.isFinite(a.x)&&Number.isFinite(z.y),'finite graphic bounds');
    if(a.x<0||z.x>1000||a.y<0||z.y>650)bounds.push({room,type,id:d.id,bounds:[a.x,a.y,z.x,z.y]});
   }
   check(!document.getElementById('scene').outerHTML.includes('NaN'),'no NaN geometry');
  }
  const s=clone();s.lights[0].on=false;s.lights[0].level=85;handleMessage(s);check(document.getElementById('L1Glow').getAttribute('opacity')==='0','off does not glow from retained dim');
  s.sockets[0].on=true;handleMessage(s);check(document.getElementById('S1SocketGlow').getAttribute('opacity')==='.5','socket fully glows');s.sockets[0].on=false;handleMessage(s);check(document.getElementById('S1SocketGlow').getAttribute('opacity')==='0','socket glow off');
  s.blinds[0].position=null;handleMessage(s);check(document.getElementById('B1Percent').textContent==='—','unknown blind position');
  s.lights[0].canSwitch=false;s.lights[0].canDim=false;s.blinds[0].canMove=false;s.blinds[0].canStop=false;s.blinds[0].canPosition=false;s.sockets[0].canSwitch=false;handleMessage(s);
  for(const id of ['L1Switch','L1Range','B1Up','B1Down','B1Stop','B1Range','S1Switch'])check(document.getElementById(id).disabled,'unassigned disabled '+id);
  s.showTitle=false;s.showSummary=false;handleMessage(s);check(document.getElementById('header').hidden,'header hidden');
  s.showTitle=true;s.title='<img src=x onerror=alert(1)>';s.lights[0].name='<script>alert(1)</script>';handleMessage(s);check(document.getElementById('title').children.length===0,'safe title');check(document.getElementById('L1Name').children.length===0,'safe device name');
  handleMessage('{bad JSON');handleMessage({error:true});check(!document.getElementById('error').hidden,'backend error message visible');
  handleMessage(testState);return {checks,bounds};
 });
 assert.deepEqual(report.bounds,[],'automatic light sources stay within scene');
 // Actual browser mouse/keyboard events: only send dim value on release.
 await page.evaluate(()=>{testCommands.length=0;document.getElementById('error').hidden=true});
 await page.locator('#L1Switch').click();assert.deepEqual(await page.evaluate(()=>testCommands.pop()),['L1Switch',1]);
 const slider=await page.locator('#L1Range').boundingBox();await page.mouse.move(slider.x+slider.width*.7,slider.y+slider.height/2);await page.mouse.down();await page.mouse.move(slider.x+slider.width*.25,slider.y+slider.height/2,{steps:4});
 assert.equal(await page.evaluate(()=>testCommands.length),0,'no drag commands');
 const selected=await page.locator('#L1Range').inputValue();await page.evaluate(()=>{const s=JSON.parse(JSON.stringify(testState));s.lights[0].level=90;handleMessage(s)});assert.equal(await page.locator('#L1Range').inputValue(),selected,'feedback cannot jump active drag');await page.mouse.up();
 const command=await page.evaluate(()=>testCommands.pop());assert.equal(command[0],'L1Dim');assert.equal(command[1],Number(selected));
 for(const a of ['Up','Stop','Down']){await page.locator('#B1'+a).click();assert.deepEqual(await page.evaluate(()=>testCommands.pop()),['B1'+a,1]);}
 await page.locator('#S2Switch').click();assert.deepEqual(await page.evaluate(()=>testCommands.pop()),['S2Switch',1]);
 await page.locator('#B1Range').focus();await page.keyboard.press('ArrowRight');assert.equal((await page.evaluate(()=>testCommands.pop()))[0],'B1Position');
 // Measure layout at practical and deliberately small viewport sizes.
 const layouts=[];
 for(const [width,height] of [[1280,800],[1024,768],[900,900],[800,600],[760,700],[600,800],[390,844],[360,640]]){
  await page.setViewportSize({width,height});await page.evaluate(()=>handleMessage(testState));
  layouts.push(await page.evaluate(()=>{const t=document.getElementById('tile');return {width:innerWidth,height:innerHeight,verticalOverflow:t.scrollHeight-t.clientHeight,horizontalOverflow:t.scrollWidth-t.clientWidth,overlapping:(()=>{const a=document.getElementById('controls').getBoundingClientRect(),b=document.getElementById('scene').getBoundingClientRect();return Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1})()}}));
  await page.screenshot({path:path.join(out,`layout-${width}x${height}.png`),fullPage:true});
 }
 assert(layouts.every(x=>x.verticalOverflow<=1),'no vertical scrolling at tested sizes');
 assert(layouts.every(x=>x.horizontalOverflow<=1),'no horizontal scrolling');assert(layouts.every(x=>!x.overlapping),'controls and scene do not overlap');
 // Full-size room evidence and four LED-circuit cases.
 await page.setViewportSize({width:1400,height:900});const rooms=await page.evaluate(()=>Object.keys(ROOM_PRESETS));
 for(const room of rooms){await page.evaluate(room=>{const s=JSON.parse(JSON.stringify(testState));s.room=room;s.title=ROOM_PRESETS[room].name;handleMessage(s)},room);await page.locator('#scene').screenshot({path:path.join(out,room+'.png')});}
 for(const room of ['kitchen','corridor','staircase']){await page.evaluate(room=>{const s=JSON.parse(JSON.stringify(testState));s.room=room;s.lights.forEach((d,i)=>{d.type='led';d.on=i%2===0;d.autoPosition=true});handleMessage(s)},room);await page.locator('#scene').screenshot({path:path.join(out,room+'-four-led.png')});}
 assert.deepEqual(errors,[],'no browser JS errors');fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({...report,layouts,browser:browser.version(),pageErrors:errors},null,2));console.log(JSON.stringify({checks:report.checks,browser:browser.version(),layouts,pageErrors:errors},null,2));
}finally{await browser.close()}
