![webOS.js](http://webos-devrel.github.io/webOS.js/logo.png)


A javascript webOS support library that can be used on its own, outside of Enyo or Cordova providing core APIs to services and native functionality.

For full API details and specifications, please see http://webos-devrel.github.io/webOS.js/


Getting Started
--------
The build process for webOS.js involves using gulp.  If you don't have gulp already installed globally on your system, do so via:

    npm install -g gulp
  
Also be sure to install webOS.js's local node modules:

    npm install .

Then to build, it's simple a matter of running:

    gulp build

That will take the source code within ./src and bundle it all up in a minified single webOS.js file ready for use.  The `build` command also supports a `--debug` flag which will omitt the minification part, to allow for easy debugging.

Other supported commands include `clean`, `docs`, and `docs-clean`.  For example, to generate the full documentation for webOS.js, you'd just need to run:

    gulp docs

The documentaion will by default be generated to ./docs, and the main file to open is ./docs/webOS.html.  For your convenience all documentation is already provided for you [here](http://webos-devrel.github.io/webOS.js/).
