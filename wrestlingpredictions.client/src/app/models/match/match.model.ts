import { get } from "http";
import { Team } from "../team/team.model";

export interface Match {
  id: string;
  teams: Team[];
}
