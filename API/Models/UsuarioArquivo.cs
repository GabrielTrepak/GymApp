namespace GymApi.Models;

// Representa um usuário completo, com tudo que ele tem: dados de login,
// e — se for Cliente — o plano de treino e o histórico de progresso.
// Cada instância dessa classe vira um arquivo <id>.json na pasta Dados/usuarios/.
public class UsuarioArquivo
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SenhaHash { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty; // "Personal" ou "Cliente"
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

    // Só relevante quando Role == "Personal"
    public List<int> ClientesIds { get; set; } = new();

    // Só relevante quando Role == "Cliente"
    public int? PersonalTrainerId { get; set; }
    public PlanoDeTreinoArquivo? PlanoDeTreino { get; set; }
    public List<RegistroExecucaoArquivo> RegistrosExecucao { get; set; } = new();
    public List<RegistroProgressoArquivo> RegistrosProgresso { get; set; } = new();
}

public class PlanoDeTreinoArquivo
{
    public string Nome { get; set; } = string.Empty;
    public List<DiaDeTreinoArquivo> Dias { get; set; } = new();
}

public class DiaDeTreinoArquivo
{
    public int Id { get; set; }
    public string NomeDia { get; set; } = string.Empty; // ex: "Treino A"
    public List<ExercicioArquivo> Exercicios { get; set; } = new();
}

public class ExercicioArquivo
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public int Series { get; set; }
    public int Repeticoes { get; set; }
    public decimal? CargaSugeridaKg { get; set; }
    public int? DescansoSegundos { get; set; }
    public string? Observacoes { get; set; }
}

public class RegistroExecucaoArquivo
{
    public int DiaDeTreinoId { get; set; }
    public DateTime DataExecucao { get; set; } = DateTime.UtcNow;
    public bool Concluido { get; set; }
    public string? Observacoes { get; set; }
    public List<CargaExercicioArquivo> Cargas { get; set; } = new();
}

public class CargaExercicioArquivo
{
    public int ExercicioId { get; set; }
    public int SeriesFeitas { get; set; }
    public int RepeticoesFeitas { get; set; }
    public decimal CargaUtilizadaKg { get; set; }
}

public class RegistroProgressoArquivo
{
    public DateTime Data { get; set; } = DateTime.UtcNow;
    public decimal PesoKg { get; set; }
    public decimal? PercentualGordura { get; set; }
    public string? FotoUrl { get; set; }
    public Dictionary<string, decimal>? Medidas { get; set; }
}
