import * as THREE from 'three'

/** A still, physically lit poster with real thickness and generated artwork. */
export function mountHeroScene(host: HTMLElement): () => void {
  let renderer: THREE.WebGLRenderer | null = null
  let alive = true
  const resources: Array<{ dispose: () => void }> = []

  try {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80)
    const group = new THREE.Group()
    group.rotation.set(0.035, -0.13, -0.018)
    scene.add(group)

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.08
    renderer.domElement.className = 'hero-3d-canvas'
    renderer.domElement.setAttribute('role', 'img')
    renderer.domElement.setAttribute('aria-label', 'Объёмный постер с авторской графической композицией')
    host.append(renderer.domElement)

    const paperTexture = createPaperTexture(() => {
      if (alive && renderer) renderer.render(scene, camera)
    })
    paperTexture.anisotropy = renderer.capabilities.getMaxAnisotropy()
    const edge = new THREE.MeshPhysicalMaterial({ color: 0xe7e2da, roughness: 0.84, clearcoat: 0.08 })
    const front = new THREE.MeshPhysicalMaterial({ map: paperTexture, roughness: 0.9, clearcoat: 0.06, clearcoatRoughness: 0.7 })
    const back = new THREE.MeshStandardMaterial({ color: 0xece8e0, roughness: 0.92 })
    resources.push(paperTexture, edge, front, back)

    // A single extruded board carries the image as its front-face texture.
    const boardGeometry = new THREE.BoxGeometry(5, 7.06, 0.13)
    const board = new THREE.Mesh(boardGeometry, [edge, edge, edge, edge, front, back])
    board.castShadow = true
    board.receiveShadow = true
    group.add(board)
    resources.push(boardGeometry)

    scene.add(new THREE.HemisphereLight(0xfff8ef, 0x3d354b, 1.55))
    const keyLight = new THREE.DirectionalLight(0xfff5e9, 3.1)
    keyLight.position.set(-3.8, 5.5, 7)
    scene.add(keyLight)
    const fillLight = new THREE.DirectionalLight(0xbcaaff, 0.72)
    fillLight.position.set(4.5, 0.5, 5)
    scene.add(fillLight)

    const resize = () => {
      if (!renderer) return
      const { width, height } = host.getBoundingClientRect()
      if (width < 1 || height < 1) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      const requiredHeight = Math.max(7.06 / 0.82, 5 / Math.max(camera.aspect, 0.55) / 0.82)
      camera.position.set(0, 0, requiredHeight / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) + 0.13)
      camera.lookAt(0, 0, 0)
      camera.updateProjectionMatrix()
      renderer.render(scene, camera)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(host)
    resize()
    host.setAttribute('data-hero-3d-ready', 'true')

    return () => {
      alive = false
      observer.disconnect()
      host.removeAttribute('data-hero-3d-ready')
      renderer?.dispose()
      renderer?.domElement.remove()
      resources.forEach(resource => resource.dispose())
      renderer = null
    }
  } catch (error) {
    alive = false
    renderer?.dispose()
    renderer?.domElement.remove()
    console.warn('3D hero preview fell back to its poster artwork.', error)
    return () => undefined
  }
}

function createPaperTexture(onArtworkReady: () => void): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1000
  canvas.height = 1412
  const context = canvas.getContext('2d')!
  context.fillStyle = '#f1eee7'
  context.fillRect(0, 0, canvas.width, canvas.height)

  context.fillStyle = '#24212a'
  context.font = '600 24px "DM Mono", monospace'
  context.fillText('ЗАДАНИЕ 01', 62, 84)
  context.textAlign = 'right'
  context.fillStyle = '#77717a'
  context.fillText('ПОСТЕР / A3', 936, 84)
  context.textAlign = 'left'

  context.fillStyle = '#e9e3dc'
  context.fillRect(58, 142, 884, 994)
  context.fillStyle = '#211d26'
  context.font = '800 84px "Inter", "Arial", sans-serif'
  context.fillText('COMPOSITION', 62, 1240)
  context.fillText('STUDY', 62, 1322)
  context.fillStyle = '#827b87'
  context.font = '500 19px "DM Mono", monospace'
  context.fillText('FORM  /  SPACE  /  BALANCE', 64, 1372)
  context.fillStyle = '#a88aff'
  context.beginPath(); context.arc(930, 1364, 8, 0, Math.PI * 2); context.fill()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true

  const artwork = new Image()
  artwork.onload = () => {
    const targetAspect = 884 / 994
    const sourceAspect = artwork.width / artwork.height
    let sx = 0, sy = 0, sw = artwork.width, sh = artwork.height
    if (sourceAspect > targetAspect) {
      sw = artwork.height * targetAspect
      sx = (artwork.width - sw) / 2
    } else {
      sh = artwork.width / targetAspect
      sy = (artwork.height - sh) / 2
    }
    context.drawImage(artwork, sx, sy, sw, sh, 58, 142, 884, 994)
    texture.needsUpdate = true
    onArtworkReady()
  }
  artwork.src = new URL('./assets/hero-artwork.png', import.meta.url).href
  return texture
}
