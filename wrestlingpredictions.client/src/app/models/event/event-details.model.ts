import { MatchesWithPredictions } from "./match-with-predictions";

export interface EventDetails {
  id: string;
  name: string;
  matches: MatchesWithPredictions[];
}

