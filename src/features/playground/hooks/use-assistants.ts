import { useQuery } from "@tanstack/react-query";
import { getAssistants } from "../services/assistant-service";
import { Assistant } from "../types/assistant";

export function useAssistants() {
  return useQuery<Assistant[]>({
    queryKey: ["assistants"],
    queryFn: getAssistants,
  });
}