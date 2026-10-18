import { identityVertices, identityTriangles, identityFeatureEdges } from '../../data/identity';

export type IdentityMode = 'wireframe' | 'solid' | 'particles';
export type Vec3 = readonly [number, number, number];
export type ProjectedVertex = { x: number; y: number; z: number };
export type Facet = { a: number; b: number; c: number; z: number; light: number; facing: number };
export type IdentityFrame = { vertices: ProjectedVertex[]; facets: Facet[]; visible: Set<number> };
export const basePose = { yaw: -0.16, pitch: 0.025 };
const count = identityVertices.length / 3;
const xs = Array.from({ length: count }, (_, i) => identityVertices[i * 3]);
const ys = Array.from({ length: count }, (_, i) => identityVertices[i * 3 + 1]);
const zs = Array.from({ length: count }, (_, i) => identityVertices[i * 3 + 2]);
const center = [
  (Math.min(...xs) + Math.max(...xs)) / 2,
  (Math.min(...ys) + Math.max(...ys)) / 2,
  (Math.min(...zs) + Math.max(...zs)) / 2,
];
const scale = 358 / (Math.max(...ys) - Math.min(...ys));
const key = [-0.47, 0.65, 0.6];

export function identityFrame(yaw = basePose.yaw, pitch = basePose.pitch): IdentityFrame {
  const world: Vec3[] = [];
  const vertices: ProjectedVertex[] = [];
  const cy = Math.cos(yaw),
    sy = Math.sin(yaw),
    cp = Math.cos(pitch),
    sp = Math.sin(pitch);
  for (let i = 0; i < count; i++) {
    const x = identityVertices[i * 3] - center[0];
    const y = identityVertices[i * 3 + 1] - center[1];
    const z = identityVertices[i * 3 + 2] - center[2];
    const xx = x * cy + z * sy,
      zz = z * cy - x * sy;
    const yy = y * cp - zz * sp,
      depth = zz * cp + y * sp;
    world.push([xx, yy, depth]);
    const perspective = 8.5 / (8.5 - depth);
    vertices.push({
      x: 260 + xx * scale * perspective,
      y: 257 - yy * scale * perspective,
      z: depth,
    });
  }
  const facets: Facet[] = [];
  const visible = new Set<number>();
  for (let i = 0; i < identityTriangles.length; i += 3) {
    const a = identityTriangles[i],
      b = identityTriangles[i + 1],
      c = identityTriangles[i + 2];
    const p = world[a],
      q = world[b],
      r = world[c];
    const ux = q[0] - p[0],
      uy = q[1] - p[1],
      uz = q[2] - p[2];
    const vx = r[0] - p[0],
      vy = r[1] - p[1],
      vz = r[2] - p[2];
    const nx = uy * vz - uz * vy,
      ny = uz * vx - ux * vz,
      nz = ux * vy - uy * vx;
    const length = Math.hypot(nx, ny, nz) || 1;
    const facing = nz / length;
    if (facing < 0.015) continue;
    const diffuse = Math.max(0, (nx / length) * key[0] + (ny / length) * key[1] + facing * key[2]);
    const specular = Math.pow(
      Math.max(0, (nx / length) * -0.24 + (ny / length) * 0.36 + facing * 0.9),
      20,
    );
    const light = Math.min(1, 0.13 + diffuse * 0.7 + specular * 0.35 + (1 - facing) ** 2 * 0.12);
    facets.push({ a, b, c, z: (p[2] + q[2] + r[2]) / 3, light, facing });
    visible.add(a);
    visible.add(b);
    visible.add(c);
  }
  facets.sort((a, b) => a.z - b.z);
  return { vertices, facets, visible };
}

export function facetPath(frame: IdentityFrame, f: Facet) {
  const a = frame.vertices[f.a],
    b = frame.vertices[f.b],
    c = frame.vertices[f.c];
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}L${c.x.toFixed(1)} ${c.y.toFixed(1)}Z`;
}

export function drawIdentity(
  ctx: CanvasRenderingContext2D,
  size: number,
  frame: IdentityFrame,
  mode: IdentityMode,
  scan: number | null = null,
) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, size, size);
  ctx.setTransform(size / 520, 0, 0, size / 520, 0, 0);
  const scanY = scan == null ? -1000 : 60 + scan * 400;
  for (const facet of frame.facets) {
    const a = frame.vertices[facet.a],
      b = frame.vertices[facet.b],
      c = frame.vertices[facet.c];
    const y = (a.y + b.y + c.y) / 3;
    const scanning = Math.abs(y - scanY) < 16;
    const shade =
      mode === 'solid' ? Math.round(25 + facet.light * 200) : Math.round(10 + facet.light * 13);
    ctx.fillStyle = scanning
      ? `rgb(${shade * 0.65},${Math.min(255, shade + 36)},${shade * 0.4})`
      : `rgb(${shade},${shade + 2},${shade})`;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);
    ctx.closePath();
    ctx.fill();
    if (mode !== 'particles') {
      const opacity = mode === 'solid' ? 0.035 : 0.24 + facet.light * 0.64;
      ctx.strokeStyle = scanning ? '#c9f85c' : `rgba(226,233,224,${opacity})`;
      ctx.lineWidth = mode === 'solid' ? 0.35 : 0.65;
      ctx.stroke();
    }
  }
  if (mode === 'particles') {
    ctx.fillStyle = '#e2e8dd';
    for (const i of frame.visible) {
      const p = frame.vertices[i];
      ctx.globalAlpha = 0.45 + (p.z + 2) / 9;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 0.85, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  ctx.beginPath();
  for (let i = 0; i < identityFeatureEdges.length; i += 2) {
    const ai = identityFeatureEdges[i],
      bi = identityFeatureEdges[i + 1];
    if (!frame.visible.has(ai) || !frame.visible.has(bi)) continue;
    const a = frame.vertices[ai],
      b = frame.vertices[bi];
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
  }
  ctx.strokeStyle = mode === 'solid' ? '#c9f85c60' : '#c9f85ca0';
  ctx.lineWidth = 0.9;
  ctx.stroke();
  if (scan != null) {
    const glow = ctx.createLinearGradient(0, scanY - 17, 0, scanY + 17);
    glow.addColorStop(0, '#c9f85c00');
    glow.addColorStop(0.5, '#c9f85c15');
    glow.addColorStop(1, '#c9f85c00');
    ctx.fillStyle = glow;
    ctx.fillRect(112, scanY - 17, 296, 34);
    ctx.strokeStyle = '#d8ff8caa';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(112, scanY);
    ctx.lineTo(408, scanY);
    ctx.stroke();
    ctx.fillStyle = '#c9f85c';
    ctx.fillRect(109, scanY - 1.5, 3, 3);
    ctx.fillRect(408, scanY - 1.5, 3, 3);
  }
}
