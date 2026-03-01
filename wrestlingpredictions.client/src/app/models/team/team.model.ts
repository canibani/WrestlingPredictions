import { Participant } from "../participant/participant.model";

export interface Team {
  id: string;
  teamName?: string;
  participants: string[];
}
