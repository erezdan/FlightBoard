// src/services/signalR.ts
import { HubConnectionBuilder, HubConnection, LogLevel } from "@microsoft/signalr";
import { queryClient } from "../app/queryClient";
import { Flight } from "../features/flights/types";

// Singleton connection instance
let connection: HubConnection | null = null;

// Start connection and subscribe to events
export const initializeSignalRConnection = async () => {
  if (connection) return; // Prevent duplicate connections

  connection = new HubConnectionBuilder()
    .withUrl("http://localhost:5106/flightHub")
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

  connection.on("FlightAdded", (newFlight: Flight) => {
    queryClient.setQueryData<Flight[]>(["flights"], (old = []) => [...old, newFlight]);
  });

  connection.on("FlightDeleted", (id: number) => {
    queryClient.setQueryData<Flight[]>(["flights"], (old = []) => old.filter(f => f.id !== id));
  });

  connection.on("FlightStatusUpdate", (updatedFlight: Flight) => {
    queryClient.setQueryData<Flight[]>(["flights"], (old = []) =>
      old.map(f => f.id === updatedFlight.id ? updatedFlight : f)
    );
  });

  try {
    await connection.start();
    console.log("SignalR connection established.");
  } catch (err) {
    console.error("SignalR connection failed:", err);
  }
};
