namespace GymApi.Models;

public class DiaDeTreino
{
    public int Id { get; set; }

    public int PlanoDeTreinoId { get; set; }
    public PlanoDeTreino PlanoDeTreino { get; set; } = null!;

    public string NomeDia { get; set; } = string.Empty; // ex: "Treino A"
    public int Ordem { get; set; }

    public ICollection<ExercicioDoDia> Exercicios { get; set; } = new List<ExercicioDoDia>();
}
