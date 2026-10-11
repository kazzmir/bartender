// Procedural bar sounds: no downloads, codecs, or external audio assets.
let enabled=true;
try { enabled=localStorage.getItem('after-hours-sound')!=='off'; } catch {}
let context,master,ambience,noiseBuffer,paused=false;
function applyVolume(){if(!context)return;master.gain.setTargetAtTime(enabled&&!paused ? .7 : 0,context.currentTime,.035)}
function noise(duration,volume,frequency=1000,offset=0,type='lowpass'){
 if(!context)return;
 const source=context.createBufferSource();source.buffer=noiseBuffer;
 const filter=context.createBiquadFilter();filter.type=type;filter.frequency.value=frequency;
 const gain=context.createGain(),start=context.currentTime+offset;
 gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(volume,start+.012);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
 source.connect(filter).connect(gain).connect(master);source.start(start);source.stop(start+duration+.025);
 source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect()};
}
function tone(frequency,duration,volume,offset=0,type='sine',endFrequency=frequency){
 const oscillator=context.createOscillator(),gain=context.createGain(),start=context.currentTime+offset;
 oscillator.type=type;oscillator.frequency.setValueAtTime(frequency,start);oscillator.frequency.exponentialRampToValueAtTime(endFrequency,start+duration);
 gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(volume,start+.006);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
 oscillator.connect(gain).connect(master);oscillator.start(start);oscillator.stop(start+duration+.025);
 oscillator.onended=()=>{oscillator.disconnect();gain.disconnect()};
}
function clink(offset=0,volume=.12){tone(2100,.28,volume,offset);tone(3160,.16,volume*.4,offset);tone(4700,.1,volume*.12,offset)}
function unlock(){
 if(!enabled)return;
 try{
  if(!context){
   const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)return;
   context=new AudioContext();master=context.createGain();master.gain.value=paused?0:.7;master.connect(context.destination);
   noiseBuffer=context.createBuffer(1,context.sampleRate*2,context.sampleRate);
   const data=noiseBuffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
   ambience=context.createBufferSource();ambience.buffer=noiseBuffer;ambience.loop=true;
   const filter=context.createBiquadFilter();filter.type='lowpass';filter.frequency.value=280;
   const gain=context.createGain();gain.gain.value=.035;ambience.connect(filter).connect(gain).connect(master);ambience.start();
  }
  if(context.state==='suspended')context.resume().catch(()=>{});
 }catch(error){console.warn('Bar audio unavailable:',error)}
}
document.addEventListener('pointerdown',unlock,{capture:true});document.addEventListener('keydown',unlock,{capture:true});
export const sound={
 get enabled(){return enabled},
 toggle(){enabled=!enabled;try{localStorage.setItem('after-hours-sound',enabled?'on':'off')}catch{}if(enabled)unlock();applyVolume();return enabled},
 setPaused(value){paused=value;applyVolume()},
 play(event,variant){
  if(!enabled||paused||!context||context.state!=='running')return;
  switch(event){
   case 'pour':noise(.48,.23,850);[0,.12,.24].forEach((offset,i)=>tone(340+i*85,.08,.045,offset,'sine',220));break;
   case 'mix':
    if(variant==='Shake'){for(let i=0;i<8;i++){noise(.16,.22,3300,i*.18,'bandpass');tone(1300,.065,.035,i*.18)}}
    else{noise(1.45,.075,650);for(let i=0;i<7;i++)clink(i*.2,.035)}break;
   case 'serve':noise(.6,.12,900);clink(.65,.16);break;
   case 'arrival':tone(660,.38,.1);tone(990,.5,.065,.12);noise(.2,.025,400,.03);break;
   case 'departure':for(let i=0;i<4;i++)noise(.11,.055,240,i*.22);tone(180,.18,.025,.75,'sine',90);break;
   case 'tip':tone(1046,.16,.07);tone(1318,.2,.06,.1);tone(1568,.28,.05,.2);break;
   case 'glass':clink(0,.09);break;
   case 'reset':noise(.28,.1,1300);break;
   case 'tool':tone(820,.09,.055);noise(.09,.035,2400);break;
   case 'warning':tone(392,.18,.045);tone(330,.22,.035,.23);break;
  }
 }
};
