namespace GymApi.Dtos;

public record RegistrarRequest(string Nome, string Email, string Senha, string Role, int? PersonalTrainerId);
public record LoginRequest(string Email, string Senha);
public record LoginResponse(string Token, string Nome, string Role);
