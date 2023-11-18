import { BoundingBoxGizmo, CreateBox, Mesh, Scene } from "@babylonjs/core";
import { BOUNDARY_AREA } from "./configs";

export class BoundaryArea {
    private box: Mesh;
    private gizmo: BoundingBoxGizmo;

    public constructor(scene: Scene) {
        this.box = CreateBox("bounds", { size: 1 }, scene);
        this.box.isVisible = false;

        this.gizmo = new BoundingBoxGizmo();
        this.box.scaling.set(
            BOUNDARY_AREA.width,
            BOUNDARY_AREA.height,
            BOUNDARY_AREA.depth,
        );

        this.visible = false;
    }

    public set width(value: number) {
        this.box.scaling.x = value;
    }

    public set height(value: number) {
        this.box.scaling.y = value;
    }

    public set depth(value: number) {
        this.box.scaling.z = value;
    }

    public get visible(): boolean {
        return this.gizmo.attachedMesh !== null;
    }

    public set visible(value: boolean) {
        this.gizmo.attachedMesh = value ? this.box : null;
    }
}
