import { CreateTeamDto } from "./create-team-dto.model";

export interface CreateMatchDto {
  teams: CreateTeamDto[];
}
