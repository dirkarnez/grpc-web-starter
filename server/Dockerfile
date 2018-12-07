FROM golang

RUN go get -u github.com/dirkarnez/again

COPY ./src /go/src/github.com/dirkarnez/grpc-web-starter/server
WORKDIR /go/src/github.com/dirkarnez/grpc-web-starter/server
VOLUME ["/go/src/github.com/dirkarnez/grpc-web-starter/server"]

RUN curl https://raw.githubusercontent.com/golang/dep/master/install.sh | sh

RUN dep ensure && go build

CMD again --bin=main run
EXPOSE 9090