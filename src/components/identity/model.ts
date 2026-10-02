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
    color: '#737373',
    metalness: 1,
    roughness: 0.24,
    clearcoat: 0.25,
    envMapIntensity: 2,
  });
  const l = new Shape();
  l.moveTo(-2.25, 1.24);
  l.lineTo(-1.59, 1.24);
  l.lineTo(-1.59, -0.57);
  l.quadraticCurveTo(-1.59, -0.7, -1.46, -0.7);
  l.lineTo(-0.53, -0.7);
  l.lineTo(-0.53, -1.32);
  l.lineTo(-1.98, -1.32);
  l.quadraticCurveTo(-2.25, -1.32, -2.25, -1.05);
  l.closePath();
  const g = new Shape();
  g.moveTo(1.83, 0.78);
  g.bezierCurveTo(1.27, 1.57, -0.06, 1.5, -0.48, 0.52);
  g.bezierCurveTo(-0.98, -0.64, -0.17, -1.48, 0.84, -1.37);
  g.bezierCurveTo(1.64, -1.31, 2.07, -0.8, 2.07, -0.18);
  g.lineTo(2.07, 0.2);
  g.lineTo(0.73, 0.2);
  g.lineTo(0.73, -0.34);
  g.lineTo(1.39, -0.34);
  g.bezierCurveTo(1.16, -1.04, 0.21, -0.98, 0.08, -0.18);
  g.bezierCurveTo(-0.07, 0.66, 0.99, 1.0, 1.37, 0.36);
  g.closePath();
  [l, g].forEach((shape, index) => {
    const geometry = new ExtrudeGeometry(shape, {
      depth: 0.64,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 1,
      bevelSize: 0.085,
      bevelThickness: 0.085,
      curveSegments: 64,
    });
    const positions = geometry.getAttribute('position');
    const uv = geometry.getAttribute('uv');
    for (let vertex = 0; vertex < positions.count; vertex++) {
      uv.setXY(vertex, (positions.getX(vertex) + 2.5) / 5, (positions.getY(vertex) + 1.7) / 3.4);
    }
    geometry.translate(0, 0, index === 0 ? -0.25 : -0.46);
    group.add(new Mesh(geometry, [silver, graphite]));
  });
  return group;
}
