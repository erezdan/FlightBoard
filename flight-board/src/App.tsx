import { useEffect } from 'react';
import { initializeSignalRConnection } from './services/signalR';
import Home from './pages/Home';
import './App.css';

function App() {
  
  useEffect(() => {
    initializeSignalRConnection();
  }, []);

  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;
