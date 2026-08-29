namespace GymApi.Models;

public class Cliente
{
    // Mesmo valor de Usuario.Id (relação 1:1 por PK compartilhada)
    public int Id { get; set; }
    public Usuario Usuario { get; set; } = null!;

    public int PersonalTrainerId { get; set; }
    public PersonalTrainer PersonalTrainer { get; set; } = null!;

    public DateTime? DataNascimento { get; set; }
    public string? Sexo { get; set; }
    public decimal? AlturaCm { get; set; }
}
