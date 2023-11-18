import { KeyboardEventTypes, Scene } from "@babylonjs/core";

export function setupInspector(scene: Scene) {
    if (import.meta.env.DEV) {
        import("@babylonjs/inspector").then((inspector) => {
            const { Inspector } = inspector;
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
        });
    }
}
