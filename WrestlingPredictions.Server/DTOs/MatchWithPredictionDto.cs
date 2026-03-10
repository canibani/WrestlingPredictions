namespace WrestlingPredictions.Server.DTOs
{
    public class MatchWithPredictionDto
    {
        public Guid MatchId { get; set; }
        public List<TeamDto> Teams { get; set; }
        public Guid? UserPredictionTeamId { get; set; }
    }
}
