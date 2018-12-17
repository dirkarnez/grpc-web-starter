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

type server struct{}

var (
	messages map[string]chan string
)

func init() {
	messages = make(map[string]chan string)
}

func getUserMessageQueue(name string) (chan string, bool) {
	ch, ok := messages[name]
	if !ok {
		messages[name] = make(chan string)
		ch, ok = messages[name]
	}
	return ch, ok
}

func (s *server) SignIn(in *pb.SignInRequest, stream pb.ChatRoom_SignInServer) error {
	fmt.Println("SignIn")
	ch, ok := getUserMessageQueue(in.Name)
	if !ok {
		return errors.New("ERROR")
	}
	for {
		select {
		case msg := <-ch:
			fmt.Println(in.Name, "received message", msg)
			if err := stream.Send(&pb.IncomingMessageStream{Message: msg}); err != nil {
				return err
			}
		default:
		}
	}
	return nil
}

func (s *server) SendMessage(ctx context.Context, in *pb.SendMessageRequest) (*pb.SendMessageReply, error) {
	fmt.Println("SendMessage")
	for _, value := range messages {
		value <- in.Message
  	}
	return &pb.SendMessageReply{Success: true}, nil
}

func (s *server) Leave(ctx context.Context, in *pb.LeaveRequest) (*pb.LeaveReply, error) {
	fmt.Println("Leave")
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