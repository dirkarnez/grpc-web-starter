import { SignInRequest, SendMessageRequest, LeaveRequest, IncomingMessageStream } from "./pb/chatroom_pb"
import { ChatRoomPromiseClient } from "./pb/chatroom_grpc_web_pb";
import * as grpcWeb from 'grpc-web';


var client = new ChatRoomPromiseClient(`http://${window.location.hostname}:8080`, null, null);
var stream: grpcWeb.ClientReadableStream<IncomingMessageStream>;
var userNameLogined = "";

function display(id: string, enabled: boolean) {
      document.getElementById(id).style.display = enabled ? "block" : "none";
}

function login() {
      display("login", true);
      display("chatroom", false);
}

function enterChatroom() {
      display("login", false);
      display("chatroom", true);
}

function logout() {
      stream.cancel();
      var leaveRequest = new LeaveRequest();
      leaveRequest.setName(userNameLogined);
      client.leave(leaveRequest, {})
}

login();

var btnSignIn = document.getElementById("btnSignIn");
var messages = document.getElementById("messages");

btnSignIn.onclick = function() {
      var signInRequest = new SignInRequest();
      userNameLogined =  (<HTMLInputElement>document.getElementById("inputUserName")).value;
      signInRequest.setName(userNameLogined);
      
      stream = client
      .signIn(signInRequest, {})
      .on("data", response => {
            var p = document.createElement("p");
            p.innerHTML = `${response.getFrom()}: ${response.getMessage()}`;
            messages.appendChild(p);
      })
      .on('end', function() {
            userNameLogined = "";
            messages.innerHTML = "";
            login();
      });
      enterChatroom();
};



var inputMessageToSend = <HTMLInputElement>document.getElementById("inputMessageToSend");
var btnSendMessage = document.getElementById("btnSendMessage");
var btnSignOut = document.getElementById("btnSignOut");

btnSendMessage.onclick = function () {
      var sendMessageRequest = new SendMessageRequest();
      sendMessageRequest.setName(userNameLogined);
      sendMessageRequest.setMessage(inputMessageToSend.value);
      client.sendMessage(sendMessageRequest, {})
            //.then(response => button.innerText = response.getMessage())
            //.catch(err => button.innerText = err);
};

btnSignOut.onclick = logout;