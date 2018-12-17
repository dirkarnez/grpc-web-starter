const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
   mode: "development",
   devtool: "inline-source-map",
   entry: "./client.ts",
   output: {
     filename: "bundle.js"
   },
   resolve: {
     // Add `.ts` and `.tsx` as a resolvable extension.
     extensions: [".ts", ".tsx", ".js"]
   },
   module: {
     rules: [
       // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
       { 
        test: /\.tsx?$/, 
        loaders: ['babel-loader', 'ts-loader'],  
        exclude: /(node_modules|bower_components)/ 
      }
     ]
   },
    plugins: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 5,
        },
      })
    ]


    // optimization: {
    //   minimizer: [
    //     new TerserPlugin({
    //       // Uncomment lines below for cache invalidation correctly
    //       // cache: true,
    //       // cacheKeys(defaultCacheKeys) {
    //       //   delete defaultCacheKeys.terser;
    //       //
    //       //   return Object.assign(
    //       //     {},
    //       //     defaultCacheKeys,
    //       //     { 'uglify-js': require('uglify-js/package.json').version },
    //       //   );
    //       // },
    //       minify(file, sourceMap) {
    //         // https://github.com/mishoo/UglifyJS2#minify-options
    //         const uglifyJsOptions = {
    //           /* your `uglify-js` package options */
    //         };
        
    //         if (sourceMap) {
    //           uglifyJsOptions.sourceMap = {
    //             content: sourceMap,
    //           };
    //         }
        
    //         return require('uglify-js').minify(file, uglifyJsOptions);
    //       },
    //     })
    //   ]
    // }
 };