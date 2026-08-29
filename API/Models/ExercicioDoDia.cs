namespace GymApi.Models;

public class ExercicioDoDia
{
    public int Id { get; set; }

    public int DiaDeTreinoId { get; set; }
    public DiaDeTreino DiaDeTreino { get; set; } = null!;

    public string Nome { get; set; } = string.Empty;
    public int Series { get; set; }
    public int Repeticoes { get; set; }
    public decimal? CargaSugeridaKg { get; set; }
    public int? DescansoSegundos { get; set; }
    public string? Observacoes { get; set; }
}
