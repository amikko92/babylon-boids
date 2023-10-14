import { MeshBuilder, Scene, TransformNode, Vector3 } from "@babylonjs/core";

const SEE_DISTANCE = 5;

const WANDER_FACTOR = 1;
const AVOIDANCE_FACTOR = 1.1;
const ALIGNMENT_FACTOR = 1;
const COHESION_FACTOR = 1.2;

function randomRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

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
        this.maxSpeed = 0.1;
        this.maxForce = 0.2;

        this.acceleration = new Vector3();

        this.wanderAngle = 0;

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
        const wander = this.wanderDirection().scale(WANDER_FACTOR);
        const avoidance = this.avoidanceDirection().scale(AVOIDANCE_FACTOR);
        const alignment = this.alignmentDirection().scale(ALIGNMENT_FACTOR);
        const cohesion = this.cohesionDirection().scale(COHESION_FACTOR);

        const targetForce = wander.add(avoidance).add(alignment).add(cohesion);
        const steerForce = this.steerForce(targetForce);
        this.capLength(steerForce, this.maxForce);
        this.applyForce(steerForce);

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

    private avoidanceDirection(): Vector3 {
        const avoidanceDirection = new Vector3();

        // TODO: Don't just brute force through all boids
        for (const boid of Boid.boids) {
            if (boid === this) {
                continue;
            }

            const distance = Vector3.Distance(this.position, boid.position);
            if (distance > SEE_DISTANCE) {
                continue;
            }

            const avoid = this.position.subtract(boid.position);
            avoid.x /= distance;
            avoid.y /= distance;
            avoid.z = 0;

            avoidanceDirection.addInPlace(avoid);
        }
        return avoidanceDirection.normalize();
    }

    private alignmentDirection(): Vector3 {
        const alignmentDirection = new Vector3();
        let count = 0;

        for (const boid of Boid.boids) {
            if (boid === this) {
                continue;
            }

            const distance = Vector3.Distance(this.position, boid.position);
            if (distance > SEE_DISTANCE) {
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
        const averagePosition = new Vector3();
        let count = 0;

        for (const boid of Boid.boids) {
            if (boid === this) {
                continue;
            }

            const distance = Vector3.Distance(this.position, boid.position);
            if (distance > SEE_DISTANCE) {
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
}
