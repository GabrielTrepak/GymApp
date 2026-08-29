namespace GymApi.Models;

public class MedidaCorporal
{
    public int Id { get; set; }

    public int RegistroProgressoId { get; set; }
    public RegistroProgresso RegistroProgresso { get; set; } = null!;

    public string Regiao { get; set; } = string.Empty; // braço, cintura, coxa...
    public decimal ValorCm { get; set; }
}
