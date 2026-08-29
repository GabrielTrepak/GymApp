namespace GymApi.Models;

public class PersonalTrainer
{
    // Mesmo valor de Usuario.Id (relação 1:1 por PK compartilhada)
    public int Id { get; set; }
    public Usuario Usuario { get; set; } = null!;

    public string? Cref { get; set; }
    public string? Bio { get; set; }

    public ICollection<Cliente> Clientes { get; set; } = new List<Cliente>();
}
