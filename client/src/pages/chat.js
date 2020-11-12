import React, { useEffect, useRef, useState } from "react";

export default function Chat(){
  const [events, setEvents] = useState([]);
  const [count, setCount] =  useState(0);
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

  const onClick = () => {
    const currentTime = new Date()
    const newMsg = {
      sender:  "Archie",
      message: "Message "+count,
      time: currentTime.toTimeString(),
    };
    ws.current.send(JSON.stringify(newMsg));
    setEvents(events.concat(newMsg))
    setCount(count+1);
  }

  return(
    <div id="chat">
      <h1>Chat room</h1>
      <p>Web socket time</p>
      <div id="chat-window">
        <ul>
          {events.map(event=> (
            <li key={event.time}>{event.sender} @ {event.time}: {event.message}</li>
          ))}
        </ul>
      </div>
      <button onClick={onClick}>Add Message!</button>
    </div>
  )
}