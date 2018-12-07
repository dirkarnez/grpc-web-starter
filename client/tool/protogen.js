const chokidar = require('chokidar');
const { exec } = require('child_process');
const path = require("path");

const buttonPressesLogFile = '../server/helloworld.proto';

console.log(`Watching for file changes on ${buttonPressesLogFile}`);

chokidar.watch(buttonPressesLogFile).on('all', (event, path) => {
   console.log(event, path);
   rebuild();
});

function rebuild() {
   exec(`protoc --proto_path=server helloworld.proto --js_out=import_style=commonjs:client/proto --grpc-web_out=import_style=commonjs+dts,mode=grpcwebtext:client/proto`, 
   { 
      env: {
         ...process.env, 
         Path: "C:\\protoc-3.6.1-win32\\bin"
      },
      cwd: ".."
   }, 
   (err, stdout, stderr) => {
      if (err) {
         console.error(`[JS] ${err}`);
      } else {
        console.error(`[JS] recompile`);
      }
    });

    exec("protoc --proto_path=server --go_out=server helloworld.proto", 
    { 
       env: {
          ...process.env, 
          Path: "C:\\protoc-3.6.1-win32\\bin;C:\\Users\\Alex Chan\\go\\bin"
       },
       cwd: ".."
    }, 
    (err, stdout, stderr) => {
       if (err) {
          console.error(`[GO] ${err}`);
       } else {
         console.error(`[GO] recompile`);
       }
     });
}