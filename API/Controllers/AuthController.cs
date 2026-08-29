using GymApi.Data;
using GymApi.Dtos;
using GymApi.Models;
using GymApi.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace GymApi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly JsonUserStore _store;
    private readonly IPasswordHasher<UsuarioArquivo> _hasher;
    private readonly TokenService _tokenService;

    public AuthController(JsonUserStore store, IPasswordHasher<UsuarioArquivo> hasher, TokenService tokenService)
    {
        _store = store;
        _hasher = hasher;
        _tokenService = tokenService;
    }

    [HttpPost("registrar")]
    public ActionResult<LoginResponse> Registrar(RegistrarRequest req)
    {
        if (_store.EmailExiste(req.Email))
            return Conflict("Já existe um usuário com esse e-mail.");

        if (req.Role != "Personal" && req.Role != "Cliente")
            return BadRequest("Role inválida. Use 'Personal' ou 'Cliente'.");

        if (req.Role == "Cliente")
        {
            if (req.PersonalTrainerId is null)
                return BadRequest("Cliente precisa informar o PersonalTrainerId.");

            var personalExistente = _store.BuscarPorId(req.PersonalTrainerId.Value);
            if (personalExistente is null || personalExistente.Role != "Personal")
                return BadRequest("PersonalTrainerId informado não existe.");
        }

        var usuario = new UsuarioArquivo
        {
            Nome = req.Nome,
            Email = req.Email,
            Role = req.Role,
            PersonalTrainerId = req.Role == "Cliente" ? req.PersonalTrainerId : null,
        };
        usuario.SenhaHash = _hasher.HashPassword(usuario, req.Senha);

        usuario = _store.Criar(usuario);

        // Vincula o cliente na lista do personal
        if (usuario.Role == "Cliente" && usuario.PersonalTrainerId is not null)
        {
            var personal = _store.BuscarPorId(usuario.PersonalTrainerId.Value)!;
            personal.ClientesIds.Add(usuario.Id);
            _store.Salvar(personal);
        }

        var token = _tokenService.GerarToken(usuario);
        return Ok(new LoginResponse(token, usuario.Nome, usuario.Role));
    }

    [HttpPost("login")]
    public ActionResult<LoginResponse> Login(LoginRequest req)
    {
        var usuario = _store.BuscarPorEmail(req.Email);
        if (usuario is null)
            return Unauthorized("E-mail ou senha inválidos.");

        var resultado = _hasher.VerifyHashedPassword(usuario, usuario.SenhaHash, req.Senha);
        if (resultado == PasswordVerificationResult.Failed)
            return Unauthorized("E-mail ou senha inválidos.");

        var token = _tokenService.GerarToken(usuario);
        return Ok(new LoginResponse(token, usuario.Nome, usuario.Role));
    }
}
