package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type Event struct {
	Sender  string `json:"sender"`
	Message string `json:"message"`
	Time    string `json:"time"`
}

func main() {
	http.HandleFunc("/chat", chatSocket)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func chatSocket(w http.ResponseWriter, r *http.Request) {
	// upgrade connection to websocket
	upgrader.CheckOrigin = func(r *http.Request) bool { return true } // allow any connections for now
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	// continously read and reply
	received := &Event{}
	var msg Event
	for {
		err := conn.ReadJSON(received)
		if err != nil {
			log.Println(err)
			return
		}
		msg = Event{
			Sender:  "server",
			Message: fmt.Sprintf("hello %s", received.Sender),
			Time:    time.Now().String(),
		}
		if err := conn.WriteJSON(msg); err != nil {
			log.Println(err)
			return
		}
	}
}
