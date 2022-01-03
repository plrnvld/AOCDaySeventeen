// Example input

const min_target_x = 20;
const max_target_x = 30;
const min_target_y = -10;
const max_target_y = -5;


// Problem input
/*
const min_target_x = 217;
const max_target_x = 240;
const min_target_y = -126;
const max_target_y = -69;
*/

const epsilon = 0.0000000001;

var solutions: [number, number][] = [];

function add_solution(new_solution: [number, number]) {
    let match = solutions.find(item => is_equal_to(item[0], new_solution[0]) && is_equal_to(item[1], new_solution[1]));

    if (!match) {
        solutions.push(new_solution);
    }
}

console.log(`Running`);

for (var x = min_target_x; x <= max_target_x; x++) {
    let max_steps_for_pos = find_max_num_steps(x);
    console.log(`** Checking x=${x}, max steps = ${max_steps_for_pos}`);

    if (is_equal_to(x, sum_step_sequence(max_steps_for_pos))) {
        let size1 = solutions.length;
        fire_wild(x, is_in_target);
        let size2 = solutions.length;
        console.log(`>> Firing wild for pos=${x} gave ${size2 - size1} solutions`);
    } else {
        for (var y = min_target_y; y <= max_target_y; y++) {
            
            for (var num_steps = max_steps_for_pos; num_steps > 0; num_steps--) {
                let vel_x = find_required_start_velocity(x, num_steps);
                let vel_y = find_required_start_height(y, num_steps);

                if (vel_x !== null && vel_y !== null) {
                    let new_solution: [number, number] = [vel_x!, vel_y!];
                    let hitcheck = fire(new_solution, is_in_target);
                    console.log(`   Solution (${new_solution}) found for [${x},${y}] with ${num_steps} steps. Check: ${hitcheck}`);
                    add_solution(new_solution);
                }
            }     
        }
    }
}


// 2239 too low
// 2355 too high





console.log(`Solutions length: ${solutions.length}`);


function fire_wild(horizontal_step: number, target_check: TargetCheck) {
    for (var i = -100; i <= 200; i++) {
        var velocity:[number, number] = [horizontal_step, i];
        var is_hit = fire(velocity, target_check);
        if (is_hit)
            console.log(`      Firing: (${velocity}) ==> ${is_hit ? "hit" : "miss"}`);

        if (is_hit) {
            add_solution(velocity);
        }
    }
}

function fire(velocity: [number, number], target_check: TargetCheck): boolean {
    let pos: [number, number] = [0, 0];

    while (!passed_target(pos)) {
        if (target_check(pos))
            return true;

        pos[0] += velocity[0];
        pos[1] += velocity[1];
        velocity = next_velocity(velocity);
    }

    return false;
}

function max_height(step: [number, number]): number {
    let y = step[1];

    return y <= epsilon
        ? 0
        : sum_step_sequence(y);
}

function sum_step_sequence(maxStep: number): number {
    var maxStepRounded = Math.round(maxStep);
    return maxStepRounded * (maxStepRounded + 1) / 2;
}

function find_required_start_velocity(pos: number, num_steps: number): number | null {
    let horizontal_slowdown = sum_step_sequence(num_steps - 1);
    let start_velocity = (pos + horizontal_slowdown) / num_steps;

    return is_whole(start_velocity)
        ? start_velocity
        : null;
}

function find_required_start_height(end_height: number, num_steps: number): number | null {
    let vertical_speedup = sum_step_sequence(num_steps - 1);
    let start_height = (end_height + vertical_speedup) / num_steps;

    return is_whole(start_height)
        ? start_height
        : null;
}

function find_max_num_steps(pos: number): number {
    return Math.floor(find_required_step_decimal(pos));
}

function find_required_step(pos: number): number | null {
    var step_estimated = find_required_step_decimal(pos);

    return is_whole(step_estimated)
        ? step_estimated
        : null;
}

function find_required_step_decimal(pos: number): number {
    return -0.5 + Math.sqrt(1 + 8*pos)/2;
}

function next_velocity(velocity: [number, number], iterations: number = 1): [number, number] {
    var x = velocity[0];
    var y = velocity[1];

    var intermediate_x = x - iterations;

    var next_x = is_smaller_than_or_equal_to(intermediate_x, 0)
        ? 0
        : intermediate_x;

    var next_y = y - iterations;

    return [next_x, next_y];
}

type TargetCheck = (pos: [number, number]) => boolean;

function is_in_target(pos: [number, number]): boolean {
    let x = pos[0];
    let y = pos[1];
    return x >= min_target_x && x <= max_target_x 
        && y >= min_target_y && y <= max_target_y;
}

function is_in_column_of_target(pos: [number, number], column_to_hit: number) {
    return is_in_target(pos) && is_equal_to(pos[0], column_to_hit);
}

function hits_position(pos: [number, number], pos_to_hit: [number, number]) {
    return is_equal_to(pos[0], pos_to_hit[0]) 
        && is_equal_to(pos[1], pos_to_hit[1]);
}

function passed_target(pos: [number, number]): boolean {
    let x = pos[0];
    let y = pos[1];
    
    return is_larger_than_or_equal_to(x, max_target_x + 1) 
        || is_smaller_than_or_equal_to(y, min_target_y - 1);
}

function is_smaller_than_or_equal_to(num: number, limit: number) : boolean {
    return num < limit + epsilon;
}

function is_larger_than_or_equal_to(num: number, limit: number) : boolean {
    return num > limit + epsilon;
}

function is_whole(num: number): boolean {
    return Math.abs(num % 1) < epsilon;
}

function is_equal_to(num: number, target: number) {
    return Math.abs(num - target) < epsilon;
}