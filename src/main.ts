import "./style.css";

import {
    Engine,
    Scene,
    Vector3,
    HemisphericLight,
    FlyCamera,
    KeyboardEventTypes,
} from "@babylonjs/core";
import { Inspector } from "@babylonjs/inspector";
import { Boid } from "./boid";
import { initPanes } from "./tweakpanes";
import { BOID_COUNT } from "./configs";

initPanes();

const canvas = document.getElementById("babylon-canvas");

if (canvas instanceof HTMLCanvasElement) {
    const engine = new Engine(canvas, true);

    const scene = new Scene(engine);
    const camera = new FlyCamera("camera", new Vector3(0, 0, -30), scene);
    camera.fov = 1;

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

    scene.onKeyboardObservable.add((keyboardInfo) => {
        const { type, event } = keyboardInfo;
        if (type === KeyboardEventTypes.KEYUP && event.key === "i") {
            if (Inspector.IsVisible) {
                Inspector.Hide();
            } else {
                Inspector.Show(scene, {});
            }
        }
    });
}
