package main

import (
	"context"
	"fmt"
	"github.com/dirkarnez/grpc-web-starter/server/pb"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
	"log"
	"net"
	"errors"
)

const (
	port = ":9090"
)

type ChatMessage struct {
	sender string
	message string
}

type server struct{}

var (
	messages map[string]chan ChatMessage
)

func init() {
	messages = make(map[string]chan ChatMessage)
}

func getUserMessageQueue(name string) (chan ChatMessage, bool) {
	ch, ok := messages[name]
	if !ok {
		messages[name] = make(chan ChatMessage)
		ch, ok = messages[name]
	}
	return ch, ok
}

func (s *server) SignIn(in *pb.SignInRequest, stream pb.ChatRoom_SignInServer) error {
	fmt.Println(in.Name, "SignIn")
	ch, ok := getUserMessageQueue(in.Name)
	if !ok {
		return errors.New("ERROR")
	}
	for {
		select {
		case msg := <-ch:
			fmt.Println(in.Name, "received message", msg)
			if err := stream.Send(&pb.IncomingMessageStream{From: msg.sender, Message: msg.message}); err != nil {
				return err
			}
		default:
		}
	}
	return nil
}

func (s *server) SendMessage(ctx context.Context, in *pb.SendMessageRequest) (*pb.SendMessageReply, error) {
	fmt.Println(in.Name, "SendMessage", in.Message)
	for _, value := range messages {
		value <- ChatMessage{sender: in.Name, message: in.Message}
  	}
	return &pb.SendMessageReply{Success: true}, nil
}

func (s *server) Leave(ctx context.Context, in *pb.LeaveRequest) (*pb.LeaveReply, error) {
	fmt.Println(in.Name, "Leave")
	delete(messages, in.Name)
	return &pb.LeaveReply{Success: true}, nil
}

func main() {
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterChatRoomServer(s, &server{})
	// Register reflection service on gRPC server.
	reflection.Register(s)
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}