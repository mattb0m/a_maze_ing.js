LICENSE: All files are in the public domain.

FUNC: a_maze_ing.js
AUTH: mattb0m
DATE: 2016/06/08

DESC: Generate a maze pattern on a new or existing <canvas> element.
    All function arguments are optional and have default values.
    If no existing canvas element is passed to a_maze_ing, a new canvas 
    element is created.

PRMS:
    - width in tiles       (w)
    - height in tiles      (h)
    - tile-width in px     (tw)
    - wall-width in px     (ww)
    - tile-color as string (tc)
    - wall-color as string (wc)
    - target canvas        (t)
  
RTRN:
    - target canvas element
  
NOTE: ECMAScript 6 features:
    - typed arrays
    - let
    - const
  
NOTE: ECMAScript 5 features:
    - strict mode
 
NOTE: HTML5 features:
    - canvas
  
NOTE: The maximum allowed maze size will be limited by your browser's
    maximum recursion depth.
