import { Team } from "../team/team.model";

export interface MatchDto {
  id: string;
  teams: Team[];
}
