namespace WrestlingPredictions.Server.DTOs
{
    public class EventDto
    {
        public Guid EventId { get; set; }
        public string Name { get; set; }

        public List<MatchWithPredictionDto> Matches { get; set; }
    }
}
