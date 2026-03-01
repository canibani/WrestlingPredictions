import { Match } from "../match/match.model";

export interface Event {
  id: string;
  name: string | undefined;
  promotion?: string | undefined;
  matches: Match[];
}
