import { Pane } from "tweakpane";
import { BOID_CONFIG, BOUNDS } from "./configs";

export function initPanes(): void {
    const pane = new Pane({ title: "Boids" });
    pane.addBinding(BOID_CONFIG, "seeDistance", { label: "See Distance" });
    pane.addBinding(BOID_CONFIG, "maxSpeed", { label: "Max Speed" });
    pane.addBinding(BOID_CONFIG, "maxSteerForce", { label: "Max Steer Force" });

    const forcesFolder = pane.addFolder({ title: "Steering Forces" });
    forcesFolder.addBinding(BOID_CONFIG, "alignmentForce", {
        label: "Alignment",
    });
    forcesFolder.addBinding(BOID_CONFIG, "avoidanceForce", {
        label: "Avoidance",
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

    const boundsFolder = pane.addFolder({ title: "Bounds" });
    boundsFolder.addBinding(BOUNDS, "width");
    boundsFolder.addBinding(BOUNDS, "height");
}
