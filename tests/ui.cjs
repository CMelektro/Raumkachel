const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
class Element{
 constructor(tag,doc){this.tagName=tag;this.doc=doc;this.children=[];this.attributes={};this._text='';this.hidden=false;this.disabled=false;this.value='';this.style={setProperty:(k,v)=>{this.styles??={};this.styles[k]=v}};this.classList={toggle:(k,v)=>{const a=new Set((this.attributes.class||'').split(' ').filter(Boolean));if(v)a.add(k);else a.delete(k);this.attributes.class=[...a].join(' ')}}}
 setAttribute(k,v){this.attributes[k]=String(v);if(k==='id')this.doc.ids[v]=this;if(k==='value')this.value=v}
 getAttribute(k){return this.attributes[k]??null} set className(v){this.attributes.class=v} get className(){return this.attributes.class||''}
 set textContent(v){this._text=String(v);this.replaceChildren()}get textContent(){return this._text+this.children.map(c=>c.textContent).join('')}
 append(c){this.children.push(c)}replaceChildren(){const remove=c=>{if(c.attributes.id)delete this.doc.ids[c.attributes.id];c.children.forEach(remove)};this.children.forEach(remove);this.children=[]}addEventListener(k,f){this['on'+k]=f}
 serialize(){const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');return '<'+this.tagName+Object.entries(this.attributes).map(([k,v])=>' '+k+'="'+escape(v)+'"').join('')+'>'+escape(this._text)+this.children.map(c=>c.serialize()).join('')+'</'+this.tagName+'>'}
}
const document={ids:{},getElementById(id){return this.ids[id]||null},createElement(tag){return new Element(tag,this)},createElementNS(ns,tag){return new Element(tag,this)}};document.documentElement=document.createElement('html');
const html=fs.readFileSync(__dirname+'/../RoomTile/module.html','utf8');for(const match of html.matchAll(/<(\w+)[^>]*\bid="([^"]+)"[^>]*>/g)){const n=document.createElement(match[1]);n.setAttribute('id',match[2])}
const commands=[];const context={document,requestAction:(...a)=>commands.push(a),setTimeout:()=>0,console};vm.createContext(context);vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1],context);
const light=(id,type,x,y)=>({id,name:'Licht '+id,type,x,y,scale:100,enabled:true,useSwitch:true,useDim:true,canSwitch:true,canDim:true,on:true,level:70});
const demo={title:'Küche',showTitle:true,showSummary:true,room:'kitchen',backgroundColor:'#202124',textColor:'#fff',lights:[light('L1','pendant',460,85),light('L2','spots',740,65),light('L3','led',775,305),light('L4','floor',115,285)],sockets:[{id:'S1',name:'Kaffeemaschine',enabled:true,on:false,canSwitch:true},{id:'S2',name:'Arbeitsfläche',enabled:true,on:true,canSwitch:true}],blinds:[{id:'B1',name:'Fenster links',enabled:true,useMove:true,useStop:true,usePosition:true,canMove:true,canStop:true,canPosition:true,position:35},{id:'B2',name:'Fenster rechts',enabled:true,useMove:true,useStop:true,usePosition:true,canMove:true,canStop:true,canPosition:true,position:70}]};
demo.lights[2].useDim=false;demo.lights[3].enabled=false;
const get=id=>document.getElementById(id),update=()=>context.handleMessage(JSON.parse(JSON.stringify(demo)));
update();assert(get('B1Graphic'));assert.equal(get('B1Slats').getAttribute('height'),'79.8');assert.equal(get('B2Slats').getAttribute('height'),'159.6');assert.equal(get('L4Graphic'),null);assert.equal(get('L4Card'),null);
get('L1Switch').onclick();assert.deepEqual(commands.pop(),['L1Switch',1]);get('B1Up').onclick();assert.deepEqual(commands.pop(),['B1Up',1]);get('B1Stop').onclick();assert.deepEqual(commands.pop(),['B1Stop',1]);get('B1Range').value=28;get('B1Range').oninput();assert.equal(commands.length,0);get('B1Range').onchange();assert.deepEqual(commands.pop(),['B1Position',28]);assert.equal(get('B1Slats').getAttribute('height'),'79.8');
demo.lights[0].useSwitch=false;update();assert.equal(get('L1Switch'),null);assert(get('L1Range'));demo.lights[0].useDim=false;update();assert.equal(get('L1Card'),null);assert(get('L1Graphic'));
demo.blinds[0].usePosition=false;demo.blinds[0].useStop=false;update();assert.equal(get('B1Range'),null);assert.equal(get('B1Stop'),null);assert(get('B1Up'));demo.blinds[0].enabled=false;update();assert.equal(get('B1Graphic'),null);assert.equal(get('B1Card'),null);
demo.sockets[0].enabled=false;update();assert.equal(get('S1Graphic'),null);assert.equal(get('S1Card'),null);
demo.lights[1].on=false;demo.lights[1].level=85;update();assert.equal(get('L2Glow').getAttribute('opacity'),'0');assert.equal(get('L2Switch').getAttribute('aria-checked'),'false');
demo.blinds[1].position=null;update();assert.equal(get('B2Percent').textContent,'—');assert.equal(get('B2State').textContent,'Position unbekannt');
for(const type of ['pendant','floor','spots','led','panel','wall']){demo.lights[1].type=type;update();assert(get('L2Graphic').children.length>=3)}
for(const room of ['kitchen','living','bedroom','neutral']){demo.room=room;update();assert(get('roomLayer').children.length>0)}
demo.title='';demo.showSummary=false;update();assert(get('header').hidden);demo.title='<script>alert(1)</script>';demo.showTitle=true;update();assert.equal(get('title').textContent,demo.title);assert.equal(get('title').children.length,0);
// Return to the representative kitchen configuration for the offline preview.
demo.title='Küche';demo.showSummary=true;demo.room='kitchen';demo.lights[0].useSwitch=true;demo.lights[0].useDim=true;demo.lights[1].type='spots';demo.lights[1].on=true;demo.lights[1].level=45;demo.sockets[0].enabled=true;demo.blinds[0].enabled=true;demo.blinds[0].usePosition=true;demo.blinds[0].useStop=true;demo.blinds[1].position=70;
demo.lights[0].name='Hängelampen';demo.lights[1].name='Deckenspots';demo.lights[2].name='Arbeitslicht';demo.lights[3].name='Leseleuchte';update();
fs.writeFileSync(__dirname+'/demo.json',JSON.stringify(demo,null,2));
const defs=html.match(/<defs>([\s\S]*?)<\/defs>/)[0];
const scene='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="650" viewBox="0 0 1000 650"><style>.frame-line{fill:none;stroke:#a19b89;stroke-width:1.2;stroke-opacity:.5;stroke-linejoin:round;stroke-linecap:round}.scene-label{font:11px sans-serif;fill:#c9c7bf;stroke:none;opacity:.64}</style><rect width="1000" height="650" fill="#202124"/>'+defs+['roomLayer','blindLayer','lightLayer','socketLayer'].map(id=>get(id).serialize()).join('')+'</svg>';
fs.writeFileSync(__dirname+'/scene.svg',scene);
console.log('PASS: conditional cards and graphics, six fixtures, four rooms, command routing, independent switch state, feedback-driven shutters, unknown position, escaped names, hidden header.');
// Exercise the real offline-preview script with the same DOM adapter.
const preview=fs.readFileSync(__dirname+'/../Vorschau.html','utf8');for(const match of preview.matchAll(/<(\w+)[^>]*\bid="([^"]+)"[^>]*>/g)){if(!get(match[2])){const n=document.createElement(match[1]);n.setAttribute('id',match[2])}}
context.window=context;const timers=new Map();let timerId=0;context.setInterval=fn=>{timers.set(++timerId,fn);return timerId};context.clearInterval=id=>timers.delete(id);
vm.runInContext([...preview.matchAll(/<script>([\s\S]*?)<\/script>/g)][1][1],context);
assert.equal(get('controls').children.length,8);assert(get('L4Graphic'));get('L1Switch').onclick();assert.equal(get('L1Switch').getAttribute('aria-checked'),'false');
get('B1Down').onclick();assert.equal(timers.size,1);for(const fn of timers.values())fn();assert.equal(get('B1Slats').getAttribute('height'),String(228*.37));get('B1Stop').onclick();assert.equal(timers.size,0);
const groups=get('demoSettings').children.filter(n=>n.className==='demo-group');const enabled=groups[0].children[0].children[0];enabled.checked=false;enabled.onchange();assert.equal(get('L1Graphic'),null);assert.equal(get('L1Card'),null);
console.log('PASS: offline preview controls, full eight-device configuration, simulated blind movement and stop, activation toggle.');
// Room-specific regression checks and render sources for all requested motifs.
const roomKeys=vm.runInContext('Object.keys(ROOM_PRESETS)',context);assert.equal(roomKeys.length,13);
fs.mkdirSync(__dirname+'/renders',{recursive:true});
const defaultTypes={corridor:'wall',hall:'wall',guest_wc:'wall',children:'panel',office:'panel',utility:'panel',technical:'panel',storage:'panel',staircase:'wall'};
const shapes=new Set();
for(const room of roomKeys){
 const sample=JSON.parse(JSON.stringify(demo));sample.room=room;sample.title=vm.runInContext(`ROOM_PRESETS[${JSON.stringify(room)}].name`,context);
 sample.lights.forEach((d,i)=>{d.enabled=i<3;d.useSwitch=true;d.useDim=true;d.on=true;d.level=75;d.autoPosition=true});sample.lights[0].type=defaultTypes[room]||'pendant';sample.lights[1].type='spots';sample.lights[2].type='led';sample.blinds.forEach(d=>{d.enabled=true;d.position=40});context.handleMessage(sample);
 shapes.add(get('roomLayer').serialize());
 for(const type of ['pendant','floor','spots','led','panel','wall']){sample.lights[0].type=type;context.handleMessage(sample);assert(get('L1Graphic'));assert(!get('L1Graphic').serialize().includes('NaN'));assert(get('B1Graphic'));}
 sample.lights[0].type=defaultTypes[room]||'pendant';context.handleMessage(sample);
 if(room==='staircase')assert(get('L3Source').serialize().includes('M0 270L480-10'));
 const out='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="650" viewBox="0 0 1000 650"><style>.frame-line{fill:none;stroke:#a19b89;stroke-width:1.2;stroke-opacity:.5;stroke-linejoin:round;stroke-linecap:round}.scene-label{font:11px sans-serif;fill:#c9c7bf;stroke:none;opacity:.64}</style><rect width="1000" height="650" fill="#202124"/>'+defs+['roomLayer','blindLayer','lightLayer','socketLayer'].map(id=>get(id).serialize()).join('')+'</svg>';
 fs.writeFileSync(__dirname+'/renders/'+room+'.svg',out);
 sample.lights[2].enabled=false;sample.blinds[0].enabled=false;context.handleMessage(sample);assert.equal(get('L3Graphic'),null);assert.equal(get('B1Graphic'),null);
}
assert.equal(shapes.size,13);
const manual=JSON.parse(JSON.stringify(demo));manual.room='staircase';manual.lights[0].autoPosition=false;manual.lights[0].x=123;manual.lights[0].y=234;manual.lights[0].scale=77;context.handleMessage(manual);assert.equal(get('L1Graphic').getAttribute('transform'),'translate(123 234) scale(0.77)');
console.log('PASS: 13 distinct rooms × 6 fixture types, room-specific blinds, stair LED path, manual placement and per-room hiding.');
for(const type of ['pendant','floor','spots','led','panel','wall']){
 const sample=JSON.parse(JSON.stringify(demo));sample.room='kitchen';sample.lights.forEach(d=>{d.enabled=true;d.type=type;d.autoPosition=true});context.handleMessage(sample);
 const transforms=sample.lights.map(d=>get(d.id+'Graphic').getAttribute('transform'));assert.equal(new Set(transforms).size,4);
}
console.log('PASS: four identical fixture types receive distinct automatic placements.');
const socketSample=JSON.parse(JSON.stringify(demo));socketSample.sockets.forEach(d=>d.enabled=true);socketSample.sockets[0].on=true;socketSample.sockets[1].on=false;context.handleMessage(socketSample);
assert.equal(get('S1SocketGlow').getAttribute('opacity'),'.5');assert.equal(get('S1SocketGlyph').getAttribute('stroke'),'#ffe1a5');assert.equal(get('S2SocketGlow').getAttribute('opacity'),'0');
socketSample.sockets[0].on=false;context.handleMessage(socketSample);assert.equal(get('S1SocketGlow').getAttribute('opacity'),'0');assert.equal(get('S1SocketGlyph').getAttribute('stroke'),'#a19b89');
socketSample.sockets[0].enabled=false;context.handleMessage(socketSample);assert.equal(get('S1SocketGlow'),null);
console.log('PASS: full socket glow turns on/off from feedback and disappears when disabled.');
