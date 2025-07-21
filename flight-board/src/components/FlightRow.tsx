import React from 'react';
import { Flight } from '../data/models';

interface FlightRowProps {
  flight: Flight;
}

const FlightRow: React.FC<FlightRowProps> = ({ flight }) => {
  return (
    <tr>
      <td>{flight.flightNumber}</td>
      <td>{flight.destination}</td>
      <td>{flight.gate}</td>
      <td>{flight.status}</td>
    </tr>
  );
};

export default FlightRow; 