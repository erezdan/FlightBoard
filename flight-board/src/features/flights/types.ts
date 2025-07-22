export interface Flight {
  id: number;
  flightNumber: string;
  destination: string;
  departureTime: string;
  gate: string;
  status: "scheduled" | "boarding" | "departed" | "delayed" | "cancelled";
}