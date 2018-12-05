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
   exec(`protoc --proto_path=server helloworld.proto --js_out=import_style=commonjs:client --grpc-web_out=import_style=commonjs,mode=grpcwebtext:client`, 
   { 
      env: {
         ...process.env, 
         Path: "C:\\protoc-3.6.1-win32\\bin"
      },
      cwd: ".."
   }, 
   (err, stdout, stderr) => {
      if (err) {
         console.error(`!!!! ${err}`);
      } else {
        console.error(`!!!! recompile`);
      }
    });
}