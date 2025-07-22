// src/features/flights/useFlights.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Flight } from "./types";
import { API_BASE_URL } from "../../config";

const fetchFlights = async (): Promise<Flight[]> => {
  const response = await fetch(`${API_BASE_URL}/flights`);
  if (!response.ok) throw new Error("Failed to fetch flights");
  return await response.json();
};

const addFlight = async (flight: Omit<Flight, "id">): Promise<Flight> => {
  const response = await fetch(`${API_BASE_URL}/flights`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(flight),
  });
  if (!response.ok) throw new Error("Failed to add flight");
  return await response.json();
};

const deleteFlight = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/flights/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete flight");
};

export const useFlights = () => {
  return useQuery<Flight[]>({
    queryKey: ["flights"],
    queryFn: fetchFlights,
  });
};

export const useSearchFlights = (status?: string, destination?: string) => {
  return useQuery<Flight[]>({
    queryKey: ["flights", "search", { status, destination }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (destination) params.append("destination", destination);

      const response = await fetch(`${API_BASE_URL}/flights/search?${params}`);
      if (!response.ok) throw new Error("Failed to search flights");
      return await response.json();
    },
  });
};

export const useAddFlight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addFlight,
    onSuccess: (newFlight) => {
      queryClient.setQueryData<Flight[]>(["flights"], (old = []) => [
        ...old,
        newFlight,
      ]);
    },
  });
};

export const useDeleteFlight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFlight,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Flight[]>(["flights"], (old = []) =>
        old.filter((f) => f.id !== id)
      );
    },
  });
};
