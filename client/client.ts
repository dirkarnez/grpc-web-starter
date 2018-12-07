import { HelloRequest, RepeatHelloRequest } from "./pb/helloworld_pb";
import { GreeterPromiseClient } from "./pb/helloworld_grpc_web_pb";

var client = new GreeterPromiseClient('http://' + window.location.hostname + ':8080', null, null);

var helloRequest = new HelloRequest();
helloRequest.setName("HelloRequest");

client.sayHello(helloRequest, {})
      .then(response => console.log(response.getMessage()))
      .catch(err => console.log(err));
      
var repeatHelloRequest = new RepeatHelloRequest();
repeatHelloRequest.setName("RepeatHelloRequest");
repeatHelloRequest.setCount(10);

client.sayRepeatHello(repeatHelloRequest, {}).on("data", response => {
      console.log(response.getMessage());
});

var deadline = new Date();
deadline.setSeconds(deadline.getSeconds() + 1);

var helloAfterDelayRequest = new HelloRequest();
helloAfterDelayRequest.setName("HelloAfterDelayRequest");

client.sayHelloAfterDelay(helloAfterDelayRequest, { deadline: deadline.getTime().toString() })
      .then(response => console.log(response.getMessage()))
      .catch(err => console.log(err));