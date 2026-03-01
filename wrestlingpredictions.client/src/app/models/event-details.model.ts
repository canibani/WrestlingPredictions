import { get } from "http";
import { Team } from "./team/team.model";

export interface EventDetails {
  id: string;
  name: string;
  matches: MatchesWithPredictions[];
}

export interface MatchesWithPredictions {
  matchId: string;
  teams: Team[];
  userPredictionTeamId: string;
}
