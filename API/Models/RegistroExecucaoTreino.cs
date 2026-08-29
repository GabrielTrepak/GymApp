namespace GymApi.Models;

public class RegistroExecucaoTreino
{
    public int Id { get; set; }

    public int ClienteId { get; set; }
    public Cliente Cliente { get; set; } = null!;

    public int DiaDeTreinoId { get; set; }
    public DiaDeTreino DiaDeTreino { get; set; } = null!;

    public DateTime DataExecucao { get; set; } = DateTime.UtcNow;
    public bool Concluido { get; set; }
    public string? Observacoes { get; set; }

    public ICollection<RegistroCargaExercicio> Cargas { get; set; } = new List<RegistroCargaExercicio>();
}
