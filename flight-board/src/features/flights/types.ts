export interface Flight {
  id: number;
  flight_number: string;
  destination: string;
  departure_time: string;
  gate: string;
  status: "scheduled" | "boarding" | "departed" | "delayed" | "cancelled";
}