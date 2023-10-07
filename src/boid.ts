import { MeshBuilder, Scene, TransformNode, Vector3 } from "@babylonjs/core";

export class Boid {
    private static boids: Boid[] = [];

    public static create(scene: Scene) {
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
    private maxSpeed: number;
    private maxForce: number;
    private acceleration: Vector3;
    private node: TransformNode;

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
        this.maxSpeed = 0.1;
        this.maxForce = 1;

        this.acceleration = new Vector3();

        this.node = new TransformNode(`boid${Boid.id++}`, scene);
        const cone = MeshBuilder.CreateCylinder("cone", {
            diameterBottom: 1,
            diameterTop: 0,
            height: 1,
        });
        cone.rotate(Vector3.Right(), 1.5708); // 90 degrees
        cone.setParent(this.node);
    }

    public update(deltaTime: number) {
        const avoidance = this.avoidanceForce();
        this.applyForce(avoidance);

        this._velocity.addInPlace(this.acceleration.scaleInPlace(deltaTime));
        this.capLength(this._velocity, this.maxSpeed);
        this.position.addInPlace(this._velocity);
        this.acceleration.set(0, 0, 0);

        const boundsX = 20;
        if (this.position.x > boundsX) {
            this.position.x = -boundsX;
        } else if (this.position.x < -boundsX) {
            this.position.x = boundsX;
        }

        const boundsY = 20;
        if (this.position.y > boundsY) {
            this.position.y = -boundsY;
        } else if (this.position.y < -boundsY) {
            this.position.y = boundsY;
        }

        this.node.position.copyFrom(this.position);
        this.node.lookAt(this.position.add(this.velocity));
    }

    public applyForce(force: Vector3) {
        this.acceleration.addInPlace(force);
    }

    public steer(target: Vector3) {
        const desired = target.subtract(this.position);
        // desired.normalize().scaleInPlace(this.maxForce);
        this.capLength(desired, this.maxForce);
        const steer = desired.subtract(this._velocity);
        return steer;
    }

    private capLength(v: Vector3, maxLength: number) {
        const maxSquared = maxLength * maxLength;
        const lengthSquared = v.lengthSquared();
        if (lengthSquared > maxSquared) {
            v.normalize().scaleInPlace(maxLength);
        }
    }

    private avoidanceForce(): Vector3 {
        const avoidanceFactor = 5;
        const seeDistanceSquared = Math.pow(5, 2);
        const avoidanceForce = new Vector3();
        for (const boid of Boid.boids) {
            if (boid === this) {
                continue;
            }

            const distanceSquared = Vector3.DistanceSquared(
                this.position,
                boid.position,
            );
            if (distanceSquared > seeDistanceSquared) {
                continue;
            }

            const avoid = this.position
                .subtract(boid.position)
                .normalize()
                .scaleInPlace(avoidanceFactor);
            avoidanceForce.addInPlace(avoid);
        }
        return avoidanceForce;
    }
}
