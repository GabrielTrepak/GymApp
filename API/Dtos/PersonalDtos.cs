namespace GymApi.Dtos;

public record ClienteResumoDto(int Id, string Nome, DateTime? UltimoRegistro, decimal? PesoAtual, decimal? DeltaKg);
