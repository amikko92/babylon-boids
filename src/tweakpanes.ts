import { Pane } from "tweakpane";
import { BOID_CONFIG, BOUNDARY_AREA } from "./configs";
import { BoundaryArea } from "./boundingBox";
import { Boid } from "./boid";
import { Scene } from "@babylonjs/core";

export function initPanes(scene: Scene, boundaryArea: BoundaryArea): void {
    const pane = new Pane({ title: "Boids" });
    const boidCountBinding = pane.addBinding(BOID_CONFIG, "count", {
        label: "boid Count",
        min: 0,
        format: (v) => v.toFixed(0),
    });
    boidCountBinding.on("change", (event) => {
        Boid.setCount(scene, event.value);
    });

    pane.addBinding(BOID_CONFIG, "seeDistance", { label: "See Distance" });
    pane.addBinding(BOID_CONFIG, "maxSpeed", { label: "Max Speed" });
    pane.addBinding(BOID_CONFIG, "maxSteerForce", { label: "Max Steer Force" });

    const forcesFolder = pane.addFolder({ title: "Steering Forces" });
    forcesFolder.addBinding(BOID_CONFIG, "alignmentForce", {
        label: "Alignment",
    });
    forcesFolder.addBinding(BOID_CONFIG, "separationForce", {
        label: "Separation",
    });
    forcesFolder.addBinding(BOID_CONFIG, "boundsForce", {
        label: "Bounds",
    });
    forcesFolder.addBinding(BOID_CONFIG, "cohesionForce", {
        label: "Cohesion",
    });
    forcesFolder.addBinding(BOID_CONFIG, "wanderForce", {
        label: "Wander",
    });

    const boundaryAreaFolder = pane.addFolder({ title: "Boundary Area" });
    const widthBinding = boundaryAreaFolder.addBinding(BOUNDARY_AREA, "width");
    widthBinding.on("change", (event) => {
        boundaryArea.width = event.value;
    });
    const heightBinding = boundaryAreaFolder.addBinding(
        BOUNDARY_AREA,
        "height",
    );
    heightBinding.on("change", (event) => {
        boundaryArea.height = event.value;
    });
    const depthBinding = boundaryAreaFolder.addBinding(BOUNDARY_AREA, "depth");
    depthBinding.on("change", (event) => {
        boundaryArea.depth = event.value;
    });
    const boundsVisible = boundaryAreaFolder.addBinding(
        BOUNDARY_AREA,
        "visible",
    );
    boundsVisible.on("change", (event) => {
        boundaryArea.visible = event.value;
    });
}
