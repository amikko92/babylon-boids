import {
    Mesh,
    MeshBuilder,
    Scene,
    TransformNode,
    Vector3,
} from "@babylonjs/core";
import { BOID_CONFIG, BOUNDS } from "./configs";

function randomRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export class Boid {
    private static boids: Boid[] = [];
    private static cone?: Mesh;

    public static create(scene: Scene) {
        if (Boid.cone === undefined) {
            Boid.cone = MeshBuilder.CreateCylinder("cone", {
                diameterBottom: 1,
                diameterTop: 0,
                height: 1,
            });
            Boid.cone.isVisible = false;
        }

        this.boids.push(new Boid(scene));
    }

    public static update(deltaTime: number): void {
        for (const boid of Boid.boids) {
            boid.update(deltaTime);
        }
    }

    private static id = 0;

    private _position: Vector3;
    private _velocity: Vector3;
    private acceleration: Vector3;
    private node: TransformNode;
    private wanderAngle: number;

    public get position(): Vector3 {
        return this._position;
    }

    public get velocity(): Vector3 {
        return this._velocity;
    }

    private constructor(scene: Scene) {
        this._position = new Vector3(
            (Math.random() - 0.5) * 2 * 10,
            (Math.random() - 0.5) * 2 * 10,
            0,
        );
        this._velocity = new Vector3(
            Math.sin(2 * Math.PI * Math.random()),
            Math.cos(2 * Math.PI * Math.random()),
            0,
        );

        this.acceleration = new Vector3();

        this.wanderAngle = 0;

        this.node = new TransformNode(`boid${Boid.id++}`, scene);
        const cone = Boid.cone?.createInstance("cone");
        cone?.rotate(Vector3.Right(), 1.5708); // 90 degrees
        cone?.setParent(this.node);
    }

    public update(deltaTime: number) {
        const {
            alignmentForce,
            separationForce,
            boundsForce,
            cohesionForce,
            wanderForce,
            maxSpeed,
            maxSteerForce,
        } = BOID_CONFIG;

        const wander = this.wanderDirection().scale(wanderForce);
        const separation = this.separationDirection().scale(separationForce);
        const alignment = this.alignmentDirection().scale(alignmentForce);
        const cohesion = this.cohesionDirection().scale(cohesionForce);
        const bounds = this.boundsDirection().scale(boundsForce);

        const targetForce = wander
            .add(separation)
            .add(alignment)
            .add(cohesion)
            .add(bounds);
        const steerForce = this.steerForce(targetForce);
        this.capLength(steerForce, maxSteerForce);
        this.applyForce(steerForce);

        this._velocity.addInPlace(this.acceleration.scaleInPlace(deltaTime));
        this.capLength(this._velocity, maxSpeed);
        this.position.addInPlace(this._velocity);
        this.acceleration.set(0, 0, 0);

        this.node.position.copyFrom(this.position);
        this.node.lookAt(this.position.add(this.velocity));
    }

    public applyForce(force: Vector3) {
        this.acceleration.addInPlace(force);
    }

    public steerForce(desiredVelocity: Vector3) {
        return desiredVelocity.subtract(this._velocity);
    }

    private capLength(v: Vector3, maxLength: number) {
        const maxSquared = maxLength * maxLength;
        const lengthSquared = v.lengthSquared();
        if (lengthSquared > maxSquared) {
            v.normalize().scaleInPlace(maxLength);
        }
    }

    private wanderDirection(): Vector3 {
        this.wanderAngle += 0.1 * randomRange(-2 * Math.PI, 2 * Math.PI);
        const randomCirclePoint = new Vector3(
            Math.sin(this.wanderAngle),
            Math.cos(this.wanderAngle),
            0,
        );

        const positionAhead = this.position.add(this.node.forward.scale(3));
        positionAhead.z = 0;

        const target = positionAhead.add(randomCirclePoint);
        const wander = target.subtract(this.position);

        return wander.normalize();
    }

    private separationDirection(): Vector3 {
        const { seeDistance } = BOID_CONFIG;
        const separationDirection = new Vector3();

        for (const boid of Boid.boids) {
            if (boid === this) {
                continue;
            }

            const distance = Vector3.Distance(this.position, boid.position);
            if (distance > seeDistance) {
                continue;
            }

            const separation = this.position.subtract(boid.position);
            separation.x /= distance;
            separation.y /= distance;
            separation.z = 0;

            separationDirection.addInPlace(separation);
        }
        return separationDirection.normalize();
    }

    private alignmentDirection(): Vector3 {
        const { seeDistance } = BOID_CONFIG;
        const alignmentDirection = new Vector3();
        let count = 0;

        for (const boid of Boid.boids) {
            if (boid === this) {
                continue;
            }

            const distance = Vector3.Distance(this.position, boid.position);
            if (distance > seeDistance) {
                continue;
            }

            alignmentDirection.addInPlace(boid.velocity);
            count += 1;
        }

        if (count > 0) {
            alignmentDirection.x /= count;
            alignmentDirection.y /= count;
            alignmentDirection.z = 0;
        }

        return alignmentDirection.normalize();
    }

    private cohesionDirection(): Vector3 {
        const { seeDistance } = BOID_CONFIG;
        const averagePosition = new Vector3();
        let count = 0;

        for (const boid of Boid.boids) {
            if (boid === this) {
                continue;
            }

            const distance = Vector3.Distance(this.position, boid.position);
            if (distance > seeDistance) {
                continue;
            }

            averagePosition.addInPlace(boid.position);
            count += 1;
        }

        if (count > 0) {
            averagePosition.x /= count;
            averagePosition.y /= count;
            averagePosition.z = 0;
        }

        const cohesionDirection = averagePosition.subtract(this.position);

        return cohesionDirection.normalize();
    }

    private boundsDirection(): Vector3 {
        const boundsDirection = new Vector3();
        const boundsHalfWidth = BOUNDS.width * 0.5;
        const boundsHalfHeight = BOUNDS.height * 0.5;

        if (this.position.x > boundsHalfWidth) {
            boundsDirection.x = -1;
        } else if (this.position.x < -boundsHalfWidth) {
            boundsDirection.x = 1;
        }

        if (this.position.y > boundsHalfHeight) {
            boundsDirection.y = -1;
        } else if (this.position.y < -boundsHalfHeight) {
            boundsDirection.y = 1;
        }

        return boundsDirection.normalize();
    }
}
