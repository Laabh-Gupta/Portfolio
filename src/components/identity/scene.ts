import {
  ACESFilmicToneMapping,
  DirectionalLight,
  Group,
  HemisphereLight,
  Material,
  Mesh,
  OrthographicCamera,
  PMREMGenerator,
  Scene,
  Texture,
  WebGLRenderer,
  WebGLRenderTarget,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createMonogram } from './model';

export interface IdentityScene {
  setVisible: (visible: boolean) => void;
  dispose: () => void;
}

function disposeModel(scene: Scene) {
  const materials = new Set<Material>();
  scene.traverse((object) => {
    if (object instanceof Mesh) {
      object.geometry.dispose();
      (Array.isArray(object.material) ? object.material : [object.material]).forEach((material) =>
        materials.add(material),
      );
    }
  });
  const textures = new Set<Texture>();
  materials.forEach((material) => {
    Object.values(material).forEach((value) => {
      if (value instanceof Texture) textures.add(value);
    });
    material.dispose();
  });
  textures.forEach((texture) => texture.dispose());
}

export function mountIdentityScene(
  host: HTMLElement,
  onFailure: () => void,
  modelFactory: () => Group = createMonogram,
): IdentityScene | null {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('webgl2', {
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
  });
  if (!context) return null;
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, context, alpha: true, antialias: true });
  } catch {
    context.getExtension('WEBGL_lose_context')?.loseContext();
    return null;
  }
  const scene = new Scene();
  const camera = new OrthographicCamera(-2.6, 2.6, 2.6, -2.6, 0.1, 30);
  camera.position.set(0, 0, 8);
  let environment: WebGLRenderTarget | undefined;
  let model: Group;
  try {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    const pmrem = new PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    try {
      environment = pmrem.fromScene(room, 0.05);
      scene.environment = environment.texture;
    } finally {
      room.dispose();
      pmrem.dispose();
    }
    model = modelFactory();
    model.rotation.set(0.12, -0.32, -0.07);
    scene.add(model, new HemisphereLight('#cce7f8', '#17232e', 1.1));
    const key = new DirectionalLight('#edf2f6', 3.5);
    key.position.set(-3, 5, 5);
    const rim = new DirectionalLight('#98d6de', 4);
    rim.position.set(4, -1, 2);
    scene.add(key, rim);
  } catch {
    disposeModel(scene);
    environment?.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    return null;
  }
  host.appendChild(canvas);
  let visible = true;
  let disposed = false;
  let frame = 0;
  let targetX = 0.12;
  let targetY = -0.32;
  let lastFrame = 0;
  function render(now: number) {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    const delta = Math.min((now - lastFrame) / 16.7 || 1, 3);
    lastFrame = now;
    const easing = 1 - Math.pow(0.82, delta);
    model.rotation.x += (targetX - model.rotation.x) * easing;
    model.rotation.y += (targetY - model.rotation.y) * easing;
    try {
      renderer.render(scene, camera);
    } catch {
      onFailure();
      return;
    }
    if (Math.abs(targetX - model.rotation.x) + Math.abs(targetY - model.rotation.y) > 0.0005)
      frame = requestAnimationFrame(render);
  }
  function invalidate() {
    if (!frame && !disposed && visible && !document.hidden) frame = requestAnimationFrame(render);
  }
  const resize = new ResizeObserver(() => {
    if (disposed) return;
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    const aspect = width / height;
    camera.left = -2.65 * aspect;
    camera.right = 2.65 * aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    invalidate();
  });
  const move = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    const rect = host.getBoundingClientRect();
    targetX = 0.12 + ((event.clientY - rect.top - rect.height / 2) / rect.height) * 0.22;
    targetY = -0.32 + ((event.clientX - rect.left - rect.width / 2) / rect.width) * 0.5;
    invalidate();
  };
  const leave = () => {
    targetX = 0.12;
    targetY = -0.32;
    invalidate();
  };
  const visibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else invalidate();
  };
  const contextLost = (event: Event) => {
    event.preventDefault();
    onFailure();
  };
  resize.observe(host);
  host.addEventListener('pointermove', move);
  host.addEventListener('pointerleave', leave);
  document.addEventListener('visibilitychange', visibility);
  canvas.addEventListener('webglcontextlost', contextLost);
  return {
    setVisible(value) {
      visible = value;
      if (!value) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else invalidate();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', visibility);
      canvas.removeEventListener('webglcontextlost', contextLost);
      disposeModel(scene);
      environment?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
