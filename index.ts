const minTargetX = 217;
const maxTargetX = 240;
const minTargetY = -126;
const maxTargetY = -69;

const epsilon = 0.0000000001;

console.log("Max height:" + max_height([21,125]));

function max_height(step: [number, number]): number {
    var x = step[0];
    var y = step[1];

    return y <= epsilon
        ? 0
        : sum_step_sequence(y);
}

function sum_step_sequence(maxStep: number): number {
    var maxStepRounded = Math.round(maxStep);
    return maxStepRounded * (maxStepRounded + 1) / 2;
}


function find_required_step(pos: number): number | null {
    var step_estimated = -0.5 + Math.sqrt(1 + 8*pos)/2;

    var sum_step = sum_step_sequence(step_estimated);

    return is_really_close(sum_step, pos)
        ? step_estimated
        : null;
}


function next_step(step: [number, number], iterations: number = 1): [number, number] {
    var x = step[0];
    var y = step[1];

    var intermediateX = x - iterations;

    var nextX = is_smaller_than_or_equal_to_zero(intermediateX)
        ? 0
        : intermediateX;

    var nextY = y - iterations;

    return [nextX, nextY];
}

function is_in_target(x: number, y: number): boolean {
    return x >= minTargetX && x <= maxTargetX 
        && y >= minTargetY && y <= maxTargetY;
}

function passed_target(x: number, y: number): boolean {
    return x > maxTargetX || y < minTargetY;
}

function is_really_close(x1: number, x2: number) : boolean {
    return Math.abs(x1 - x2) < epsilon;
}

function is_smaller_than_or_equal_to_zero(x: number) : boolean {
    return x < epsilon;
}
