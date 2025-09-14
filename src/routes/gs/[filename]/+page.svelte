<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import * as pc from "playcanvas";

  let canvas: HTMLCanvasElement;

  // 直接從 URL 參數中獲取 filename (使用 Svelte 5 的 $derived)
  const filename = $derived($page.params.filename);

  onMount(() => {
    let app: any;

    const initPlayCanvas = () => {
      // Create PlayCanvas application
      app = new pc.Application(canvas, {
        graphicsDeviceOptions: {
          antialias: false,
        },
      });

      app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
      app.setCanvasResolution(pc.RESOLUTION_AUTO);
      app.start();

      // Handle window resize
      const handleResize = () => app.resizeCanvas();
      window.addEventListener("resize", handleResize);

      try {
        // 偵測檔案格式並設定正確的 asset 類型
        let assetType = "gsplat";
        let fileUrl = `/${filename}`;

        // 如果檔案名稱沒有副檔名，嘗試不同的格式
        if (filename && !filename.includes(".")) {
          // 嘗試常見的格式
          const formats = [".sog", ".splat", ".zip"];

          for (const format of formats) {
            const testUrl = `/${filename}${format}`;
            fileUrl = testUrl;
            break;
          }
        }

        // 創建相機
        const camera = new pc.Entity("Camera");
        camera.setPosition(0, 0, 5);
        camera.addComponent("camera", {
          clearColor: new pc.Color(0.1, 0.1, 0.1, 1),
          fov: 60,
        });
        app.root.addChild(camera);

        // 載入 splat asset
        const splatAsset = new pc.Asset("splat", assetType, {
          url: fileUrl,
        });

        app.assets.add(splatAsset);
        app.assets.load(splatAsset);

        splatAsset.ready(() => {
          if (splatAsset.resource) {
            // Create splat entity
            const splat = new pc.Entity("Gaussian Splat");
            splat.setPosition(0, 0, 0);
            splat.setEulerAngles(0, 0, 0);

            splat.addComponent("gsplat", {
              asset: splatAsset,
              enabled: true,
            });
            app.root.addChild(splat);

            // 讓相機看向 splat
            camera.lookAt(splat.getPosition());
          }
        });
      } catch (error) {
        console.error("Error loading Gaussian Splat:", error);
      }
    };

    initPlayCanvas();

    // Cleanup function
    return () => {
      if (app) {
        app.destroy();
      }
    };
  });
</script>

<canvas bind:this={canvas}></canvas>
