namespace WrestlingPredictions.Server.DTOs
{
    public class EventDto
    {
        public Guid EventId { get; set; }
        public string Name { get; set; }

        public List<MatchWithPredictionDto> Matches { get; set; }
    }


    public class MatchWithPredictionDto
    {
        public Guid MatchId { get; set; }
        public List<TeamDto> Teams { get; set; }
        public Guid? UserPredictionTeamId { get; set; }
    }
}
