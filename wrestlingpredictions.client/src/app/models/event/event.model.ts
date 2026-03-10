import { MatchDto } from "../match/match.model";

export interface PredictionEvent {
  id: string;
  name: string | undefined;
  promotion?: string | undefined;
  matches: MatchDto[];
}
