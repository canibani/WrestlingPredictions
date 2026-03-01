namespace WrestlingPredictions.Server.Src.Domain.Entities
{
    public class Team
    {
        public Guid Id { get; set; }
        public string? TeamName { get; set; }
        public List<Participant> Participants { get; set; } = [];
    }
}