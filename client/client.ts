// const {HelloRequest, RepeatHelloRequest, HelloReply } = require('./helloworld_pb.js');
// const {GreeterClient} = require('./helloworld_grpc_web_pb.js');

// var client = new GreeterClient('http://' + window.location.hostname + ':8080', null, null);

// // simple unary call
// var request = new HelloRequest();
// request.setName('World');

// client.sayHello(request, {}, (err, response) => {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log(response.getMessage());
// });


// // server streaming call
// var streamRequest = new RepeatHelloRequest();
// streamRequest.setName('World');
// streamRequest.setCount(5);

// var stream = client.sayRepeatHello(streamRequest, {});
// stream.on('data', (response) => {
//   console.log(response.getMessage());
// });
  

// // deadline exceeded
// var deadline = new Date();
// deadline.setSeconds(deadline.getSeconds() + 1);

// client.sayHelloAfterDelay(request, {deadline: deadline.getTime()},
//   (err, response) => {
//     console.log('Got error, code = ' + err.code +
//                 ', message = ' + err.message);
//   });

import { HelloRequest } from "./proto/helloworld_pb";
import { GreeterPromiseClient } from "./proto/helloworld_grpc_web_pb";

var client = new GreeterPromiseClient('http://' + window.location.hostname + ':8080', null, null);

var request = new HelloRequest();
request.setName('World');

client.sayHello(request, {})
      .then(response => console.log(response.getMessage()))
      .catch(err => console.log(err));