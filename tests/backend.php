<?php
// Runs the real module against an isolated Symcon API double. Never contacts KNX.
error_reporting(E_ALL);
set_error_handler(function($severity,$message,$file,$line){throw new ErrorException($message,0,$severity,$file,$line);});
define('VM_UPDATE',10603);
$variables=[];$writes=[];$failWrite=false;$checks=0;
class IPSModule {
    public $InstanceID=12345;
    public $properties=[],$references=[],$messages=[],$updates=[],$visualization=null;
    public function Create(){} public function ApplyChanges(){}
    public function RegisterPropertyString($p,$v){$this->properties[$p]=$v;}
    public function RegisterPropertyBoolean($p,$v){$this->properties[$p]=$v;}
    public function RegisterPropertyInteger($p,$v){$this->properties[$p]=$v;}
    public function ReadPropertyString($p){return $this->properties[$p];}
    public function ReadPropertyBoolean($p){return $this->properties[$p];}
    public function ReadPropertyInteger($p){return $this->properties[$p];}
    public function GetReferenceList(){return array_keys($this->references);}
    public function RegisterReference($id){$this->references[$id]=true;}
    public function UnregisterReference($id){unset($this->references[$id]);}
    public function GetMessageList(){return $this->messages;}
    public function RegisterMessage($id,$msg){$this->messages[$id]=[$msg];}
    public function UnregisterMessage($id,$msg){unset($this->messages[$id]);}
    public function SetVisualizationType($v){$this->visualization=$v;}
    public function UpdateVisualizationValue($v){$this->updates[]=json_decode($v,true,512,JSON_THROW_ON_ERROR);}
}
$objectNames=[12345=>'Raumkachel',12346=>'Andere Instanz'];
function IPS_GetName($id){return $GLOBALS['objectNames'][$id];}
function IPS_SetName($id,$name){$GLOBALS['objectNames'][$id]=$name;return true;}
function IPS_VariableExists($id){return isset($GLOBALS['variables'][$id]);}
function IPS_GetVariable($id){return $GLOBALS['variables'][$id];}
function GetValue($id){return $GLOBALS['variables'][$id]['value'];}
function RequestAction($id,$value){$GLOBALS['writes'][]=[$id,$value];return !$GLOBALS['failWrite'];}
function variable($id,$type,$value,$action=10001,$custom=0){$GLOBALS['variables'][$id]=['VariableType'=>$type,'value'=>$value,'VariableAction'=>$action,'VariableCustomAction'=>$custom,'VariableIsLocked'=>false];}
function eq($actual,$expected,$why){$GLOBALS['checks']++;if($actual!==$expected)throw new Exception($why.' expected '.json_encode($expected).' got '.json_encode($actual));}
function fails($fn,$why){$caught=false;try{$fn();}catch(Throwable $e){$caught=true;}eq($caught,true,$why);}
require __DIR__.'/../RoomTile/module.php';
$m=new Raumkachel();$m->Create();eq($m->visualization,1,'Symcon 9.0 HTML SDK activated');
$m->visualization=0;$m->ApplyChanges();eq($m->visualization,1,'existing instance switches to Symcon 9.0 HTML presentation during update');
$m->properties['Title']='  Gäste-WC  ';$m->properties['ShowTitle']=false;$m->ApplyChanges();
eq(IPS_GetName(12345),'Gäste-WC','room name updates own instance even with hidden title');
eq(IPS_GetName(12346),'Andere Instanz','other instance untouched');
$m->properties['Title']=' ';$m->ApplyChanges();eq(IPS_GetName(12345),'Gäste-WC','blank name preserves instance name');
$m->properties['Title']='Küche';$m->properties['ShowTitle']=true;
$m->ApplyChanges();$initial=end($m->updates);eq(count($initial['lights']),4,'four lights');eq(count($initial['blinds']),2,'two blinds');eq($initial['sockets'][0]['enabled'],false,'unassigned socket hidden');
$map=[['Pendant','PendantSwitch','PendantSwitchStatus','PendantControl','PendantStatus'],['Spot','SpotSwitch','SpotSwitchStatus','SpotControl','SpotStatus'],['Led','LedControl','LedStatus','LedDimControl','LedDimStatus'],['Light4','Light4Switch','Light4SwitchStatus','Light4Control','Light4Status']];
foreach($map as $i=>$row){
 [$p,$sw,$sf,$dim,$df]=$row;$base=20000+$i*10;
 foreach([$sw,$sf,$dim,$df] as $k=>$prop)$m->properties[$prop]=$base+$k;
 variable($base,0,true);variable($base+1,0,false,0);variable($base+2,1,85);variable($base+3,1,60,0);
 $m->properties[$p.'Enabled']=true;$m->properties[$p.'UseSwitch']=true;$m->properties[$p.'UseDim']=true;
 $m->ApplyChanges();$snapshot=end($m->updates);eq($snapshot['lights'][$i]['on'],false,'feedback overrides retained dim and command');eq($snapshot['lights'][$i]['level'],60,'dimming feedback wins');
 $writes=[];$m->RequestAction('L'.($i+1).'Switch',1);eq($writes,[[$base,true]],'switch writes ONLY boolean target');
 $variables[$base+1]['value']=true;$writes=[];$m->RequestAction('L'.($i+1).'Switch',1);eq($writes,[[$base,false]],'switch off follows feedback');
 foreach([[100,1,25,25],[255,1,50,128],[1,2,25,0.25]] as [$maximum,$type,$percent,$raw]){
  $m->properties[$p.'Maximum']=$maximum;variable($base+2,$type,0);variable($base+3,$type,$maximum,0);
  $writes=[];$m->RequestAction('L'.($i+1).'Dim',$percent);eq($writes,[[$base+2,$raw]],'absolute dim scaling/type');
 }
 $m->properties[$p.'Maximum']=100;variable($base+2,1,80);variable($base+3,1,80,0);
 $variables[$base+1]['value']=false;$m->properties[$p.'UseSwitch']=false;$m->ApplyChanges();$snapshot=end($m->updates);eq($snapshot['lights'][$i]['on'],false,'hidden switch retains physical feedback');
 foreach([[false,false,false],[true,false,false],[true,true,false],[true,false,true]] as [$enabled,$switch,$dimOn]){
  $m->properties[$p.'Enabled']=$enabled;$m->properties[$p.'UseSwitch']=$switch;$m->properties[$p.'UseDim']=$dimOn;$writes=[];
  $m->RequestAction('L'.($i+1).'Switch',1);eq(count($writes),$enabled&&$switch?1:0,'disabled switch blocked server-side');$writes=[];
  $m->RequestAction('L'.($i+1).'Dim',50);eq(count($writes),$enabled&&$dimOn?1:0,'disabled dim blocked server-side');
 }
 $m->properties[$p.'Enabled']=true;$m->properties[$p.'UseDim']=true;$m->properties[$p.'UseSwitch']=true;
}
foreach(['Socket','Socket2'] as $i=>$p){
 $base=21000+$i*10;$m->properties[$p.'Control']=$base;$m->properties[$p.'Status']=$base+1;$flag=$i?'Socket2Enabled':'ShowSocket';$m->properties[$flag]=true;
 variable($base,0,true);variable($base+1,0,false,0);$writes=[];$m->RequestAction('S'.($i+1).'Switch',1);eq($writes,[[$base,true]],'socket follows feedback');
 $m->properties[$flag]=false;$writes=[];$m->RequestAction('S'.($i+1).'Switch',1);eq($writes,[],'disabled socket blocked');
 $m->properties[$flag]=true;variable($base,1,100);$m->ApplyChanges();$snapshot=end($m->updates);eq($snapshot['sockets'][$i]['enabled'],false,'wrong socket type hidden');variable($base,0,true);
}
foreach(['Blind1','Blind2'] as $i=>$p){
 $base=22000+$i*10;$m->properties[$p.'Enabled']=true;
 foreach(['Move','Stop','Position','Feedback'] as $k=>$suffix)$m->properties[$p.$suffix]=$base+$k;
 variable($base,0,false);variable($base+1,0,false);variable($base+2,1,0);variable($base+3,1,30,0);
 foreach([false,true] as $down){$m->properties[$p.'DownValue']=$down;foreach(['Up'=>!$down,'Down'=>$down] as $a=>$expected){$writes=[];$m->RequestAction('B'.($i+1).$a,1);eq($writes,[[$base,$expected]],'blind direction polarity');}}
 foreach([false,true] as $stop){$m->properties[$p.'StopValue']=$stop;$writes=[];$m->RequestAction('B'.($i+1).'Stop',1);eq($writes,[[$base+1,$stop]],'stop polarity');}
 foreach([[100,1,25,25],[255,1,50,128],[1,2,25,0.25]] as [$max,$type,$pct,$raw]){
  $m->properties[$p.'Maximum']=$max;variable($base+2,$type,0);variable($base+3,$type,$max,0);
  foreach([false,true] as $invert){$m->properties[$p.'Invert']=$invert;$writes=[];$m->RequestAction('B'.($i+1).'Position',$pct);$expected=($invert?100-$pct:$pct)*$max/100;$expected=$type===1?(int)round($expected):(float)$expected;eq($writes,[[$base+2,$expected]],'blind absolute position conversion');$snapshot=end($m->updates);eq($snapshot['blinds'][$i]['position'],$invert?0:100,'blind feedback inverse');}
 }
 $m->properties[$p.'Maximum']=100;$m->properties[$p.'Invert']=false;variable($base+2,1,20);variable($base+3,1,30,0);
 foreach(['UseMove'=>['Up','Down'],'UseStop'=>['Stop'],'UsePosition'=>['Position']] as $flag=>$actions){$m->properties[$p.$flag]=false;foreach($actions as $a){$writes=[];$m->RequestAction('B'.($i+1).$a,50);eq($writes,[],'disabled blind function blocked');}$m->properties[$p.$flag]=true;}
 $m->properties[$p.'Enabled']=false;$writes=[];foreach(['Up','Down','Stop','Position'] as $a)$m->RequestAction('B'.($i+1).$a,50);eq($writes,[],'inactive blind entirely blocked');$m->properties[$p.'Enabled']=true;
 $m->properties[$p.'Position']=0;$m->properties[$p.'Feedback']=0;$m->ApplyChanges();$snapshot=end($m->updates);eq($snapshot['blinds'][$i]['position'],null,'unknown blind position preserved');$m->properties[$p.'Position']=$base+2;$m->properties[$p.'Feedback']=$base+3;
}
// Missing/disabled/locked actions, invalid values and failure reporting.
foreach([[0,0,false],[10001,1,false],[0,10002,true],[10001,0,true]] as [$action,$custom,$writable]){variable(20000,0,false,$action,$custom);$m->ApplyChanges();$snapshot=end($m->updates);eq($snapshot['lights'][0]['canSwitch'],$writable,'Symcon custom-action semantics');if(!$writable){$writes=[];fails(fn()=>$m->RequestAction('L1Switch',1),'non-writable rejected');eq($writes,[],'no invalid writes');eq(end($m->updates),['error'=>true],'error sent to HTML SDK');}}
variable(20000,0,false);$variables[20000]['VariableIsLocked']=true;$m->ApplyChanges();$snapshot=end($m->updates);eq($snapshot['lights'][0]['canSwitch'],false,'locked variable disabled');variable(20000,0,false);
foreach([-1,101,'abc',INF,NAN,[],true] as $bad){$writes=[];fails(fn()=>$m->RequestAction('L1Dim',$bad),'invalid percentage rejected');eq($writes,[],'invalid percent never sent');}
$m->properties['PendantMaximum']=1;variable(20002,1,0);$m->ApplyChanges();$snapshot=end($m->updates);eq($snapshot['lights'][0]['canDim'],false,'normalized range requires Float');fails(fn()=>$m->RequestAction('L1Dim',30),'integer 0–1 rejected');$m->properties['PendantMaximum']=100;
$failWrite=true;fails(fn()=>$m->RequestAction('L1Switch',1),'failed downstream action propagated');eq(end($m->updates),['error'=>true],'downstream failure shown');$failWrite=false;
fails(fn()=>$m->RequestAction('L5Switch',1),'unknown channel rejected');
// Reference lifecycle and external feedback refresh.
$m->ApplyChanges();eq(isset($m->references[20001]),true,'feedback referenced');$before=count($m->updates);$variables[20001]['value']=true;$m->MessageSink(0,20001,VM_UPDATE,[]);eq(count($m->updates),$before+1,'external wall switch triggers refresh');eq(end($m->updates)['lights'][0]['on'],true,'external state in snapshot');
$m->properties['PendantSwitchStatus']=0;$m->ApplyChanges();eq(isset($m->references[20001]),false,'old reference removed');eq(isset($m->messages[20001]),false,'old message removed');
// Climate: actual and feedback are read-only; only the actuator target is written.
eq($initial['climate']['enabled'],false,'climate off by default');
variable(45000,2,21.5,0);variable(45001,2,22.0);variable(45002,2,20.5,0);
$m->properties['ClimateEnabled']=true;$m->properties['ClimateActual']=45000;$m->properties['ClimateTarget']=45001;$m->properties['ClimateFeedback']=45002;
$m->ApplyChanges();$c=end($m->updates)['climate'];eq($c['actual'],21.5,'actual read');eq($c['target'],20.5,'feedback wins');eq($c['canSet'],true,'writable float target');eq($c['step'],0.5,'half-degree buttons');
$writes=[];$m->RequestAction('ClimateTarget',22.5);eq($writes,[[45001,22.5]],'only target is written');eq(end($m->updates)['climate']['target'],20.5,'no invented actuator feedback');
foreach([-1,31,'bad',INF,NAN,[],true] as $bad){$writes=[];fails(fn()=>$m->RequestAction('ClimateTarget',$bad),'invalid temperature rejected');eq($writes,[],'invalid temperature not written');}
foreach([5.0,30.0] as $v){$writes=[];$m->RequestAction('ClimateTarget',$v);eq($writes,[[45001,$v]],'inclusive configured bounds');}
$m->properties['ClimateEnabled']=false;$writes=[];$m->RequestAction('ClimateTarget',22);eq($writes,[],'disabled climate never writes');$m->properties['ClimateEnabled']=true;
$variables[45001]['VariableCustomAction']=1;$m->ApplyChanges();eq(end($m->updates)['climate']['canSet'],false,'disabled target action');fails(fn()=>$m->RequestAction('ClimateTarget',22),'disabled action rejected');
variable(45001,1,22);$m->ApplyChanges();eq(end($m->updates)['climate']['step'],1,'integer target full-degree buttons');$writes=[];$m->RequestAction('ClimateTarget',23);eq($writes,[[45001,23]],'integer preserved');fails(fn()=>$m->RequestAction('ClimateTarget',22.5),'fraction rejected for integer');
$m->properties['ClimateFeedback']=0;$m->ApplyChanges();eq(end($m->updates)['climate']['target'],22,'target read without separate feedback');
$m->properties['ClimateMin']=30;$m->ApplyChanges();eq(end($m->updates)['climate']['canSet'],false,'invalid limits disable UI');fails(fn()=>$m->RequestAction('ClimateTarget',30),'invalid limits reject command');$m->properties['ClimateMin']=5;
$before=count($m->updates);$variables[45000]['value']=19.5;$m->MessageSink(0,45000,VM_UPDATE,[]);eq(count($m->updates),$before+1,'temperature live update');eq(end($m->updates)['climate']['actual'],19.5,'temperature feedback refreshed');
$variables[45000]['value']=NAN;$m->ApplyChanges();eq(end($m->updates)['climate']['actual'],null,'nonfinite sensor cannot break JSON');
$m->properties['ClimateActual']=0;$m->ApplyChanges();eq(end($m->updates)['climate']['actual'],null,'unassigned actual unknown');eq(isset($m->references[45000]),false,'temperature old reference removed');
// Config form matches registered properties, types and unique names.
$form=json_decode(file_get_contents(__DIR__.'/../RoomTile/form.json'),true,512,JSON_THROW_ON_ERROR);$names=[];
$walk=function($node)use(&$walk,&$names,$m){if(!is_array($node))return;if(isset($node['name'])){$p=$node['name'];eq(array_key_exists($p,$m->properties),true,'form property '.$p.' registered');eq(isset($names[$p]),false,'unique form name '.$p);$names[$p]=true;}$children=$node['items']??$node['elements']??[];foreach($children as $child)$walk($child);};$walk($form);eq(count($names),count($m->properties),'every registered property configurable');
$m->properties['Title']='</script><img src=x onerror=alert(1)>'; $markup=$m->GetVisualizationTile();eq(strpos($markup,$m->properties['Title']),false,'title escaped in initial HTML');eq(strlen($markup)<1000000,true,'tile below 1 MB');
file_put_contents(__DIR__.'/backend-snapshot.json',json_encode(end($m->updates),JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE));
echo "PASS: $checks backend/configuration assertions, real PHP ".PHP_VERSION." with mocked Symcon API. HTML ".strlen($markup)." bytes.\n";
