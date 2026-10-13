import * as THREE from 'three'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

/** A real, freely inspectable assembly: each part has depth and its own material. */
export function mountHeroScene(host: HTMLElement): () => void {
  const resources: Array<{dispose():void}> = []
  const events = new AbortController()
  let renderer: THREE.WebGLRenderer | undefined
  let frame = 0
  let observer: ResizeObserver | undefined
  let visibility: IntersectionObserver | undefined
  const dispose = () => {
    cancelAnimationFrame(frame); events.abort(); observer?.disconnect(); visibility?.disconnect()
    resources.forEach(item => item.dispose()); renderer?.dispose(); renderer?.domElement.remove()
    host.removeAttribute('data-hero-3d-ready')
  }
  try {
    renderer = new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'})
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.6))
    renderer.outputColorSpace=THREE.SRGBColorSpace
    renderer.toneMapping=THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure=1.15
    const canvas=renderer.domElement
    canvas.className='hero-3d-canvas'; canvas.tabIndex=0
    canvas.setAttribute('role','img')
    canvas.setAttribute('aria-label','Объёмная сборка: металлическая лента, стеклянное кольцо и керамические модули. Вращайте мышью, пальцем или клавишами стрелок.')
    host.append(canvas)
    const scene=new THREE.Scene()
    const camera=new THREE.PerspectiveCamera(35,1,.1,60)
    const environment=new RoomEnvironment()
    const pmrem=new THREE.PMREMGenerator(renderer)
    const env=pmrem.fromScene(environment,.04)
    scene.environment=env.texture
    resources.push(env); environment.dispose(); pmrem.dispose()
    scene.add(new THREE.HemisphereLight(0xf3eaff,0x42466b,2))
    const key=new THREE.DirectionalLight(0xffffff,4); key.position.set(-3,5,6); scene.add(key)
    const rim=new THREE.DirectionalLight(0xb7c5ff,3); rim.position.set(4,1,-3); scene.add(rim)
    const assembly=new THREE.Group(); assembly.rotation.set(.12,-.3,-.12); scene.add(assembly)
    const material=(options:THREE.MeshPhysicalMaterialParameters)=>{
      const value=new THREE.MeshPhysicalMaterial(options); resources.push(value); return value
    }
    const blue=material({color:0x3a35dc,metalness:.7,roughness:.24,clearcoat:1,clearcoatRoughness:.16,side:THREE.DoubleSide})
    const chrome=material({color:0xe2e4f5,metalness:1,roughness:.17})
    const cream=material({color:0xf2e4ca,roughness:.29,clearcoat:.7})
    const orange=material({color:0xff6029,roughness:.25,clearcoat:1})
    const glass=material({color:0xc0b5ff,metalness:.05,roughness:.1,transmission:.8,thickness:1.2,ior:1.45})
    const mesh=(geometry:THREE.BufferGeometry,mat:THREE.Material,x=0,y=0,z=0)=>{
      resources.push(geometry); const object=new THREE.Mesh(geometry,mat)
      object.position.set(x,y,z); assembly.add(object); return object
    }
    // A twisted closed ribbon, with real cross-section thickness and bevelled edges.
    const ribbonShape=new THREE.Shape()
    ribbonShape.moveTo(-.42,-.055); ribbonShape.lineTo(.42,-.055)
    ribbonShape.quadraticCurveTo(.46,0,.42,.055); ribbonShape.lineTo(-.42,.055)
    ribbonShape.quadraticCurveTo(-.46,0,-.42,-.055)
    const points=Array.from({length:97},(_,i)=>{
      const t=i/96*Math.PI*2
      return new THREE.Vector3(1.55*Math.cos(t),1.9*Math.sin(t),.6*Math.sin(2*t))
    })
    const path=new THREE.CatmullRomCurve3(points,true,'centripetal')
    const rawRibbon=new THREE.ExtrudeGeometry(ribbonShape,{steps:240,extrudePath:path,bevelEnabled:false})
    rawRibbon.deleteAttribute('normal'); rawRibbon.deleteAttribute('uv')
    const smoothRibbon=mergeVertices(rawRibbon); smoothRibbon.computeVertexNormals(); rawRibbon.dispose()
    const ribbon=mesh(smoothRibbon,blue,-.1,.12,0)
    ribbon.rotation.z=.32
    const ring=mesh(new THREE.TorusGeometry(1.13,.21,24,100),glass,.68,-.38,.65)
    ring.rotation.set(.62,.72,-.4)
    const satellite=mesh(new THREE.TorusGeometry(.66,.105,20,72),chrome,-1.25,-1.14,.5)
    satellite.rotation.set(.9,-.25,.2)
    mesh(new THREE.SphereGeometry(.57,48,32),cream,.7,1.25,.56)
    const block=mesh(new RoundedBoxGeometry(.8,.8,.8,4,.14),orange,1.22,-1.13,.65)
    block.rotation.set(.25,.5,.3)
    const bead=mesh(new THREE.SphereGeometry(.17,24,16),chrome,-1.7,.75,.45)
    bead.name='counterweight'
    let dragging=false, pointer=-1, x=0,y=0, velocity=0,lastMove=0, visible=true, paused=false
    let last=0
    const reduced=matchMedia('(prefers-reduced-motion: reduce)')
    paused=reduced.matches
    const control=host.querySelector<HTMLButtonElement>('[data-hero-motion]')
    const updateControl=()=>{if(control){control.textContent=paused?'Вращать':'Пауза';control.setAttribute('aria-pressed',String(!paused))}}
    const draw=()=>renderer?.render(scene,camera)
    const tick=(time:number)=>{
      const dt=Math.min((time-last)/1000,.04);last=time
      if(visible&&!document.hidden){
        if(!dragging){assembly.rotation.y+=velocity*dt;velocity*=Math.exp(-dt*5);if(!paused)assembly.rotation.y+=dt*.17}
        draw()
      }
      frame=requestAnimationFrame(tick)
    }
    const opts={signal:events.signal}
    canvas.addEventListener('pointerdown',e=>{
      if(dragging||e.button!==0)return
      dragging=true;pointer=e.pointerId;x=e.clientX;y=e.clientY;velocity=0;lastMove=performance.now()
      canvas.setPointerCapture(pointer);canvas.classList.add('is-grabbing')
    },opts)
    canvas.addEventListener('pointermove',e=>{
      if(!dragging||e.pointerId!==pointer)return
      const now=performance.now(),dx=e.clientX-x
      assembly.rotation.y+=dx*.008
      assembly.rotation.x=THREE.MathUtils.clamp(assembly.rotation.x+(e.clientY-y)*.006,-1.1,1.1)
      velocity=THREE.MathUtils.clamp(dx*.008/Math.max(.008,(now-lastMove)/1000),-3,3)
      x=e.clientX;y=e.clientY;lastMove=now;draw()
    },opts)
    const release=(e:PointerEvent)=>{if(e.pointerId!==pointer)return;dragging=false;pointer=-1;if(performance.now()-lastMove>100||reduced.matches)velocity=0;canvas.classList.remove('is-grabbing')}
    canvas.addEventListener('pointerup',release,opts);canvas.addEventListener('pointercancel',release,opts);canvas.addEventListener('lostpointercapture',release,opts)
    canvas.addEventListener('keydown',e=>{
      if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return
      e.preventDefault();velocity=0
      if(e.key==='Home')assembly.rotation.set(.12,-.3,-.12)
      else if(e.key==='ArrowLeft'||e.key==='ArrowRight')assembly.rotation.y+=e.key==='ArrowLeft'?-.15:.15
      else assembly.rotation.x=THREE.MathUtils.clamp(assembly.rotation.x+(e.key==='ArrowUp'?-.15:.15),-1.1,1.1)
      draw()
    },opts)
    control?.addEventListener('click',()=>{paused=!paused;velocity=0;updateControl()},opts)
    reduced.addEventListener('change',()=>{paused=reduced.matches;velocity=0;updateControl()},opts)
    const resize=()=>{const {width,height}=host.getBoundingClientRect();if(!width||!height)return
      renderer!.setSize(width,height,false);camera.aspect=width/height
      camera.position.set(0,0,Math.max(8.4,8.1/camera.aspect));camera.lookAt(0,0,0);camera.updateProjectionMatrix();draw()}
    observer=new ResizeObserver(resize);observer.observe(host)
    visibility=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting});visibility.observe(host)
    canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();dispose()},opts)
    resize();updateControl();host.setAttribute('data-hero-3d-ready','true');frame=requestAnimationFrame(tick)
    return dispose
  } catch(error) {dispose();console.warn('3D unavailable; showing static fallback.',error);return ()=>undefined}
}
