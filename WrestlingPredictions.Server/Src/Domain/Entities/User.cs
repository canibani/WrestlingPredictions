namespace WrestlingPredictions.Server.Src.Domain.Entities
{
    public class User
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public int Points { get; set; }
    }
}