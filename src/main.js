import './style.css';
import {createIcons,VolumeX,Volume2,CircleHelp,Pause,Wine,Coins,ReceiptText,Clock3,RefreshCw,Snowflake,Lightbulb,RotateCcw,GlassWater,ChevronsUpDown,ArrowUpRight,Mouse,BookOpen,X,ArrowRight} from 'lucide';
import {createBar} from './scene';
import {checkWebGL,reportGraphicsFailure,graphicsWorking} from './graphics';
const icons={VolumeX,Volume2,CircleHelp,Pause,Wine,Coins,ReceiptText,Clock3,RefreshCw,Snowflake,Lightbulb,RotateCcw,GlassWater,ChevronsUpDown,ArrowUpRight,Mouse,BookOpen,X,ArrowRight};
const $=s=>document.querySelector(s);
const ingredients=[{name:'Bourbon',detail:'Rich & oaky',color:'#775022',unit:'2 oz'},{name:'Gin',detail:'Bright & botanical',color:'#83917b',unit:'2 oz'},{name:'Vermouth',detail:'Sweet & aromatic',color:'#3b5d42',unit:'1 oz'},{name:'Bitters',detail:'A little complexity',color:'#894021',unit:'2 dashes'},{name:'Simple syrup',detail:'The sweet spot',color:'#a58d4b',unit:'¼ oz'},{name:'Campari',detail:'Bold & bittersweet',color:'#8a3330',unit:'1 oz'}];
const recipes=[{name:'Old Fashioned',sub:'A classic. For a reason.',items:[0,3,4],method:'Stir',glass:'Rocks',customer:'JAMES',quote:'“An Old Fashioned, please.<br>It’s been that kind of day.”'},{name:'Negroni',sub:'Bitter. Sweet. Beautiful.',items:[1,2,5],method:'Stir',glass:'Rocks',customer:'SOFIA',quote:'“A Negroni for me.<br>Something with a little bite.”'},{name:'Manhattan',sub:'A little New York, after dark.',items:[0,2,3],method:'Stir',glass:'Coupe',customer:'MILES',quote:'“One Manhattan, please.<br>Make it a good one.”'},{name:'Gin Old Fashioned',sub:'A fresh take on an old friend.',items:[1,3,4],method:'Stir',glass:'Rocks',customer:'OLIVIA',quote:'“Try a Gin Old Fashioned?<br>I’m feeling adventurous.”'},{name:'Shaken Martini',sub:'Ice cold. Unapologetically smooth.',items:[1,2],method:'Shake',glass:'Coupe',customer:'ALEX',quote:'“A gin Martini, please.<br>Shaken, not stirred.”'}];
let served=0,tips=0,contents=[],mixed=false,glass='Rocks',method='Stir',paused=false,busy=false,delivering=false,selected=0,sequence=0,arrivalTicks=0;
const customers=[null,null,null];
let toastTimeout;
function toast(message){$('#toast').textContent=message;$('#toast').style.opacity=1;clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>$('#toast').style.opacity=0,3200)}
$('#ingredients').innerHTML=ingredients.map((i,n)=>`<button class="ingredient" data-index="${n}" title="Add ${i.unit} ${i.name}"><kbd>${n+1}</kbd><span class="ingredient-count"></span><div class="bottle-icon" style="--bottle:${i.color}" data-label="${i.name.split(' ')[0].toUpperCase()}"></div><b>${i.name}</b><small>${i.detail}</small></button>`).join('');
const queue=document.createElement('div');queue.id='customer-queue';queue.setAttribute('aria-label','Customers at the bar');$('.order-card').prepend(queue);
let bar={pour(){},arrive(){},depart(){},select(){},setPatience(){},highlight(){},mix(){}};
window.addEventListener('graphics-status',()=>{paused=true});
if(checkWebGL())try{bar=createBar(addIngredient,{onSelect:selectCustomer,onServe:serve,onDelivered:finishDelivery,canInteract:()=>!paused});}catch(error){console.error(error);reportGraphicsFailure('WebGL is available, but the 3D scene could not start.',error.stack||error.message)}
if(!graphicsWorking())paused=true;
function current(){return customers[selected]?.recipe||recipes[0]}
function update(){
 document.querySelectorAll('.ingredient').forEach((el,i)=>{const n=contents.filter(x=>x===i).length;el.classList.toggle('active',n>0);el.querySelector('.ingredient-count').textContent=n?`+${n}`:''});
 $('#pour-count').textContent=`${contents.length} pour${contents.length===1?'':'s'}`;
 $('#mix-contents').textContent=contents.length?contents.map(i=>ingredients[i].name).join(' + ')+(mixed?' · Mixed ✓':''):'A blank canvas. Add your ingredients.';
 $('#glass-name').textContent=glass+' glass';$('#mix span').textContent=busy?'Mixing…':mixed?'Mixed ✓':method;$('#mix').disabled=busy||delivering;
 $('#serve').disabled=!contents.length||busy||delivering;
 current().items.forEach(i=>$(`#recipe li[data-id="${i}"]`)?.classList.toggle('done',contents.includes(i)));
 bar.pour(contents.length);
}
function renderQueue(){customers.forEach((c,slot)=>{if(c)bar.setPatience(slot,c.time/105)});bar.highlight(customers[selected]&&!customers[selected].leaving?selected:-1);queue.innerHTML=customers.map((c,slot)=>c?`<button data-slot="${slot}" class="${slot===selected?'selected':''}" ${c.leaving?'disabled':''}><b>${c.recipe.customer}</b><span>${c.leaving?'THANK YOU':Math.ceil(c.time)+'s'}</span></button>`:`<span class="empty-seat">${['CENTER','LEFT','RIGHT'][slot]} · OPEN</span>`).join('')}
function showOrder(){
 const c=customers[selected],r=current();renderQueue();
 if(!c){$('#drink-title').textContent='Waiting for company';$('#recipe').innerHTML='';$('#customer-bubble').style.opacity=0;return}
 $('#drink-title').textContent=r.name;$('#drink-subtitle').textContent=r.sub;$('#customer-name').textContent=r.customer;$('#customer-dialogue').innerHTML=c.leaving?'“That’s perfect. Keep the change!”':r.quote;
 $('#order-number').textContent=String(c.number).padStart(3,'0');
 $('#recipe').innerHTML=r.items.map(i=>`<li data-id="${i}"><span class="check">✓</span><span>${ingredients[i].name}</span><span>${r.name==='Negroni'?'1 oz':ingredients[i].unit}</span></li>`).join('');
 $('#method-title').textContent=`${r.method} with ice`;$('#method-note').textContent=`Serve in a ${r.glass.toLowerCase()} glass`;
 $('#customer-bubble').style.opacity=1;updateTimer();update();
}
function selectCustomer(slot){if(paused||busy||delivering||!customers[slot]||customers[slot].leaving)return;selected=slot;bar.select(slot);showOrder()}
queue.onclick=e=>{const button=e.target.closest('button');if(button)selectCustomer(Number(button.dataset.slot))};
function arrive(slot){const number=sequence++;customers[slot]={recipe:recipes[number%recipes.length],number:number+1,time:105,leaving:false};bar.arrive(slot,customers[slot].recipe.customer,customers[slot].recipe.name);if(!customers[selected]||customers[selected].leaving)selected=slot;showOrder()}
function addIngredient(index){if(paused||busy||delivering)return;if(contents.length>=6){toast('Your glass is full. Reset to start again.');return}contents.push(index);mixed=false;update()}
function reset(){if(paused||busy||delivering)return;contents=[];mixed=false;update()}
function doMix(){if(paused||busy||delivering)return;if(!contents.length){toast('Start with a pour. Your glass is empty.');return}busy=true;mixed=false;update();setTimeout(()=>{busy=false;mixed=true;bar.mix();update();toast('Ready. Drag the glass from your bar onto a customer.');},1600)}
function removeCustomer(slot){customers[slot]=null;bar.depart(slot);if(selected===slot){selected=customers.findIndex(c=>c&&!c.leaving);if(selected<0)selected=0}showOrder()}
function serve(slot){
 if(paused||busy||delivering)return false;
 const c=customers[slot];if(!c||c.leaving)return false;const r=c.recipe;
 if(!contents.length){toast('An empty glass? Let’s add something first.');return false}
 if(contents.length!==r.items.length||!r.items.every(i=>contents.filter(x=>x===i).length===1)){toast(`Not ${r.customer}’s order. They want a ${r.name}.`);c.time=Math.max(1,c.time-7);return false}
 if(!mixed){toast('Give your drink a mix before serving.');return false}
 if(method!==r.method){toast(`This one needs a ${r.method.toLowerCase()}, not a ${method.toLowerCase()}.`);return false}
 if(glass!==r.glass){toast(`Almost! This drink belongs in a ${r.glass.toLowerCase()} glass.`);return false}
 const tip=2+Math.round(c.time/105*400)/100;served++;tips+=tip;c.leaving=true;c.leaveIn=Infinity;delivering=true;
 $('#served').textContent=served;$('#tips').textContent='$'+tips.toFixed(2);$('#goal-count').textContent=Math.min(served,8);$('#goal-bar').style.width=Math.min(served/8*100,100)+'%';
 toast(served===8?'Shift goal complete! Eight happy customers.':`${r.customer}: “Perfect!” +$${tip.toFixed(2)} tip`);renderQueue();
 return true;
}
function finishDelivery(){
 customers.forEach(c=>{if(c?.leaving&&c.leaveIn===Infinity)c.leaveIn=3});
 contents=[];mixed=false;delivering=false;
 const next=customers.findIndex(c=>c&&!c.leaving);if(next>=0)selected=next;
 showOrder();update();
}
function updateTimer(){const t=Math.ceil(customers[selected]?.time||0);$('#timer').textContent=`${Math.floor(t/60)}:${String(t%60).padStart(2,'0')}`;$('#patience-bar').style.width=t/105*100+'%';$('#patience-bar').style.background=t<25?'#c77b62':'#d8b677'}
setInterval(()=>{
 if(paused)return;
 customers.forEach((c,slot)=>{if(!c)return;if(c.leaving){if(--c.leaveIn<=0)removeCustomer(slot);return}c.time=Math.max(0,c.time-1);if(c.time===25)toast(`${c.recipe.customer} is getting impatient.`);if(c.time===0){toast(`${c.recipe.customer} couldn’t wait and left.`);removeCustomer(slot)}});
 arrivalTicks++;if(arrivalTicks>=18){arrivalTicks=0;const slot=customers.findIndex(c=>!c);if(slot>=0){arrive(slot);toast(`${customers[slot].recipe.customer} just arrived at the bar.`)}}
 updateTimer();renderQueue();
},1000);
$('#ingredients').onclick=e=>{const el=e.target.closest('.ingredient');if(el)addIngredient(Number(el.dataset.index))};$('#clear').onclick=reset;$('#mix').onclick=doMix;
$('#serve').onclick=()=>toast('Drag the 3D glass (or the glass icon) onto a customer to serve.');
$('#serve span').textContent='Drag glass to serve';
let glassPointer;
$('#glass-toggle').addEventListener('pointerdown',e=>{glassPointer={x:e.clientX,y:e.clientY}});
$('#glass-toggle').onclick=e=>{if(paused||busy||delivering)return;if(glassPointer&&Math.hypot(e.clientX-glassPointer.x,e.clientY-glassPointer.y)>6)return;glass=glass==='Rocks'?'Coupe':'Rocks';update()};
function toggleMethod(){if(busy||paused||delivering)return;method=method==='Stir'?'Shake':'Stir';mixed=false;update();toast(`${method==='Shake'?'Shaker':'Bar spoon'} selected. Press Space to mix.`)}
$('#tool-toggle').onclick=toggleMethod;$('#mix').oncontextmenu=e=>{e.preventDefault();toggleMethod()};
function showModal(kind){paused=true;$('#modal').classList.remove('hidden');$('.modal h2').textContent=kind==='book'?'The house recipes.':kind==='pause'?'Take a little breather.':'A night behind the bar.';$('#modal-content').innerHTML=kind==='book'?recipes.map(r=>`<div class="book-recipe"><b>${r.name}</b><p>${r.items.map(i=>ingredients[i].name).join(' + ')}<br>${r.method} with ice · ${r.glass} glass</p></div>`).join(''):kind==='pause'?'<p>Your shift is paused. Your customers can wait a moment.</p>':'<p>Use <b>← / →</b> to move behind the bar. Click a customer or their name in the order panel to view their recipe. Up to three people can wait at once, each with their own patience timer.</p><p>Click bottles or use <b>1–6</b> to pour. Click the glass name to change glassware. <b>M</b> changes the mixing tool; <b>Space</b> mixes.</p><p><b>Drag the prepared 3D glass on the counter onto a customer and release to serve.</b> You can also drag the glass icon from your workstation. Wrong drinks return to you. Drag elsewhere in the room to look around.</p>';$('#resume').firstChild.textContent='Back behind the bar ';createIcons({icons})}
function closeModal(){paused=!graphicsWorking();$('#modal').classList.add('hidden')}
$('#help').onclick=()=>showModal('help');$('#pause').onclick=()=>showModal('pause');$('#recipe-toggle').onclick=()=>showModal('book');$('#close-modal').onclick=closeModal;$('#resume').onclick=closeModal;$('#modal').onclick=e=>{if(e.target===$('#modal'))closeModal()};
addEventListener('keydown',e=>{if(e.repeat)return;if(e.key==='Escape'){paused?closeModal():showModal('pause');return}if(paused)return;if(/^[1-6]$/.test(e.key))addIngredient(Number(e.key)-1);if(e.code==='Space'){e.preventDefault();doMix()}if(e.key==='Enter')toast('Drag your glass onto a customer to serve.');if(e.key.toLowerCase()==='r')showModal('book');if(e.key.toLowerCase()==='m')toggleMethod();if(e.key.toLowerCase()==='c')reset()});
let audio,ambient,enabled=false;$('#sound').onclick=()=>{enabled=!enabled;if(enabled){audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume();const buffer=audio.createBuffer(1,audio.sampleRate*3,audio.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.2;ambient=audio.createBufferSource();ambient.buffer=buffer;ambient.loop=true;const filter=audio.createBiquadFilter();filter.type='lowpass';filter.frequency.value=350;const gain=audio.createGain();gain.gain.value=.12;ambient.connect(filter).connect(gain).connect(audio.destination);ambient.start()}else ambient?.stop();$('#sound').innerHTML=`<i data-lucide="${enabled?'volume-2':'volume-x'}"></i>`;createIcons({icons})};
arrive(0);arrive(1);createIcons({icons});
