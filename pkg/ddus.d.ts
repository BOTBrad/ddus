/* tslint:disable */
/**
* @returns {Game} 
*/
export function new_game(): Game;
/**
*/
export class Event {
  free(): void;
}
/**
*/
export class Game {
  free(): void;
/**
* @param {number} timestamp 
* @param {number} value 
* @param {string} user 
*/
  handle_event(timestamp: number, value: number, user: string): void;
/**
* @param {number} now 
* @returns {Int32Array} 
*/
  draw(now: number): Int32Array;
}

/**
* If `module_or_path` is {RequestInfo}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {RequestInfo | BufferSource | WebAssembly.Module} module_or_path
*
* @returns {Promise<any>}
*/
export default function init (module_or_path?: RequestInfo | BufferSource | WebAssembly.Module): Promise<any>;
        