import React, { useEffect, useRef, useState } from "react";

export default function Chat(){
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState("");
  const ws = useRef(null); // Instance variable - doesn't cause re-render

  useEffect(()=>{
    ws.current = new WebSocket('ws://localhost:8080/chat');
    ws.current.onopen = () => {
      console.log("connected");
    }
    ws.current.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      /*
      Using functional update form of setState
      It tells us how the state should change 
      This way it doesn't refrence the current state which would always be an empty []
      Also means we don't need to add it to the dependencies of useEffect.
      Therefore it doesn't refresh every time events changes so we don't keep creating a new websocket.
      */
      setEvents(m => m.concat(data));
    }
    ws.current.onclose = () => {
      console.log("disconnected");
    }
    return () => ws.current.close(); // Cleanup function called when component unmounts 
  }, [])

  const sendMessage = (event) => {
    event.preventDefault();
    const currentTime = new Date()
    const newMsg = {
      sender:  "Archie",
      message: message,
      time: currentTime.getTime().toString(),
    };
    ws.current.send(JSON.stringify(newMsg));
    setMessage("");
  }

  const composingHandler = (event) => {
    setMessage(event.target.value)
  }

  return(
    <div id="chat">
      <h1>Chat room</h1>
      <div id="chat-window">
        <ul>
          {events.map(event=> (
            <li key={event.time}>{event.sender} @ {event.time}: {event.message}</li>
          ))}
        </ul>
      </div>
      <form onSubmit={sendMessage}>
        <input type="text" id="new-message" onChange={composingHandler} value={message}/>
        <button type="submit">Send</button>
      </form>
    </div>
  )
}