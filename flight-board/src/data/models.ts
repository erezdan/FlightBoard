export interface Flight {
  flightNumber: string;
  destination: string;
  gate: string;
  status: 'On Time' | 'Delayed' | 'Boarding' | 'Departed' | 'Cancelled';
} 