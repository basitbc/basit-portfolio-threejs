import * as THREE from "three"
import { createCodeTexture } from "@/lib/code-canvas-texture"
import { stackSnippets, snippets } from "@/data/snippets"

export type UniverseSection =
  | "summary"
  | "projects"
  | "skills"
  | "experience"
  | "education"
  | "languages"
  | "contact"

export type BlockName = "mern" | "blockchain" | "ai"

export type UniverseInstance = {
  focus: (section: UniverseSection) => void
  destroy: () => void
}

type Block = {
  name: BlockName
  group: THREE.Group
  mesh: THREE.Mesh
  baseY: number
  floatOffset: number
  setHover: (hover: boolean) => void
}

type Anchor = {
  pos: THREE.Vector3
  target: THREE.Vector3
}

type BGSnippet = {
  plane: THREE.Mesh
  base: THREE.Vector3
  phase: number
  amp: number
  parallax: number
}

export function initUniverse(
  container: HTMLDivElement,
  onBlockClick?: (b: BlockName) => void
): UniverseInstance {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  container.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  scene.background = new THREE.Color("#0b0d0b")
  scene.fog = new THREE.Fog("#0b0d0b", 18, 50)

  const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 200)
  camera.position.set(0, 1.5, 10)
  scene.add(camera)

  scene.add(new THREE.AmbientLight(0xffffff, 0.35))
  const key = new THREE.DirectionalLight(0xffffff, 1.0)
  key.position.set(6, 8, 6)
  const rim = new THREE.DirectionalLight(0x66ff99, 0.3)
  rim.position.set(-4, 2, -5)
  scene.add(key, rim)

  // stars (no rotation; remain static)
  const stars = createParticles(900, 40)
  scene.add(stars)

  // hero blocks
  const blocks = createHeroBlocks(scene)

  // background floating code snippets (parallax, bobbing only)
  const bgSnippets = createBackgroundSnippets(scene)

  // anchors
  const anchors: Record<UniverseSection, Anchor> = computeAnchors(blocks)

  // raycasting
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2(2, 2)
  let hovered: Block | null = null

  function setMouseFromEvent(e: MouseEvent) {
    const rect = renderer.domElement.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    mouse.set(x, y)
  }

  function onMouseMove(e: MouseEvent) {
    setMouseFromEvent(e)
  }

  function onClick(e: MouseEvent) {
    setMouseFromEvent(e)
    raycaster.setFromCamera(mouse, camera)
    const hits = raycaster.intersectObjects(blocks.map((b) => b.mesh))
    const obj = hits[0]?.object
    const hit = blocks.find((b) => b.mesh === obj)
    if (hit) onBlockClick?.(hit.name)
  }

  function onResize() {
    const w = container.clientWidth
    const h = container.clientHeight
    renderer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  renderer.domElement.addEventListener("mousemove", onMouseMove)
  renderer.domElement.addEventListener("click", onClick)
  window.addEventListener("resize", onResize)

  // camera tween
  let tween: null | {
    startPos: THREE.Vector3
    endPos: THREE.Vector3
    startTarget: THREE.Vector3
    endTarget: THREE.Vector3
    start: number
    duration: number
  } = null
  const lookTarget = new THREE.Vector3(0, 0.6, 0)

  function focus(section: UniverseSection) {
    const anchor = anchors[section]
    if (!anchor) return
    tween = {
      startPos: camera.position.clone(),
      endPos: anchor.pos.clone(),
      startTarget: lookTarget.clone(),
      endTarget: anchor.target.clone(),
      start: performance.now(),
      duration: 900,
    }
  }

  // initial focus
  focus("summary")

  const clock = new THREE.Clock()
  let raf = 0

  function animate() {
    const t = clock.getElapsedTime()

    // subtle bob + very slow spin for blocks (no background 360 motion)
    blocks.forEach((b) => {
      const y = b.baseY + Math.sin(t * 0.6 + b.floatOffset) * 0.03
      b.group.position.y = y
      b.group.rotation.y += 0.0012
    })

    // background code snippets: billboard to camera, bob, parallax with camera
    for (const s of bgSnippets) {
      const sinY = Math.sin(t * 0.5 + s.phase) * s.amp
      s.plane.position.set(
        s.base.x + camera.position.x * s.parallax,
        s.base.y + sinY + camera.position.y * (s.parallax * 0.2),
        s.base.z + camera.position.z * s.parallax
      )
      s.plane.lookAt(camera.position)
    }

    // hover detection
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(blocks.map((b) => b.mesh))
    const obj = intersects[0]?.object
    const hit = blocks.find((b) => b.mesh === obj) || null
    if (hit !== hovered) {
      hovered?.setHover(false)
      hit?.setHover(true)
      hovered = hit
      document.body.style.cursor = hovered ? "pointer" : "auto"
    }

    // camera tween
    if (tween) {
      const now = performance.now()
      const p = Math.min(1, (now - tween.start) / tween.duration)
      const eased = easeInOutCubic(p)
      camera.position.lerpVectors(tween.startPos, tween.endPos, eased)
      lookTarget.lerpVectors(tween.startTarget, tween.endTarget, eased)
      camera.lookAt(lookTarget)
      if (p >= 1) tween = null
    } else {
      camera.lookAt(lookTarget)
    }

    renderer.render(scene, camera)
    raf = requestAnimationFrame(animate)
  }

  raf = requestAnimationFrame(animate)

  function destroy() {
    cancelAnimationFrame(raf)
    renderer.domElement.removeEventListener("mousemove", onMouseMove)
    renderer.domElement.removeEventListener("click", onClick)
    window.removeEventListener("resize", onResize)
    disposeScene(scene)
    renderer.dispose()
    if (renderer.domElement.parentElement === container) {
      container.removeChild(renderer.domElement)
    }
  }

  return { focus, destroy }
}

function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

function createParticles(count: number, radius: number) {
  const geom = new THREE.BufferGeometry()
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = radius * (0.6 + Math.random() * 0.4)
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const x = r * Math.sin(phi) * Math.cos(theta)
    const y = r * Math.sin(phi) * Math.sin(theta)
    const z = r * Math.cos(phi)
    pos.set([x, y, z], i * 3)
  }
  geom.setAttribute("position", new THREE.BufferAttribute(pos, 3))
  const mat = new THREE.PointsMaterial({
    size: 0.06,
    color: "#6ee7a6",
    depthWrite: false,
    transparent: true,
    opacity: 0.65,
  })
  return new THREE.Points(geom, mat)
}

function createHeroBlocks(scene: THREE.Scene): Block[] {
  const placements: { name: BlockName; pos: THREE.Vector3; rotY: number; snippetKey: keyof typeof stackSnippets }[] = [
    { name: "mern", pos: new THREE.Vector3(-5, 0.8, 0), rotY: Math.PI * 0.1, snippetKey: "mern" },
    { name: "blockchain", pos: new THREE.Vector3(0, 0.6, -5.2), rotY: 0, snippetKey: "blockchain" },
    { name: "ai", pos: new THREE.Vector3(5, 0.9, 0), rotY: -Math.PI * 0.12, snippetKey: "ai" },
  ]

  const blocks: Block[] = []

  for (const p of placements) {
    const snippet = stackSnippets[p.snippetKey]

    const texture = createCodeTexture({
      title: snippet.title,
      code: snippet.code,
      width: 1024,
      height: 512,
      theme: {
        background: "#0b0d0b",
        text: "#97f39a",
        heading: "#c3f7c6",
        border: "#1b2a1b",
        accent: "#1f7a3f",
        scanline: "rgba(151, 243, 154, 0.05)",
      },
    })

    const geo = new THREE.BoxGeometry(3.4, 1.9, 0.12)
    const base = new THREE.MeshStandardMaterial({ color: new THREE.Color("#0f1610"), roughness: 0.85, metalness: 0.08 })
    const hoverSide = new THREE.MeshStandardMaterial({ color: new THREE.Color("#16321e"), roughness: 0.7, metalness: 0.1, emissive: "#0a3", emissiveIntensity: 0.2 })
    const codeMat = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false })
    const mats: THREE.Material[] = [base, base, base, base, codeMat, codeMat]
    const mesh = new THREE.Mesh(geo, mats)

    const group = new THREE.Group()
    group.position.copy(p.pos)
    group.rotation.y = p.rotY
    group.add(mesh)

    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 2.4),
      new THREE.MeshBasicMaterial({ color: "#1a4e2a", transparent: true, opacity: 0.12 })
    )
    glow.rotation.x = -Math.PI / 2
    glow.position.set(0, -1.05, 0)
    group.add(glow)

    scene.add(group)

    const block: Block = {
      name: p.name,
      group,
      mesh,
      baseY: p.pos.y,
      floatOffset: Math.random() * Math.PI * 2,
      setHover: (hover: boolean) => {
        const arr = mesh.material as THREE.Material[]
        arr[0] = hover ? hoverSide : base
        arr[1] = hover ? hoverSide : base
        arr[2] = hover ? hoverSide : base
        arr[3] = hover ? hoverSide : base
      },
    }
    blocks.push(block)
  }

  return blocks
}

function createBackgroundSnippets(scene: THREE.Scene): BGSnippet[] {
  const group = new THREE.Group()
  scene.add(group)

  const count = Math.min(18, snippets.length)
  const items: BGSnippet[] = []

  for (let i = 0; i < count; i++) {
    const s = snippets[(i * 7) % snippets.length] // pseudo-random spread
    const tex = createCodeTexture({
      title: s.title,
      code: s.code,
      width: 768,
      height: 384,
      theme: {
        background: "rgba(11,13,11,0.85)",
        text: "#97f39a",
        heading: "#c3f7c6",
        border: "#1b2a1b",
        accent: "#1f7a3f",
        scanline: "rgba(151, 243, 154, 0.05)",
      },
    })
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping

    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
      toneMapped: false,
    })
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.3), mat)

    // distribute in a shell behind/around main blocks (no full rotation, just placed)
    const radius = 14 + Math.random() * 6
    const theta = Math.random() * Math.PI * 2
    const y = -2 + Math.random() * 6
    const x = Math.cos(theta) * radius
    const z = Math.sin(theta) * radius - 4

    plane.position.set(x, y, z)
    group.add(plane)

    items.push({
      plane,
      base: plane.position.clone(),
      phase: Math.random() * Math.PI * 2,
      amp: 0.25 + Math.random() * 0.25,
      parallax: 0.02 + Math.random() * 0.03,
    })
  }

  return items
}

function computeAnchors(blocks: Block[]): Record<UniverseSection, Anchor> {
  const lookup = Object.fromEntries(blocks.map((b) => [b.name, b] as const)) as Record<Block["name"], Block>

  function anchorNear(block: Block, distance = 4.2) {
    const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(block.group.quaternion)
    const pos = block.group.getWorldPosition(new THREE.Vector3()).clone().add(forward.multiplyScalar(distance))
    pos.y += 1.0
    const target = block.group.getWorldPosition(new THREE.Vector3()).clone().add(new THREE.Vector3(0, 0.4, 0))
    return { pos, target }
  }

  return {
    summary: anchorNear(lookup.mern, 4.2),
    projects: anchorNear(lookup.blockchain, 4.6),
    skills: anchorNear(lookup.ai, 4.2),
    experience: anchorNear(lookup.mern, 4.4),
    education: anchorNear(lookup.blockchain, 4.6),
    languages: anchorNear(lookup.ai, 4.2),
    contact: anchorNear(lookup.mern, 4.2),
  }
}

function disposeScene(obj: THREE.Object3D) {
  obj.traverse((child: any) => {
    if (child.isMesh) {
      child.geometry?.dispose()
      if (Array.isArray(child.material)) {
        child.material.forEach((m: any) => disposeMat(m))
      } else {
        child.material?.dispose?.()
      }
    }
    if (child.isPoints) {
      child.geometry?.dispose()
      child.material?.dispose?.()
    }
  })
}
function disposeMat(m: any) {
  m.map?.dispose?.()
  m.dispose?.()
}
