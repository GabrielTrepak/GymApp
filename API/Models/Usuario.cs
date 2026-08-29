namespace GymApi.Models;

public enum RoleUsuario
{
    Personal,
    Cliente
}

public class Usuario
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SenhaHash { get; set; } = string.Empty;
    public RoleUsuario Role { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
}
