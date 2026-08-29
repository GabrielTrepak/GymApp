namespace GymApi.Dtos;

public record ExercicioDto(
    int Id,
    string Nome,
    int Series,
    int Repeticoes,
    decimal? CargaSugeridaKg,
    int? DescansoSegundos,
    string? Observacoes
);

public record DiaDeTreinoDto(int Id, string NomeDia, List<ExercicioDto> Exercicios);

public record PlanoAtivoResponse(int PlanoId, string Nome, List<DiaDeTreinoDto> Dias);

public record RegistrarCargaRequest(int ExercicioDoDiaId, int SeriesFeitas, int RepeticoesFeitas, decimal CargaUtilizadaKg);

public record RegistrarExecucaoRequest(
    int DiaDeTreinoId,
    bool Concluido,
    string? Observacoes,
    List<RegistrarCargaRequest> Cargas
);

public record RegistrarProgressoRequest(
    decimal PesoKg,
    decimal? PercentualGordura,
    string? FotoUrl,
    Dictionary<string, decimal>? Medidas
);

public record RegistroProgressoResponse(DateTime Data, decimal PesoKg, decimal? PercentualGordura);
