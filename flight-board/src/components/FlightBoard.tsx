import React from 'react';
import { mockFlights } from '../data/mockFlights';
import FlightRow from './FlightRow';
import './FlightBoard.css';

// test 2

const FlightBoard: React.FC = () => {
  return (
    <div className="flight-board">
      <h1>Flight Information</h1>
      <table>
        <thead>
          <tr>
            <th>Flight</th>
            <th>Destination</th>
            <th>Gate</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {mockFlights.map(flight => (
            <FlightRow key={flight.flightNumber} flight={flight} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FlightBoard; 