namespace WrestlingPredictions.Server.Src.Domain.Entities
{
    public class Prediction
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid MatchId { get; set; }
        public Guid TeamId { get; set; }
    }
}
