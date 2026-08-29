namespace GymApi.Models;

public class RegistroCargaExercicio
{
    public int Id { get; set; }

    public int RegistroExecucaoTreinoId { get; set; }
    public RegistroExecucaoTreino RegistroExecucaoTreino { get; set; } = null!;

    public int ExercicioDoDiaId { get; set; }
    public ExercicioDoDia ExercicioDoDia { get; set; } = null!;

    public int SeriesFeitas { get; set; }
    public int RepeticoesFeitas { get; set; }
    public decimal CargaUtilizadaKg { get; set; }
}
