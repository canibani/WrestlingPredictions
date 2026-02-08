namespace WrestlingPredictions.Server.Src.Domain.Entities
{
    public class Prediction
    {
        public Guid Id { get; set; }
        public User User { get; set; }
        public Match Match { get; set; }
        public int Result { get; set; }
    }
}
