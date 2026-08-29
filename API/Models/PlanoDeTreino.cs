namespace GymApi.Models;

public class PlanoDeTreino
{
    public int Id { get; set; }

    public int ClienteId { get; set; }
    public Cliente Cliente { get; set; } = null!;

    public int PersonalTrainerId { get; set; }
    public PersonalTrainer PersonalTrainer { get; set; } = null!;

    public string Nome { get; set; } = string.Empty;
    public DateTime DataInicio { get; set; }
    public DateTime? DataFim { get; set; }
    public bool Ativo { get; set; } = true;

    public ICollection<DiaDeTreino> Dias { get; set; } = new List<DiaDeTreino>();
}
