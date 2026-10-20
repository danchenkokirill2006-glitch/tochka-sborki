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
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
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
    canvas.setAttribute('aria-label','Объёмная сборка: металлическая лента, стеклянное кольцо и керамические модули. Перетаскивайте мышью или пальцем: горизонтально для поворота, вертикально для наклона. Shift и Q/E задают крен. На сенсорном экране поверните двумя пальцами.')
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
    const glass=material({color:0xc0b5ff,metalness:.12,roughness:.19,transmission:.48,thickness:.35,ior:1.38})
    const mesh=(geometry:THREE.BufferGeometry,mat:THREE.Material,x=0,y=0,z=0)=>{
      resources.push(geometry); const object=new THREE.Mesh(geometry,mat)
      object.position.set(x,y,z); assembly.add(object); return object
    }
    // A twisted closed ribbon, with real cross-section thickness and bevelled edges.
    const ribbonShape=new THREE.Shape()
    ribbonShape.moveTo(-.42,-.055); ribbonShape.lineTo(.42,-.055)
    ribbonShape.quadraticCurveTo(.46,0,.42,.055); ribbonShape.lineTo(-.42,.055)
    ribbonShape.quadraticCurveTo(-.46,0,-.42,-.055)
    // Closed Catmull-Rom curves wrap their control points automatically; do not
    // repeat the first point at the end, which would create a zero-length segment.
    const points=Array.from({length:96},(_,i)=>{
      const t=i/96*Math.PI*2
      return new THREE.Vector3(1.4*Math.cos(t),1.75*Math.sin(t),-.12+.35*Math.sin(2*t))
    })
    const path=new class extends THREE.CatmullRomCurve3 {
      override getTangent(t:number,target=new THREE.Vector3()) {
        // Finite differences can make the closed curve's tangent at u=1 differ
        // slightly from u=0. Reuse the exact starting tangent to close the frame.
        return super.getTangent(t>=1?0:t,target)
      }
    }(points,true,'centripetal')
    const rawRibbon=new THREE.ExtrudeGeometry(ribbonShape,{steps:240,extrudePath:path,bevelEnabled:false})
    rawRibbon.deleteAttribute('normal'); rawRibbon.deleteAttribute('uv')
    const smoothRibbon=mergeVertices(rawRibbon); smoothRibbon.computeVertexNormals(); rawRibbon.dispose()
    const ribbon=mesh(smoothRibbon,blue,-.15,.12,0)
    ribbon.rotation.z=.32
    ribbon.scale.setScalar(.9)
    ribbon.position.set(-.08,.02,0)
    // Keep every accent clear of the swept ribbon. The ornaments sit around a
    // smaller central ring in alternating depth planes, so perspective adds
    // depth while the four quadrants stay balanced as the assembly turns.
    const ring=mesh(new THREE.TorusGeometry(.48,.11,32,128),glass,0,0,.32)
    ring.rotation.set(.25,.35,-.32)
    const satellite=mesh(new THREE.TorusGeometry(.29,.06,24,96),chrome,-.4,-.38,-1)
    satellite.rotation.set(.7,-.45,.16)
    mesh(new THREE.SphereGeometry(.39,48,32),cream,-.4,.38,1)
    const block=mesh(new RoundedBoxGeometry(.5,.5,.5,5,.09),orange,.4,-.38,1)
    block.rotation.set(.2,.36,.24)
    const bead=mesh(new THREE.SphereGeometry(.14,24,16),chrome,.4,.38,-1)
    bead.name='counterweight'
    let dragging=false, pointer=-1, x=0,y=0, velocity=0,lastMove=0, visible=true
    const activePointers=new Map<number,{x:number;y:number}>()
    let previousRoll:number|null=null
    let last=0
    const draw=()=>renderer?.render(scene,camera)
    const tick=(time:number)=>{
      const dt=Math.min((time-last)/1000,.04);last=time
      if(visible&&!document.hidden){
        if(!dragging&&!motionPreference.matches){assembly.rotation.y+=velocity*dt;velocity*=Math.exp(-dt*5);assembly.rotation.y+=dt*.17}
        draw()
      }
      frame=motionPreference.matches ? 0 : requestAnimationFrame(tick)
    }
    const opts={signal:events.signal}
    canvas.addEventListener('pointerdown',e=>{
      if(e.button!==0)return
      activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY})
      if(activePointers.size===1){dragging=true;pointer=e.pointerId;x=e.clientX;y=e.clientY;velocity=0;lastMove=performance.now();canvas.classList.add('is-grabbing')}
      if(activePointers.size===2){const pts=[...activePointers.values()];previousRoll=Math.atan2(pts[1].y-pts[0].y,pts[1].x-pts[0].x)}
      canvas.setPointerCapture(e.pointerId)
    },opts)
    canvas.addEventListener('pointermove',e=>{
      if(!activePointers.has(e.pointerId))return
      activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY})
      if(activePointers.size>=2){const pts=[...activePointers.values()];const angle=Math.atan2(pts[1].y-pts[0].y,pts[1].x-pts[0].x);if(previousRoll!==null)assembly.rotation.z+=THREE.MathUtils.euclideanModulo(angle-previousRoll+Math.PI,Math.PI*2)-Math.PI;previousRoll=angle;draw();return}
      if(!dragging||e.pointerId!==pointer)return
      const now=performance.now(),dx=e.clientX-x,dy=e.clientY-y
      if(e.shiftKey)assembly.rotation.z+=dx*.008
      else{assembly.rotation.y+=dx*.008;assembly.rotation.x=assembly.rotation.x+dy*.006}
      velocity=THREE.MathUtils.clamp(dx*.008/Math.max(.008,(now-lastMove)/1000),-3,3)
      x=e.clientX;y=e.clientY;lastMove=now;draw()
    },opts)
    const release=(e:PointerEvent)=>{activePointers.delete(e.pointerId);previousRoll=null;if(activePointers.size===0){dragging=false;pointer=-1;if(performance.now()-lastMove>100)velocity=0;canvas.classList.remove('is-grabbing')}else{const remaining=activePointers.entries().next().value as [number,{x:number;y:number}]|undefined;if(remaining){pointer=remaining[0];x=remaining[1].x;y=remaining[1].y;lastMove=performance.now()}}}
    canvas.addEventListener('pointerup',release,opts);canvas.addEventListener('pointercancel',release,opts);canvas.addEventListener('lostpointercapture',release,opts)
    canvas.addEventListener('keydown',e=>{
      if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','q','Q','e','E'].includes(e.key))return
      e.preventDefault();velocity=0
      if(e.key==='Home')assembly.rotation.set(.12,-.3,-.12)
      else if(e.key==='ArrowLeft'||e.key==='ArrowRight')assembly.rotation.y+=e.key==='ArrowLeft'?-.15:.15
      else if(e.key==='q'||e.key==='Q')assembly.rotation.z-=.15
      else if(e.key==='e'||e.key==='E')assembly.rotation.z+=.15
      else assembly.rotation.x=THREE.MathUtils.clamp(assembly.rotation.x+(e.key==='ArrowUp'?-.15:.15),-1.35,1.35)
      draw()
    },opts)
    const resize=()=>{const {width,height}=host.getBoundingClientRect();if(!width||!height)return
      renderer!.setSize(width,height,false);camera.aspect=width/height
      camera.position.set(0,0,Math.max(8.5,7.8/camera.aspect));camera.lookAt(0,0,0);camera.updateProjectionMatrix();draw()}
    observer=new ResizeObserver(resize);observer.observe(host)
    visibility=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting});visibility.observe(host)
    canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();dispose()},opts)
    motionPreference.addEventListener('change',()=>{
      velocity=0
      if(motionPreference.matches){cancelAnimationFrame(frame);frame=0;draw()}
      else if(!frame){last=performance.now();frame=requestAnimationFrame(tick)}
    },opts)
    resize();host.setAttribute('data-hero-3d-ready','true')
    if(!motionPreference.matches)frame=requestAnimationFrame(tick)
    return dispose
  } catch(error) {dispose();console.warn('3D unavailable; showing static fallback.',error);return ()=>undefined}
}






