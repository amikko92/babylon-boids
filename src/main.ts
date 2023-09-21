import "./style.css";

import {
    Engine,
    Scene,
    ArcRotateCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
} from "@babylonjs/core";

const canvas = document.getElementById("babylon-canvas");

if (canvas instanceof HTMLCanvasElement) {
    const engine = new Engine(canvas, true);

    const scene = new Scene(engine);
    const camera = new ArcRotateCamera(
        "camera",
        0,
        0,
        10,
        new Vector3(0, 0, 0),
        scene,
    );
    camera.setPosition(new Vector3(0, 0, 20));
    camera.attachControl(canvas, true);

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    const box = MeshBuilder.CreateBox("box", { size: 1 });

    engine.runRenderLoop(() => {
        const deltaTime = scene.deltaTime ?? 0;
        box.rotation.y += 0.001 * deltaTime;
        scene.render();
    });

    window.addEventListener("resize", () => {
        engine.resize();
    });
}
