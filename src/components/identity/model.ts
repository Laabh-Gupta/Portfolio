import {
  CanvasTexture,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  Shape,
  SRGBColorSpace,
} from 'three';

/** Replace this factory with a centered model within a 4.5 × 3 unit envelope. */
export function createMonogram(): Group {
  const group = new Group();
  // A procedural brushed finish gives planar faces variation under the studio lights.
  const finish = document.createElement('canvas');
  finish.width = finish.height = 512;
  const paint = finish.getContext('2d');
  if (!paint) throw new Error('Metal finish could not be created');
  const gradient = paint.createLinearGradient(10, 20, 475, 490);
  [
    [0, '#444444'],
    [0.18, '#ddddda'],
    [0.31, '#fafaf7'],
    [0.45, '#666666'],
    [0.64, '#d9d9d6'],
    [0.82, '#777777'],
    [1, '#eeeeeb'],
  ].forEach(([at, color]) => gradient.addColorStop(Number(at), String(color)));
  paint.fillStyle = gradient;
  paint.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y++) {
    paint.fillStyle = `rgba(255,255,255,${0.008 + ((y * 17) % 11) * 0.002})`;
    paint.fillRect(0, y, 512, 0.6);
  }
  const texture = new CanvasTexture(finish);
  texture.colorSpace = SRGBColorSpace;
  const silver = new MeshPhysicalMaterial({
    color: '#ffffff',
    map: texture,
    metalness: 1,
    roughness: 0.24,
    clearcoat: 0.35,
    clearcoatRoughness: 0.2,
    envMapIntensity: 1.5,
  });
  const graphite = new MeshPhysicalMaterial({
    color: '#929292',
    metalness: 0.85,
    roughness: 0.32,
    clearcoat: 0.25,
    envMapIntensity: 2,
  });
  const ceramic = new MeshPhysicalMaterial({
    color: '#e6e6e2',
    metalness: 0.12,
    roughness: 0.27,
    clearcoat: 0.65,
    clearcoatRoughness: 0.22,
  });
  const l = new Shape();
  l.moveTo(-2.12, 1.22);
  l.lineTo(-1.51, 1.22);
  l.lineTo(-1.51, -0.62);
  l.lineTo(-0.26, -0.62);
  l.lineTo(-0.26, -1.23);
  l.lineTo(-2.12, -1.23);
  l.closePath();
  const g = new Shape();
  g.moveTo(2.02, 0.7);
  g.lineTo(1.46, 1.25);
  g.lineTo(0.12, 1.25);
  g.lineTo(-0.45, 0.67);
  g.lineTo(-0.45, -0.67);
  g.lineTo(0.12, -1.25);
  g.lineTo(1.48, -1.25);
  g.lineTo(2.02, -0.7);
  g.lineTo(2.02, 0.18);
  g.lineTo(0.69, 0.18);
  g.lineTo(0.69, -0.34);
  g.lineTo(1.4, -0.34);
  g.lineTo(1.4, -0.47);
  g.lineTo(1.15, -0.72);
  g.lineTo(0.4, -0.72);
  g.lineTo(0.16, -0.48);
  g.lineTo(0.16, 0.48);
  g.lineTo(0.4, 0.72);
  g.lineTo(1.15, 0.72);
  g.lineTo(1.6, 0.29);
  g.closePath();
  [l, g].forEach((shape, index) => {
    const geometry = new ExtrudeGeometry(shape, {
      depth: 0.72,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.045,
      bevelThickness: 0.045,
      curveSegments: 12,
    });
    const positions = geometry.getAttribute('position');
    const uv = geometry.getAttribute('uv');
    for (let vertex = 0; vertex < positions.count; vertex++) {
      uv.setXY(vertex, (positions.getX(vertex) + 2.5) / 5, (positions.getY(vertex) + 1.7) / 3.4);
    }
    geometry.translate(0, 0, index === 0 ? 0.08 : -0.38);
    group.add(new Mesh(geometry, index === 0 ? ceramic : [silver, graphite]));
  });
  return group;
}
