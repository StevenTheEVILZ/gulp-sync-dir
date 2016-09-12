# gulp-sync-dir

This gulp plugin deletes files from a directory (output folder) if a corresponding file doesn't exist in another directory (src folder) with support for modifying extensions.

## Usage

    gulp.task('unused', function() {
        syncronize({
            src: 'src', //Source folder
            target: 'final', //Output folder
            extensions: {
                'map': '', //Corresponds .map files to the .js or .css files; removes .map extension when checking
                'js': 'coffee', // /Corresponds .js files to the .coffee files; changes .js extension when checking
                'jpg': 'png',
            }
            exclude: ['main.css', 'main.css.map'] //Excludes ANY file named main.css or main.css.map
        });
    });

# Results

*   output
    *   assets
        *   img1.jpg
        *   img2.jpg
        *   img3.jpg
    *   css
        *   main.css
        *   main.css.map
        *   n.css
        *   n.css.map
    *   js
        *   a.js
        *   a.js.map
        *   b.js
        *   b.js.map
        *   d.js
        *   d.js.map
        *   f
            *   c.js
            *   c.js.map
    *   index.html
*   src
    *   assets
        *   img1.png
        *   img2.png
    *   css
        *   a.scss
        *   b.scss
    *   js
        *   a.coffee
        *   b.coffee
        *   f
            *   c.coffee
    *   index.html

'img3.jpg' gets deleted because there is no corresponding file in src folder  
'n.css' and 'n.css.map' both get deleted because there is no corresponding file in src folder  
'd.js' and 'd.js.map' both get deleted because there is no corresponding file in src folder  

'a.js', 'b.js', and 'c.js' both do NOT get deleted because .js is replaced with .coffee when checking and a corresponding file is found  
'a.js.map', 'b.js.map', and 'c.js.map' both do NOT get deleted because .js is replaced with .coffee and .map is removed when checking and a corresponding file is found  
'main.css' and 'main.css.map' are NOT deleted because they are in the excluded list  
'img1.jpg' and 'img2.jpg' both do NOT get deleted because .jpg is replaced with .png when checking and a corresponding file is found  

*   output
    *   assets
        *   img1.jpg
        *   img2.jpg
    *   css
        *   main.css
        *   main.css.map
    *   js
        *   a.js
        *   a.js.map
        *   b.js
        *   b.js.map
        *   f
            *   c.js
            *   c.js.map
    *   index.html
*   src: unchanged

## Special cases

'a' maps to 'c' only if 'a': 'b' comes before 'b': 'c'

    gulp.task('unused', function() {
        syncronize({
            src: 'src', //Source folder
            target: 'final', //Output folder
            extensions: {
                'a': 'b',
                'b': 'c'
            }
        });
    });

Works!

    gulp.task('unused', function() {
        syncronize({
            src: 'src', //Source folder
            target: 'final', //Output folder
            extensions: {
                'css.map': 'scss'
            }
        });
    });
