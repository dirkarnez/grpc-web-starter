const chokidar = require('chokidar');
const { exec } = require('child_process');
const path = require("path");

const buttonPressesLogFile = '../proto/chatroom.proto';

console.log(`Watching for file changes on ${buttonPressesLogFile}`);

chokidar.watch(buttonPressesLogFile).on('all', (event, path) => {
   console.log(event, path);
   rebuild();
});

function rebuild() {
   exec(`protoc --proto_path=proto chatroom.proto --js_out=import_style=commonjs:client/pb --grpc-web_out=import_style=commonjs+dts,mode=grpcwebtext:client/pb`, 
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
        console.error(`[JS] recompiled!`);
      }
    });

    exec("protoc --proto_path=proto --go_out=plugins=grpc:server/src/pb chatroom.proto", 
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
         console.error(`[GO] recompiled!`);
       }
     });
}