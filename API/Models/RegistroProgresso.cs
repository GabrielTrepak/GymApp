namespace GymApi.Models;

public class RegistroProgresso
{
    public int Id { get; set; }

    public int ClienteId { get; set; }
    public Cliente Cliente { get; set; } = null!;

    public DateTime Data { get; set; } = DateTime.UtcNow;
    public decimal PesoKg { get; set; }
    public decimal? PercentualGordura { get; set; }
    public string? FotoUrl { get; set; }

    public ICollection<MedidaCorporal> Medidas { get; set; } = new List<MedidaCorporal>();
}
