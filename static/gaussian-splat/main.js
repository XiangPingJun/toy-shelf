import { Application, Asset, AssetListLoader, Entity, FILLMODE_FILL_WINDOW, RESOLUTION_AUTO, Color, Vec3, Pose } from 'playcanvas';

window.oncontextmenu = (e) => e.preventDefault()

// Create application
const canvas = document.getElementsByTagName('canvas')[0];

const app = new Application(canvas, {
  graphicsDeviceOptions: {
    deviceTypes: ['webgl2'],
    antialias: false,
    depth: false,
    stencil: false,
    xrCompatible: false,
    powerPreference: 'high-performance',
    alpha: true
  }
});
app.setCanvasFillMode(FILLMODE_FILL_WINDOW);
app.setCanvasResolution(RESOLUTION_AUTO);
app.start();

window.addEventListener('resize', () => app.resizeCanvas());

// Load assets
const plyUrl = '/v/gs.compressed.ply';

const assets = [
  new Asset('camera-controls', 'script', {
    url: './camera-controls.mjs'
  }),
  new Asset('toy', 'gsplat', {
    url: plyUrl
  })
];

const loader = new AssetListLoader(assets, app.assets);
await new Promise(resolve => loader.load(resolve));

// Create camera entity
const camera = new Entity('Camera');
camera.setPosition(7.735342502593994, 27.50370979309082, 6.404116153717041);
camera.addComponent('camera', {
  clearColor: new Color(0, 0, 0, 0)
});
camera.addComponent('script');
camera.script.create('cameraControls');
app.root.addChild(camera);

// Create splat entity
const splat = new Entity('Toy');
splat.setPosition(0, 0, 0);
splat.setEulerAngles(0, 0, 180);
splat.addComponent('gsplat', { asset: assets[1] });
app.root.addChild(splat);

window.getCameraState = () => {
  const { _pose } = camera.script.cameraControls
  return JSON.stringify([_pose.position, _pose.angles, _pose.distance])
};

window.setCameraState = (json) => {
  const data = JSON.parse(json)
  camera.script.cameraControls._controller.attach(new Pose(...data))
};

// setInterval(() => {
//   console.log(window.getCameraState())
// }, 2000);

// window.setCameraState('[{"x":4.166005800880602,"y":48.281585120573226,"z":-9.417080578315431},{"x":-77.96042605609706,"y":156.1359645196111,"z":0},49.36748396167881]')

// setTimeout(() => {
//   window.setCameraState('[{"x":14.75550979157104,"y":33.14927528704221,"z":15.10374562178117},{"x":-19.824745069629362,"y":44.536925750136575,"z":0},38.3129444675897]')
// }, 4000)