# Babylon Boids

Boids implementation rendered using Babylon.js.

## How to run

Install dependencies: `npm install`

Development build: `npm run dev`

Production build: `npm run build`

Preview production build: `npm run preview`

## Features

Tweak the parameters used for the boids simulation using the tweakpane panel.
The following parameters are available.

-   **Boids**
    -   **Boid Count** - Number of boids in the scene.
    -   **Max Speed** - How fast the boids can move.
    -   **Max steer force** - Limits how fast a boid can change direction.
-   **Steering Forces**
    -   **Alignment** - Boids tendency to move in the same direction.
    -   **Separation** - Boids tendency to move away from each other.
    -   **Bounds** - Boids tendency to steer back towards the _boundary area_.
    -   **Cohesion** - Boids tendency to stick together.
    -   **Wander** - Boids tendency to fly off on their own.
-   **Boundary Area**
    -   **Width** - Width of the boundary area.
    -   **Height** - Height of the boundary area.
    -   **Depth** - Depth of the boundary area.
    -   **Visible** - Toggle if the boundary area is visible.

Note, changes aren't saved. Reload the application to restore default values.
