/**********************************************************************
 * FUNC: a_maze_ing
 * AUTH: mattb0m
 * DATE: 2016/06/08
 * DESC: Generate a maze pattern on a new or existing <canvas>
 * PRMS:
 *      - width in tiles       (w)
 *      - height in tiles      (h)
 *      - tile-width in px     (tw)
 *      - wall-width in px     (ww)
 *      - tile-color as string (tc)
 *      - wall-color as string (wc)
 *      - target canvas        (t)
 * 
 * RTRN:
 *      - target canvas element
 * 
 * NOTE: The maximum allowed maze size will be limited by your browser's
 *      maximum recursion depth.
 **********************************************************************/
function a_maze_ing(w, h, tw, ww, tc, wc, t) {
    'use strict';
    
    const
	DEF_W      = 16,        /* tiles  */
	DEF_H      = 16,        /* tiles  */
	DEF_TW     = 16,        /* pixels */
	DEF_WW     = 1,         /* pixels */
	W_N        = (1 << 0),
	W_E        = (1 << 1),
	W_S        = (1 << 2),
	W_W        = (1 << 3),
	maze_w = w  || DEF_W, 
	maze_h = h  || DEF_H, 
	tile_w = tw || DEF_TW, 
	wall_w = ww || DEF_WW, 
	target = t  || document.createElement('canvas'),
	ctx    = target.getContext('2d'),
	maze   = new Int8Array(maze_w * maze_h);
        
    /* set canvas/ctx styles */
    target.width                 = maze_w * tile_w + (maze_w + 1) * wall_w;
    target.height                = maze_h * tile_w + (maze_h + 1) * wall_w;
    target.style.backgroundColor = (tc || '#FFF');
    ctx.strokeStyle              = (wc || '#000');
    ctx.lineWidth                = wall_w;
    
    /* generate maze grid through randomized recursive depth-first search */
    (function gen_maze_dfs(idx) {
        let dirs = new Int8Array(4), next;
        dirs[0] = 0; dirs[1] = 1;
        dirs[2] = 2; dirs[3] = 3;
        
        /* fisher-yates suffle */
        for(let i = 3, j, temp; i > 0; --i) {
            j = (Math.random() * (i + 1)) | 0;
            temp    = dirs[i];
            dirs[i] = dirs[j];
            dirs[j] = temp;
        }
        
        /* visit neighbors, if unvisited => knock walls and recurse */
        for(let i = 0; i < 4; ++i) {
            switch(dirs[i]) {
            
            /* NORTH */
            case 0:
                if((idx >= maze_w) && maze[(next = idx - maze_w)] === 0) {
                    maze[idx]  |= W_N;
                    maze[next] |= W_S;
                    gen_maze_dfs(next);
                }
                break;
                
            /* EAST */
            case 1:
                if((idx % maze_w) != (maze_w - 1) && maze[(next = idx + 1)] === 0) {
                    maze[idx]  |= W_E;
                    maze[next] |= W_W;
                    gen_maze_dfs(next);
                }
                break;
            
            /* SOUTH */
            case 2:
                if((idx < (maze_w * maze_h - maze_w)) && maze[(next = idx + maze_w)] === 0) {
                    maze[idx]  |= W_S;
                    maze[next] |= W_N;
                    gen_maze_dfs(next);
                }
                break;
                
            /* WEST */
            case 3:
                if((idx % maze_w) && maze[(next = idx - 1)] === 0) {
                    maze[idx]  |= W_W;
                    maze[next] |= W_E;
                    gen_maze_dfs(next);
                }
                break;
            }
        }
    })((Math.random() * maze_w * maze_h) | 0);
    
    /* render the maze to the target */
    (function draw_maze() {
        let cnvs_ln_offset = wall_w / 2;
        
        /* draw top and left borders */
        ctx.moveTo(target.width, cnvs_ln_offset);
        ctx.lineTo(0, cnvs_ln_offset);
        ctx.moveTo(cnvs_ln_offset, 0);
        ctx.lineTo(cnvs_ln_offset, target.height);
        
        /* maze body */
        for(let i = 0; i < maze.length; ++i) {
            let x_offset =  (i % maze_w)      * (tile_w + wall_w) + wall_w * 1.5,
                y_offset = ((i / maze_w) | 0) * (tile_w + wall_w) + wall_w * 1.5;

            /* draw east wall */
            if((maze[i] & W_E) === 0) {
                ctx.moveTo(x_offset + tile_w, y_offset - cnvs_ln_offset - wall_w);
                ctx.lineTo(x_offset + tile_w, y_offset - cnvs_ln_offset + tile_w + wall_w);
            }
            
            /* draw south wall */
            if((maze[i] & W_S) === 0) {
                ctx.moveTo(x_offset - cnvs_ln_offset - wall_w, y_offset + tile_w);
                ctx.lineTo(x_offset - cnvs_ln_offset + tile_w + wall_w, y_offset + tile_w);
            }
        }
        
        /* stroke paths */
        ctx.stroke();
    })();
    
    return target;
}
