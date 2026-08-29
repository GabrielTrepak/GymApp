namespace GymApi.Dtos;

public record ClienteResumoDto(int Id, string Nome, DateTime? UltimoRegistro, decimal? PesoAtual, decimal? DeltaKg);

public record ExercicioRequest(
    string Nome,
    int Series,
    int Repeticoes,
    decimal? CargaSugeridaKg,
    int? DescansoSegundos,
    string? Observacoes
);

public record DiaDeTreinoRequest(string NomeDia, List<ExercicioRequest> Exercicios);

public record CriarPlanoTreinoRequest(string Nome, List<DiaDeTreinoRequest> Dias);
