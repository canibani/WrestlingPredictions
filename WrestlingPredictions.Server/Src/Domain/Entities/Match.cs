namespace WrestlingPredictions.Server.Src.Domain.Entities
{
    public class Match
    {
        public Guid Id { get; set; }

        public List<Team> Teams { get; set; } = [];
    }
}
