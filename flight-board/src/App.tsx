import { useEffect } from 'react';
import { initializeSignalRConnection } from './services/signalR';
import FlightBoardPage from './pages/FlightBoardPage';
import './App.css';

function App() {
  
  useEffect(() => {
    initializeSignalRConnection();
  }, []);

  return (
    <div className="App">
      <FlightBoardPage />
    </div>
  );
}

export default App;
