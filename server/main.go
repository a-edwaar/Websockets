package main

import (
	"log"
	"net/http"

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

var clients = make(map[*websocket.Conn]bool) // To keep track of all open websockets
var broadcast = make(chan Event)             // Event queue

func main() {
	http.HandleFunc("/chat", chatSocket)
	go handleBroadcast()
	log.Fatal(http.ListenAndServe(":8080", nil))
}

// Takes events from the queue and gives to all open websockets
func handleBroadcast() {
	for {
		event := <-broadcast
		for client := range clients {
			err := client.WriteJSON(event)
			if err != nil {
				log.Printf("Closing connection for client as received: %s", err.Error())
				client.Close()
				delete(clients, client)
			}
		}
	}
}

func chatSocket(w http.ResponseWriter, r *http.Request) {
	// upgrade connection to websocket
	upgrader.CheckOrigin = func(r *http.Request) bool { return true } // allow any connections for now
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	defer conn.Close()
	// add conn to map of open websockets
	clients[conn] = true
	// continously read new events
	received := Event{}
	for {
		err := conn.ReadJSON(&received)
		if err != nil {
			log.Println(err)
			return
		}
		// add event to queue
		broadcast <- received
	}
}
