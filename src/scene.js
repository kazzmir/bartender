import * as THREE from 'three';
import {watchRenderer, reportGraphicsFailure, graphicsWorking} from './graphics';

export function createBar(onBottle, {onSelect, onServe, onDelivered, onGlassPlaced, canReplaceGlass, getGlassHint, canInteract} = {}) {
 const scene = new THREE.Scene(); scene.background = new THREE.Color('#181b14'); scene.fog=new THREE.FogExp2('#171c15',.035);
 const camera=new THREE.PerspectiveCamera(58,innerWidth/innerHeight,.1,70);camera.position.set(0,2.75,8.2);
 const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;document.querySelector('#world').append(renderer.domElement);watchRenderer(renderer);
 const mat=(color,roughness=.65,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
 const woodTexture=(()=>{const c=document.createElement('canvas');c.width=512;c.height=512;const ctx=c.getContext('2d');ctx.fillStyle='#664228';ctx.fillRect(0,0,512,512);for(let i=0;i<1700;i++){let y=Math.random()*512;ctx.strokeStyle=`rgba(${Math.random()>.5?'20,9,3':'180,128,66'},${Math.random()*.16})`;ctx.beginPath();ctx.moveTo(0,y);ctx.bezierCurveTo(130,y+Math.random()*8,350,y-5,512,y+Math.random()*5);ctx.stroke()}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,1);t.colorSpace=THREE.SRGBColorSpace;return t})();
 const wood=new THREE.MeshStandardMaterial({map:woodTexture,roughness:.4}); const darkWood=mat('#372d20');const brass=mat('#a98443',.3,.75);const wall=mat('#273329');const black=mat('#191d18');
 function box(w,h,d,x,y,z,m=wood){let o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;scene.add(o);return o}
 function cyl(r1,r2,h,x,y,z,m,segments=24){let o=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,segments),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;scene.add(o);return o}
 scene.add(new THREE.HemisphereLight('#e6d4a8','#202a22',1.1));
 function light(x,y,z,power,color='#ffbc68'){let l=new THREE.PointLight(color,power,13,2);l.position.set(x,y,z);scene.add(l);return l}
 box(24,.15,24,0,-.1,0,mat('#343125'));for(let x=-12;x<12;x+=1.1)box(.025,.01,24,x,0,0,mat('#171c16'));
 box(24,7,.2,0,3.5,-5,wall);box(.2,7,24,-10,3.5,0,wall);box(.2,7,24,10,3.5,0,wall);box(24,.2,24,0,6.7,0,mat('#181e18'));
 // Paneled walls and brass trim.
 for(let x=-10;x<=10;x+=1.1){box(.045,2.2,.06,x,1.1,-4.85,darkWood);box(.86,1.65,.06,x+.55,1,-4.85,mat('#202b23'))}box(20,.06,.08,0,2.2,-4.8,brass);
 const colors=['#7f4215','#8d9d83','#41694c','#943e22','#b39752','#882e2c'];const names=['Bourbon','Gin','Vermouth','Bitters','Syrup','Campari'];const clickables=[];
 // Backbar shelves on both sides of the central mirror.
 const mirror=mat('#52604c',.17,.8);box(5.1,3.25,.12,0,3.15,-4.73,brass);box(4.9,3.05,.13,0,3.15,-4.64,mirror);
 for(const side of [-1,1]){let x=side*4.4;box(3.1,3.45,.3,x,3.1,-4.64,darkWood);box(2.94,3.3,.12,x,3.1,-4.44,mat('#152219'));for(let y of [1.65,2.6,3.55,4.5]){box(3.25,.1,.68,x,y,-4.15,wood);box(3.1,.025,.025,x,y-.07,-3.85,new THREE.MeshStandardMaterial({color:'#edb566',emissive:'#ed9d43',emissiveIntensity:2}));light(x,y-.1,-3.8,4)}for(let y of [1.71,2.66,3.61])for(let i=0;i<8;i++)bottle(x-1.3+i*.37,y,-4.12,i%6,.65+Math.random()*.3,false)}
 function labelTexture(text,color){let c=document.createElement('canvas');c.width=128;c.height=160;let g=c.getContext('2d');g.fillStyle=color;g.fillRect(0,0,128,160);g.strokeStyle='#726044';g.strokeRect(7,7,114,146);g.fillStyle='#3f3423';g.textAlign='center';g.font='12px Georgia';g.fillText('THE AMBER ROOM',64,36);g.font='bold 19px Georgia';g.fillText(text.toUpperCase(),64,87);g.font='10px Georgia';g.fillText('FINE SPIRITS',64,121);let t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
 function bottle(x,y,z,index,scale=1,interactive=true){const group=new THREE.Group();group.position.set(x,y,z);group.scale.setScalar(scale);const glass=new THREE.MeshStandardMaterial({color:colors[index],roughness:.22,metalness:.15});function part(geo,m,py){let o=new THREE.Mesh(geo,m);o.position.y=py;o.castShadow=true;group.add(o);return o}part(new THREE.CylinderGeometry(.12,.135,.43,16),glass,.215);part(new THREE.CylinderGeometry(.045,.12,.1,16),glass,.48);part(new THREE.CylinderGeometry(.045,.045,.17,16),glass,.59);part(new THREE.CylinderGeometry(.049,.049,.06,16),index===3?black:brass,.695);let label=new THREE.Mesh(new THREE.PlaneGeometry(.19,.25),new THREE.MeshStandardMaterial({map:labelTexture(names[index],index===5?'#c6a36e':'#e1d3ad'),roughness:.85}));label.position.set(0,.24,.126);group.add(label);scene.add(group);if(interactive){group.userData.ingredient=index;group.children.forEach(o=>{o.userData.ingredient=index;clickables.push(o)})}return group}
 // Main counter: you stand behind it, with the customer on the other side.
 box(17,1.1,1.2,0,.55,.45,darkWood);box(17,.17,1.65,0,1.18,.5,wood);box(17,.035,.05,0,1.28,1.32,brass);box(17,.055,.08,0,.2,-.23,brass);
 for(let x=-8;x<8;x+=1)box(.86,.75,.025,x+.45,.64,-.17,mat('#28382a'));
 // Foreground workstation, bottles, tools and glasses.
 box(15,.16,1.25,0,1.04,4.7,wood);const mixingMat=box(1.5,.025,.68,0,1.135,4.6,mat('#1b2924'));for(let i=0;i<6;i++)bottle(-3.6+i*.42,1.14,4.45,i,1.1);
 const silver=mat('#b3b6a7',.23,.85);cyl(.16,.23,.47,1.65,1.37,4.47,silver);cyl(.14,.16,.14,1.65,1.66,4.47,silver);cyl(.065,.09,.07,1.65,1.765,4.47,silver);cyl(.08,.045,.13,2.15,1.22,4.5,brass);cyl(.045,.075,.13,2.15,1.35,4.5,brass);
 function buildGlass(group,type,material){
 group.children.slice().forEach(o=>{if(o.userData.liquid)return;group.remove(o);o.geometry.dispose()});
 function part(geometry,y){const mesh=new THREE.Mesh(geometry,material);mesh.position.y=y;group.add(mesh);return mesh}
 if(type==='Coupe'){
 part(new THREE.CylinderGeometry(.14,.15,.025,32),.0125);part(new THREE.CylinderGeometry(.018,.023,.325,20),.1875);
 const profile=[new THREE.Vector2(0,.345),new THREE.Vector2(.06,.352),new THREE.Vector2(.13,.37),new THREE.Vector2(.19,.405),new THREE.Vector2(.23,.46),new THREE.Vector2(.245,.52)];
 part(new THREE.LatheGeometry(profile,40),0);
 }else part(new THREE.CylinderGeometry(.18,.15,.3,24),.15);
 const rim=new THREE.Mesh(new THREE.TorusGeometry(type==='Coupe'?.245:.18,.01,8,40),silver);rim.rotation.x=Math.PI/2;rim.position.y=type==='Coupe'?.52:.3;group.add(rim);
 }
 function glass(x,y,z,type='Rocks'){const group=new THREE.Group();group.position.set(x,y,z);const material=new THREE.MeshPhysicalMaterial({color:'#d1d7c8',transparent:true,opacity:.4,roughness:.05,metalness:.12,side:THREE.DoubleSide});buildGlass(group,type,material);scene.add(group);return group}
 const drinkGlass=glass(0,1.15,4.6),drinkMaterial=drinkGlass.children[0].material;drinkGlass.visible=false;
 const liquid=new THREE.Mesh(new THREE.CylinderGeometry(.16,.135,.05,24),new THREE.MeshStandardMaterial({color:'#be7d26',transparent:true,opacity:.8,roughness:.2}));liquid.userData.liquid=true;drinkGlass.add(liquid);liquid.visible=false;
 const coaster=cyl(.25,.25,.012,0,1.15,4.6,mat('#d4c5a4'));
 let glassType=null,pours=0;
 function updateLiquid(){liquid.visible=glassType!==null&&pours>0;const scale=glassType==='Coupe'?Math.min(pours*.6,1.6):Math.min(pours*1.1,4);liquid.scale.y=scale;liquid.position.y=glassType==='Coupe'?.39+.0325*scale:.02+.025*scale}
 function setGlass(type){if(type===glassType)return;glassType=type;drinkGlass.visible=!!type;if(type){buildGlass(drinkGlass,type,drinkMaterial);liquid.geometry.dispose();liquid.geometry=type==='Coupe'?new THREE.CylinderGeometry(.205,.13,.065,32):new THREE.CylinderGeometry(.16,.135,.05,24)}updateLiquid()}
 const glassRack=[];
 for(const type of ['Rocks','Coupe'])for(const x of [.95,1.45]){const stock=glass(x,1.135,type==='Rocks'?5.02:4.4,type);stock.userData.glassType=type;stock.userData.home=stock.position.clone();glassRack.push(stock)}
 const glassHint=document.createElement('div');glassHint.id='glass-hint';glassHint.hidden=true;glassHint.setAttribute('role','status');
 glassHint.innerHTML='<div class="glass-hint-content"><span>choose this cup</span><svg width="30" height="40" viewBox="0 0 30 40" aria-hidden="true"><path d="M15 3v29M5 23l10 10 10-10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
 document.body.append(glassHint);
 function updateGlassHint(){
 const type=getGlassHint?.(),stock=glassRack.find(g=>g.userData.glassType===type);
 if(!stock||stockDrag){glassHint.hidden=true;return}
 const point=stock.position.clone();point.y+=type==='Coupe'?.54:.32;point.project(camera);
 glassHint.hidden=point.z < -1||point.z>1||Math.abs(point.x)>1||Math.abs(point.y)>1;
 if(!glassHint.hidden){glassHint.style.left=`${(point.x+1)*innerWidth/2}px`;glassHint.style.top=`${(1-point.y)*innerHeight/2-5}px`}
 }
 box(.7,.08,.4,-1.35,1.16,4.4,mat('#544934'));for(let i=0;i<3;i++){const lime=cyl(.075,.075,.045,-1.5+i*.14,1.24,4.4,mat('#809950'));lime.rotation.x=Math.PI/2}
 // Pendant lamps, seating and tables.
 for(let x of [-6,-3,0,3,6]){cyl(.009,.009,1.55,x,5.85,.4,black);cyl(.07,.37,.3,x,4.95,.4,mat('#354536',.35,.5));cyl(.32,.32,.015,x,4.79,.4,new THREE.MeshStandardMaterial({color:'#ffd193',emissive:'#ffc26a',emissiveIntensity:3}));light(x,4.55,.4,35)}
 for(let x of [-7,-4,4,7]){cyl(.28,.28,.12,x,.9,-.6,mat('#574231'));cyl(.055,.055,.8,x,.45,-.6,black);cyl(.26,.26,.04,x,.07,-.6,black);box(.56,.46,.08,x,1.18,-.83,mat('#574231'))}
 for(let x of [-7,7]){cyl(.8,.8,.1,x,.9,-2.9,wood);cyl(.08,.08,.86,x,.43,-2.9,black);light(x,1.1,-2.9,2);cyl(.06,.06,.14,x,1.01,-2.9,new THREE.MeshStandardMaterial({color:'#ffe0a3',emissive:'#ffb75c',emissiveIntensity:2}));}
 // Hand-painted bar sign in the mirror.
 let signCanvas=document.createElement('canvas');signCanvas.width=1024;signCanvas.height=512;let ctx=signCanvas.getContext('2d');ctx.clearRect(0,0,1024,512);ctx.textAlign='center';ctx.fillStyle='#c6ad76';ctx.font='18px Georgia';ctx.fillText('G O O D   C O M P A N Y   •   F I N E   S P I R I T S',512,145);ctx.font='italic 80px Georgia';ctx.fillText('The Amber Room',512,255);ctx.font='20px Georgia';ctx.fillText('—  E S T .  1 9 8 6  —',512,320);ctx.strokeStyle='#c6ad7666';ctx.beginPath();ctx.moveTo(170,365);ctx.lineTo(854,365);ctx.stroke();let signTex=new THREE.CanvasTexture(signCanvas);let sign=new THREE.Mesh(new THREE.PlaneGeometry(4.5,2.25),new THREE.MeshBasicMaterial({map:signTex,transparent:true}));sign.position.set(0,3.45,-4.53);scene.add(sign);
 // Low-poly customer with a detailed face and rolled sleeves.
 const customer=new THREE.Group();scene.add(customer);customer.position.set(.15,0,-.8);let skin=mat('#b98b6a');let shirt=mat('#828a77');const hair=mat('#302c24');
 function body(geo,m,x,y,z){let o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;customer.add(o);return o}
 body(new THREE.CylinderGeometry(.25,.31,.65,8),shirt,0,1.43,0);body(new THREE.CylinderGeometry(.085,.09,.17,12),skin,0,1.84,0);body(new THREE.SphereGeometry(.225,24,20),skin,0,2.055,0);const h=body(new THREE.SphereGeometry(.233,20,16,0,Math.PI*2,0,Math.PI*.48),hair,0,2.095,-.015);h.rotation.z=.08;
 for(let x of [-.088,.088]){body(new THREE.SphereGeometry(.015,10,8),black,x,2.09,.203);const brow=body(new THREE.BoxGeometry(.06,.014,.013),hair,x,2.14,.207);brow.rotation.z=x>0?-.08:.08;body(new THREE.SphereGeometry(.045,10,8),skin,Math.sign(x)*.218,2.045,0)}body(new THREE.SphereGeometry(.039,10,8),skin,0,2.045,.22);body(new THREE.BoxGeometry(.075,.012,.012),mat('#664734'),0,1.974,.205);
 for(let s of [-1,1]){let arm=body(new THREE.CylinderGeometry(.1,.075,.48,12),shirt,s*.32,1.52,.05);arm.rotation.z=s*.27;let forearm=body(new THREE.CylinderGeometry(.072,.065,.43,12),skin,s*.34,1.29,.24);forearm.rotation.x=1.1;body(new THREE.SphereGeometry(.075,12,10),skin,s*.34,1.2,.43)}
 const customers=[customer,customer.clone(true),customer.clone(true)];
 customers.forEach((c,slot)=>{if(slot)scene.add(c);c.visible=false;c.userData.slot=slot;c.traverse(o=>{o.userData.slot=slot;if(o.isMesh){o.material=o.material.clone();o.material.emissiveIntensity=0;if(o.material.color.getHex()===shirt.color.getHex())o.material.color.set(['#828a77','#80675b','#657987'][slot])}})});
 const customerLabels=customers.map((c,slot)=>{
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=144;
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 const label=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthWrite:false}));
 label.userData.slot=slot;label.position.set(0,2.65,0);label.scale.set(1.65,.464,1);c.add(label);
 return {canvas,texture};
 });
 function updateCustomerLabel(slot,name,drink){
 const {canvas,texture}=customerLabels[slot],ctx=canvas.getContext('2d');ctx.clearRect(0,0,512,144);
 ctx.fillStyle='rgba(24,32,25,0.92)';ctx.beginPath();ctx.roundRect(4,4,504,136,18);ctx.fill();
 ctx.strokeStyle='rgba(216,182,119,0.5)';ctx.lineWidth=2;ctx.stroke();ctx.textAlign='center';
 ctx.fillStyle='#d8b677';ctx.font='600 27px sans-serif';ctx.fillText(name,256,53);
 ctx.fillStyle='#eee8d9';ctx.font='30px sans-serif';ctx.fillText(drink,256,104,470);texture.needsUpdate=true;
 }
 const positions=[0,-2.5,2.5];
 const patience=[1,1,1];let focusedSlot=0;
 const patientGlow=new THREE.Color('#7bb989'),restlessGlow=new THREE.Color('#d9a64d'),angryGlow=new THREE.Color('#e46b55'),glowColor=new THREE.Color();
 let yaw=0,pitch=-.3,looking=false,dragGlass=false,lastX,lastY,moved=false,targetX=0,flight=null,focus=null,stockDrag=null;
 const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),keys=new Set();
 const home=()=>new THREE.Vector3(0,1.15,4.6);
 function ray(e){const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,1-(e.clientY-rect.top)/rect.height*2);raycaster.setFromCamera(pointer,camera)}
 function customerAt(e){ray(e);const hit=raycaster.intersectObjects(customers.filter(c=>c.visible),true)[0];return hit?hit.object.userData.slot:null}
 function startGlass(e){if(!canInteract?.()||!liquid.visible||flight)return false;dragGlass=true;moved=false;renderer.domElement.style.cursor='grabbing';e.preventDefault();return true}
 renderer.domElement.addEventListener('pointerdown',e=>{if(!canInteract?.())return;ray(e);const stockHit=raycaster.intersectObjects(glassRack,true)[0];if(stockHit){if(!canReplaceGlass?.())return;stockDrag=stockHit.object.parent;moved=false;renderer.domElement.style.cursor='grabbing';renderer.domElement.setPointerCapture(e.pointerId);e.preventDefault();return}if(drinkGlass.visible&&raycaster.intersectObject(drinkGlass,true).length&&startGlass(e))return;looking=true;focus=null;moved=false;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)});
 document.querySelector('#glass-toggle').addEventListener('pointerdown',e=>{lastX=e.clientX;lastY=e.clientY;startGlass(e)});
 document.addEventListener('pointermove',e=>{if(stockDrag){moved=true;ray(e);const point=raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),-1.15),new THREE.Vector3());if(point)stockDrag.position.copy(point);renderer.domElement.style.cursor=raycaster.intersectObjects([mixingMat,coaster]).length?'copy':'grabbing';return}if(dragGlass){moved=true;ray(e);drinkGlass.position.copy(raycaster.ray.at(3.5,new THREE.Vector3()));const slot=customerAt(e);renderer.domElement.style.cursor=slot===null?'grabbing':'copy';return}if(!looking){if(canInteract?.()){ray(e);renderer.domElement.style.cursor=raycaster.intersectObjects(glassRack,true).length||(drinkGlass.visible&&raycaster.intersectObject(drinkGlass,true).length)?'grab':''}return}let dx=e.clientX-lastX,dy=e.clientY-lastY;if(Math.abs(dx)+Math.abs(dy)>2)moved=true;yaw=THREE.MathUtils.clamp(yaw-dx*.003,-1.1,1.1);pitch=THREE.MathUtils.clamp(pitch-dy*.002,-.7,.35);lastX=e.clientX;lastY=e.clientY});
 document.addEventListener('pointerup',e=>{if(stockDrag){ray(e);const stock=stockDrag;stockDrag=null;stock.position.copy(stock.userData.home);renderer.domElement.style.cursor='';if(moved&&canInteract?.()&&raycaster.intersectObjects([mixingMat,coaster]).length)onGlassPlaced?.(stock.userData.glassType);return}if(dragGlass){dragGlass=false;renderer.domElement.style.cursor='';const slot=moved?customerAt(e):null;const accepted=slot!==null&&onServe?.(slot);flight={start:drinkGlass.position.clone(),end:accepted?new THREE.Vector3(positions[slot],1.29,-.05):home(),elapsed:0,accepted};if(!moved)drinkGlass.position.copy(home());return}if(!looking)return;looking=false;if(moved)return;const slot=customerAt(e);if(slot!==null){onSelect?.(slot);return}ray(e);const hit=raycaster.intersectObjects(clickables)[0];if(hit)onBottle(hit.object.userData.ingredient)});
 document.addEventListener('pointercancel',()=>{if(stockDrag){stockDrag.position.copy(stockDrag.userData.home);stockDrag=null}looking=false;dragGlass=false;drinkGlass.position.copy(home());renderer.domElement.style.cursor=''});
 addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();keys.add(e.key)}});addEventListener('keyup',e=>keys.delete(e.key));addEventListener('blur',()=>keys.clear());
 let tint=0;const clock=new THREE.Clock();function animate(){if(!graphicsWorking())return;requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.25),t=clock.elapsedTime;
 if(canInteract?.()&&!dragGlass&&!stockDrag&&!flight){targetX=THREE.MathUtils.clamp(targetX+((keys.has('ArrowRight')?1:0)-(keys.has('ArrowLeft')?1:0))*dt*3.2,-5.5,5.5)}camera.position.x=THREE.MathUtils.lerp(camera.position.x,targetX,1-Math.exp(-dt*10));if(focus){const dx=focus.x-camera.position.x,dz=camera.position.z-focus.z,blend=1-Math.exp(-dt*7);yaw=THREE.MathUtils.lerp(yaw,-Math.atan2(dx,dz),blend);pitch=THREE.MathUtils.lerp(pitch,Math.min(-.3,-Math.atan2(camera.position.y-focus.y,Math.hypot(dx,dz))-.1),blend)}camera.rotation.set(pitch,yaw,0,'YXZ');
 customers.forEach((c,slot)=>{if(!c.visible)return;if(canInteract?.()){c.position.z=THREE.MathUtils.lerp(c.position.z,-.55,1-Math.exp(-dt*2));c.position.y=Math.sin(t*1.5+slot)*.009}c.rotation.y=Math.sin(t*.4+slot)*.04;
 const p=patience[slot];glowColor.copy(p>.5?restlessGlow:angryGlow).lerp(p>.5?patientGlow:restlessGlow,p>.5?(p-.5)*2:p*2);
 const strength=slot===focusedSlot ? .16+(1-p)*.16+(p<.25?Math.sin(t*3)*.035:0) : 0;
 c.traverse(o=>{if(o.isMesh&&o.material.emissive){o.material.emissive.copy(glowColor);o.material.emissiveIntensity=THREE.MathUtils.lerp(o.material.emissiveIntensity,strength,1-Math.exp(-dt*8))}});
 });
 if(flight&&canInteract?.()){flight.elapsed+=dt;const p=Math.min(flight.elapsed/.75,1),ease=p*p*(3-2*p);drinkGlass.position.lerpVectors(flight.start,flight.end,ease);drinkGlass.position.y+=Math.sin(p*Math.PI)*.12;if(p===1){const accepted=flight.accepted;flight=null;if(accepted)onDelivered?.();drinkGlass.position.copy(home())}}
 else if(!dragGlass&&!flight)drinkGlass.position.copy(home());
 mixingMat.material.emissive.set(stockDrag?'#526c3b':'#000000');mixingMat.material.emissiveIntensity=.25;
 camera.updateMatrixWorld();updateGlassHint();
 try{renderer.render(scene,camera)}catch(error){console.error('3D rendering failed:',error);reportGraphicsFailure('The browser failed while drawing the 3D scene.',error.stack || error.message)}}animate();
 addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
 return {setGlass,pour(count){pours=count;updateLiquid()},arrive(slot,name,drink){const c=customers[slot];updateCustomerLabel(slot,name,drink);c.visible=true;c.position.set(positions[slot],0,-3.8)},depart(slot){customers[slot].visible=false},select(slot){focus=new THREE.Vector3(positions[slot],1.85,-.55)},setPatience(slot,value){patience[slot]=THREE.MathUtils.clamp(value,0,1)},highlight(slot){focusedSlot=slot},mix(){tint++;liquid.material.color.set(tint%2?'#d4973a':'#ba7a25')},isDragging(){return moved&&dragGlass},projectGlass(){const p=drinkGlass.position.clone();p.y+=glassType==='Coupe'?.43:.15;p.project(camera);return {x:(p.x+1)*innerWidth/2,y:(1-p.y)*innerHeight/2}}};
}
