import { Flight } from './models';

export const mockFlights: Flight[] = [
  { flightNumber: 'AB123', destination: 'New York', gate: 'A1', status: 'On Time' },
  { flightNumber: 'CD456', destination: 'London', gate: 'B2', status: 'Delayed' },
  { flightNumber: 'EF789', destination: 'Tokyo', gate: 'C3', status: 'Boarding' },
  { flightNumber: 'GH012', destination: 'Paris', gate: 'D4', status: 'Departed' },
  { flightNumber: 'IJ345', destination: 'Sydney', gate: 'E5', status: 'Cancelled' },
  { flightNumber: 'KL678', destination: 'Dubai', gate: 'F6', status: 'On Time' },
  { flightNumber: 'MN901', destination: 'Singapore', gate: 'G7', status: 'Delayed' },
  { flightNumber: 'OP234', destination: 'Hong Kong', gate: 'H8', status: 'Boarding' },
  { flightNumber: 'QR567', destination: 'Los Angeles', gate: 'I9', status: 'Departed' },
  { flightNumber: 'ST890', destination: 'Frankfurt', gate: 'J10', status: 'On Time' },
]; 