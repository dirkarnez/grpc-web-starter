## grpc-web-starter

### Preparation
* `protoc.exe` and `protoc-gen-grpc-web.exe` in `PATH`
* Any static web server for `client`

### Getting started
* Run `run-server.cmd`
* Open `client` as like a normal Node.js project
* Start static web server on `dist`
* Back to the `client`, execute `npm install`
* For every build, execute `npm run-script build`, make sure XXXX_pb.js files are ready beforehand

### Generation of protobuf code
* Execute `npm run-script protoc` in `client`

### TODO
- [ ] https://github.com/SafetyCulture/grpc-web-devtools
