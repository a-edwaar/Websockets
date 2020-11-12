import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return(
    <div id="Home">
      <h1>Home Page</h1>
      <p>Web sockets tutorial starts here.</p>
      <Link to="/chat">Join chat room</Link>
    </div>
  )
}
