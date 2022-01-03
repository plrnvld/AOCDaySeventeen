// Example input
/*
const min_target_x = 20;
const max_target_x = 30;
const min_target_y = -10;
const max_target_y = -5;
*/

// Problem input

const min_target_x = 217;
const max_target_x = 240;
const min_target_y = -126;
const max_target_y = -69;

var solutions: [number, number][] = [];

function add_solution(new_solution: [number, number]) {
    let match = solutions.find(item => item[0] === new_solution[0] && item[1] === new_solution[1]);

    if (!match) {
        solutions.push(new_solution);
    }
}

for (var x = min_target_x; x <= max_target_x; x++) {
    let max_steps_for_pos = find_max_num_steps(x);
    console.log(`** Checking x=${x}, max steps = ${max_steps_for_pos}`);
    
    for (var y = min_target_y; y <= max_target_y; y++) {
        
        for (var num_steps = max_steps_for_pos; num_steps > 0; num_steps--) {
            let vel_x = find_required_start_velocity(x, num_steps);
            let vel_ys = find_required_start_height_super(y, num_steps, max_steps_for_pos);

            for (let vel_y of vel_ys) {            
                if (vel_x !== null && vel_y !== null) {
                    let new_solution: [number, number] = [vel_x!, vel_y!];
                    let hitcheck = fire(new_solution, is_in_target);
                    // console.log(`   Solution (${new_solution}) found for [${x},${y}] with ${num_steps} steps. Check: ${hitcheck}`);

                    if (hitcheck)
                        add_solution(new_solution);
                }
            }
        }     
    }
}

console.log(`Solutions length: ${solutions.length}`);

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

function find_required_start_height_super(end_height: number, num_steps: number, max_steps: number): number[] {
    let vertical_speedup = sum_step_sequence(num_steps - 1);
    
    var results: number[] = [];
        
    let max_vertical_flight = num_steps === max_steps // Probe falls vertically at the end
        ? 10000
        : 0;

    for (var vertical_flight = 0; vertical_flight <= max_vertical_flight; vertical_flight++) {
        let start_height = (end_height + vertical_speedup + vertical_flight) / num_steps;
    
        if (is_whole(start_height)) {
            results.push(start_height!);
        }
    }

    return results;
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
    return [Math.max(velocity[0] - iterations, 0), velocity[1] - iterations];
}

type TargetCheck = (pos: [number, number]) => boolean;

function is_in_target(pos: [number, number]): boolean {
    let x = pos[0];
    let y = pos[1];
    return x >= min_target_x && x <= max_target_x 
        && y >= min_target_y && y <= max_target_y;
}

function is_in_column_of_target(pos: [number, number], column_to_hit: number) {
    return is_in_target(pos) && pos[0] === column_to_hit;
}

function hits_position(pos: [number, number], pos_to_hit: [number, number]) {
    return pos[0] === pos_to_hit[0] && pos[1] === pos_to_hit[1];
}

function passed_target(pos: [number, number]): boolean {
    let x = pos[0];
    let y = pos[1];
    
    return x > max_target_x || y < min_target_y;
}

function is_whole(num: number): boolean {
    return Math.abs(num % 1) === 0;
}