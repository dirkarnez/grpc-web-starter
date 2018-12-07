package main

import (
	"context"
	"github.com/dirkarnez/grpc-web-starter/server/pb"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
	"log"
	"net"
	"time"
)

const (
	port = ":9090"
)

type server struct{}

func (s *server) SayHello(ctx context.Context, in *pb.HelloRequest) (*pb.HelloReply, error) {
	return &pb.HelloReply{Message: "Hello: " + in.Name}, nil
}

func (s *server)  SayRepeatHello(in *pb.RepeatHelloRequest, stream pb.Greeter_SayRepeatHelloServer) error {
	for i := 0; i < int(in.Count); i++ {
		if err := stream.Send(&pb.HelloReply{Message: "RepeatHello: " + in.Name}); err != nil {
			return err
		}
	}

	return nil
}

func (s *server) SayHelloAfterDelay(ctx context.Context, in *pb.HelloRequest) (*pb.HelloReply, error) {
	time.Sleep(1 * time.Second)
	return &pb.HelloReply{Message: "HelloAfterDelay: " + in.Name}, nil
}

func main() {
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterGreeterServer(s, &server{})
	// Register reflection service on gRPC server.
	reflection.Register(s)
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}