namespace WrestlingPredictions.Server.Src.Domain.Entities
{
    public class Event
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public List<Match> Matches { get; set; }    
    }
}