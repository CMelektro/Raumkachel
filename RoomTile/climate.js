'use strict';
const climateBaseMessage=handleMessage;
let climateState=null;
const temperatureText=v=>typeof v==='number'&&Number.isFinite(v)?v.toLocaleString('de-DE',{minimumFractionDigits:1,maximumFractionDigits:1})+' °C':'—';
function setClimate(value){
 const c=climateState;if(!c?.enabled||!c.canSet||!Number.isFinite(value)||value<c.min||value>c.max){refreshClimate();return}
 send('ClimateTarget',value);
 // Follow the actuator's feedback rather than inventing a heating/cooling status.
 refreshClimate();
}
function refreshClimate(){
 const c=climateState,card=$('ClimateCard');if(!card||!c)return;
 $('ClimateName').textContent=c.name||'Raumklima';$('ClimateActual').textContent=temperatureText(c.actual);
 const input=$('ClimateTargetInput');input.min=c.min;input.max=c.max;input.step=c.step||0.5;input.disabled=!c.canSet;
 if(document.activeElement!==input)input.value=typeof c.target==='number'&&Number.isFinite(c.target)?c.target:'';
 const valid=typeof c.target==='number'&&Number.isFinite(c.target);
 $('ClimateMinus').disabled=!c.canSet||!valid||c.target-(c.step||0.5)<c.min;
 $('ClimatePlus').disabled=!c.canSet||!valid||c.target+(c.step||0.5)>c.max;
 $('ClimateHint').textContent=!c.canSet?'Sollwert nicht bedienbar':!valid?'Sollwert unbekannt':'Sollwert-Rückmeldung: '+temperatureText(c.target);
}
handleMessage=function(data){
 let next;try{next=typeof data==='string'?JSON.parse(data):data}catch(e){return}
 climateBaseMessage(next);if(!next||!Array.isArray(next.lights))return;
 climateState=next.climate||null;
 if(!climateState?.enabled){$('ClimateCard')?.remove();if(!$('controls').children.length)el('div',{class:'empty',text:'Keine Geräte aktiviert'},$('controls'));$('tile').classList.toggle('many',$('controls').children.length>4);return}
 if(!$('ClimateCard')){
  $('controls').querySelector('.empty')?.remove();
  const card=el('article',{class:'card climate-card',id:'ClimateCard'},$('controls'));
  el('span',{class:'name',id:'ClimateName'},card);
  const read=el('div',{class:'climate-reading'},card);el('span',{class:'caption',text:'Isttemperatur'},read);el('output',{id:'ClimateActual','aria-label':'Isttemperatur','aria-live':'polite'},read);
  el('div',{class:'climate-caption',text:'Solltemperatur · °C'},card);
  const row=el('div',{class:'climate-target'},card);
  const minus=el('button',{id:'ClimateMinus',type:'button',text:'−','aria-label':'Solltemperatur senken'},row);
  const input=el('input',{id:'ClimateTargetInput',type:'number',inputmode:'decimal','aria-label':'Solltemperatur in Grad Celsius',placeholder:'—'},row);
  const plus=el('button',{id:'ClimatePlus',type:'button',text:'+','aria-label':'Solltemperatur erhöhen'},row);
  minus.onclick=()=>setClimate(Number((climateState.target-climateState.step).toFixed(1)));
  plus.onclick=()=>setClimate(Number((climateState.target+climateState.step).toFixed(1)));
  input.onchange=()=>{const value=input.value===''?NaN:input.valueAsNumber;setClimate(value);input.blur();refreshClimate()};
  input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();input.blur()}};
  el('div',{class:'climate-hint',id:'ClimateHint'},card);
 }
 $('tile').classList.toggle('many',$('controls').children.length>4);refreshClimate();
};
