import "./style.css";

import {
    Engine,
    Scene,
    Vector3,
    HemisphericLight,
    FlyCamera,
} from "@babylonjs/core";
import { Inspector } from "@babylonjs/inspector";
import { Boid } from "./boid";

const BOID_COUNT = 20;

const canvas = document.getElementById("babylon-canvas");

if (canvas instanceof HTMLCanvasElement) {
    const engine = new Engine(canvas, true);

    const scene = new Scene(engine);
    const camera = new FlyCamera("camera", new Vector3(0, 0, -30), scene);
    camera.attachControl();

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    for (let i = 0; i < BOID_COUNT; i++) {
        Boid.create(scene);
    }

    engine.runRenderLoop(() => {
        const deltaMS = scene.deltaTime ?? 0;
        const deltaS = deltaMS * 0.001;

        Boid.update(deltaS);

        scene.render();
    });

    window.addEventListener("resize", () => {
        engine.resize();
    });

    Inspector.Show(scene, {});
}
