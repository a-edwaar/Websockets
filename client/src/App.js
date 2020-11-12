import './App.css';
import  {BrowserRouter, Route} from 'react-router-dom';
import Home from "./pages/home"
import Chat from './pages/chat';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Route path="/" exact component={Home}/>
        <Route path="/chat" component={Chat}/>
      </div>
    </BrowserRouter>
  );
}

export default App;
