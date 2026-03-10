import { Team } from "../team/team.model";


export interface MatchesWithPredictions {
    matchId: string;
    teams: Team[];
    userPredictionTeamId: string;
}
