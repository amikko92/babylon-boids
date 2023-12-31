import "./style.css";

import {
    Engine,
    Scene,
    Vector3,
    HemisphericLight,
    Color4,
    Color3,
    ArcRotateCamera,
} from "@babylonjs/core";
import { Boid } from "./boid";
import { initPanes } from "./tweakpanes";
import { BoundaryArea } from "./boundingBox";
import { BOID_CONFIG } from "./configs";
import { setupInspector } from "./inspector";

const canvas = document.getElementById("babylon-canvas");

if (canvas instanceof HTMLCanvasElement) {
    const engine = new Engine(canvas, true);

    const scene = new Scene(engine);
    scene.clearColor = Color4.FromHexString("#FFFFFF");

    const camera = new ArcRotateCamera(
        "camera",
        0,
        0,
        50,
        Vector3.Zero(),
        scene,
    );
    camera.fov = 1;
    camera.attachControl();

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.groundColor = Color3.White();
    light.diffuse = Color3.White();
    light.intensity = 0.9;

    Boid.setCount(scene, BOID_CONFIG.count);

    engine.runRenderLoop(() => {
        const deltaMS = scene.deltaTime ?? 0;
        const deltaS = deltaMS * 0.001;

        Boid.update(deltaS);

        scene.render();
    });

    window.addEventListener("resize", () => {
        engine.resize();
    });

    const boundaryArea = new BoundaryArea(scene);
    initPanes(scene, boundaryArea);
    setupInspector(scene);
}
