// src/features/flights/useFlights.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Flight } from "./types";

const fetchFlights = async (): Promise<Flight[]> => {
  const response = await fetch("/api/flights");
  if (!response.ok) throw new Error("Failed to fetch flights");
  return await response.json();
};

const addFlight = async (flight: Omit<Flight, "id">): Promise<Flight> => {
  const response = await fetch("/api/flights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(flight),
  });
  if (!response.ok) throw new Error("Failed to add flight");
  return await response.json();
};

const deleteFlight = async (id: number): Promise<void> => {
  const response = await fetch(`/api/flights/${id}`, {
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
