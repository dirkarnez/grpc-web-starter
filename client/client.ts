import { SignInRequest, SendMessageRequest } from "./pb/chatroom_pb"
import { ChatRoomPromiseClient } from "./pb/chatroom_grpc_web_pb";

var client = new ChatRoomPromiseClient(`http://${window.location.hostname}:8080`, null, null);

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
      userNameLogined = "";
      login();
}

login();

var btnSignIn = document.getElementById("btnSignIn");
var messages = document.getElementById("messages");

btnSignIn.onclick = function() {
      var signInRequest = new SignInRequest();

      var inputtedUserName = (<HTMLInputElement>document.getElementById("inputUserName")).value;
      signInRequest.setName(inputtedUserName);

      client
      .signIn(signInRequest, {})
      .on("data", response => {
            userNameLogined = inputtedUserName;
            var p = document.createElement("p");
            p.innerHTML = `${response.getFrom()}: ${response.getMessage()}`;
            messages.appendChild(p);
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