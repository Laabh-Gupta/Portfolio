import {
  CanvasTexture,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Shape,
  SRGBColorSpace,
} from 'three';

/** Center a replacement face/model within this same 3.6 × 2.5 unit identity envelope. */
export function createMonogram(): Group {
  const group = new Group();
  const surface = document.createElement('canvas');
  surface.width = surface.height = 256;
  const context = surface.getContext('2d')!;
  const gradient = context.createLinearGradient(0, 0, 180, 256);
  gradient.addColorStop(0, '#f1f6f8');
  gradient.addColorStop(0.28, '#a3bdce');
  gradient.addColorStop(0.56, '#4d6a7c');
  gradient.addColorStop(0.76, '#809eaf');
  gradient.addColorStop(1, '#dcebf2');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y++) {
    context.fillStyle = `rgba(235,245,250,${0.02 + Math.abs(Math.sin(y * 31.1)) * 0.05})`;
    context.fillRect(0, y, 256, 0.5);
  }
  const finish = new CanvasTexture(surface);
  finish.colorSpace = SRGBColorSpace;
  const front = new MeshStandardMaterial({
    color: '#d6e4ed',
    map: finish,
    metalness: 0.78,
    roughness: 0.28,
    envMapIntensity: 1.4,
  });
  const edge = new MeshStandardMaterial({
    color: '#4d6d82',
    metalness: 0.9,
    roughness: 0.22,
    envMapIntensity: 1.4,
  });
  const outlines = [
    [
      [-1.72, 1.15],
      [-1.15, 1.15],
      [-1.15, -0.58],
      [-0.25, -0.58],
      [-0.25, -1.15],
      [-1.72, -1.15],
    ],
    [
      [1.7, 1.15],
      [0.4, 1.15],
      [0.05, 0.8],
      [0.05, -0.8],
      [0.4, -1.15],
      [1.7, -1.15],
      [1.7, 0.14],
      [0.88, 0.14],
      [0.88, -0.36],
      [1.15, -0.36],
      [1.15, -0.6],
      [0.62, -0.6],
      [0.62, 0.6],
      [1.7, 0.6],
    ],
  ];
  for (const points of outlines) {
    const shape = new Shape();
    points.forEach(([x, y], i) => (i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y)));
    shape.closePath();
    const geometry = new ExtrudeGeometry(shape, {
      depth: 0.46,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.045,
      bevelThickness: 0.045,
      curveSegments: 1,
    });
    geometry.translate(0, 0, -0.23);
    const position = geometry.getAttribute('position');
    const uv = geometry.getAttribute('uv');
    for (let i = 0; i < uv.count; i++)
      uv.setXY(i, (position.getX(i) + 1.8) / 3.6, (position.getY(i) + 1.2) / 2.4);
    group.add(new Mesh(geometry, [front, edge]));
  }
  return group;
}
