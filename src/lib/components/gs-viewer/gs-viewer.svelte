<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import * as pc from "playcanvas";
  import { CameraControls } from "./gs-camera-controls.js";
  import { activePage, splatPov, resources } from "$lib/stores/store";

  let canvas: HTMLCanvasElement;
  let app: pc.Application;
  let camera: pc.Entity;
  let saveInterval: ReturnType<typeof setInterval>;
  let lastSavedPov: string | undefined;

  export const saveCameraState = async () => {
    if (!camera?.script?.cameraControls) {
      return null;
    }
    const {
      _pose: { position, angles, distance },
    } = camera.script.cameraControls;

    const povToSave = JSON.stringify(
      [...position.toArray(), ...angles.toArray(), distance].map(
        (n) => Math.round(n * 10000) / 10000,
      ),
    );

    if (lastSavedPov !== povToSave) {
      lastSavedPov = povToSave;
      await fetch("/api/kv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "splat-camera-state",
          value: povToSave,
        }),
      });
      console.info(povToSave);
    }
  };

  export const setCameraState = (data: any[]) => {
    camera?.script?.cameraControls?._controller.attach(
      new pc.Pose(
        new pc.Vec3(...data.slice(0, 3)),
        new pc.Vec3(...data.slice(3, 6)),
        data[6],
      ),
    );
  };

  onMount(async () => {
    if (!canvas) return;

    // Create application
    app = new pc.Application(canvas, {
      graphicsDeviceOptions: {
        deviceTypes: ["webgl2"],
        antialias: false,
        depth: false,
        stencil: false,
        xrCompatible: false,
        powerPreference: "high-performance",
        alpha: true,
      },
    });

    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    app.setCanvasResolution(pc.RESOLUTION_AUTO);
    app.start();

    // Register CameraControls
    pc.registerScript(CameraControls, "cameraControls");

    // Resize handler
    const handleResize = () => app.resizeCanvas();
    window.addEventListener("resize", handleResize);

    // Load assets
    const assets = [
      new pc.Asset("toy", "gsplat", {
        url: $resources[$activePage.url] ?? undefined,
      }),
    ];

    const loader = new pc.AssetListLoader(assets, app.assets);
    await new Promise<void>((resolve) => loader.load(() => resolve()));

    // Create camera entity
    camera = new pc.Entity("Camera");
    camera.setPosition(0, 0, 2.5);
    camera.addComponent("camera", {
      clearColor: new pc.Color(0, 0, 0, 0),
    });
    camera.addComponent("script");
    camera.script?.create("cameraControls");
    app.root.addChild(camera);

    // Create splat entity
    const splat = new pc.Entity("Toy");
    splat.setPosition(0, 0, 0);
    splat.setEulerAngles(0, 0, 180);
    splat.addComponent("gsplat", { asset: assets[0] });
    app.root.addChild(splat);

    saveInterval = setInterval(saveCameraState, 1000);

    setCameraState(JSON.parse($activePage.firstPov));

    return () => {
      window.removeEventListener("resize", handleResize);
      app.destroy();
    };
  });

  $effect(() => {
    if (!$splatPov) {
      return;
    }
    console.log($splatPov);
    setCameraState(JSON.parse($splatPov));
  });

  onDestroy(() => {
    if (app) {
      app.destroy();
    }
  });
</script>

<canvas bind:this={canvas} class="w-full h-full cursor-grab"></canvas>
