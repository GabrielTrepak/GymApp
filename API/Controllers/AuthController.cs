using GymApi.Data;
using GymApi.Dtos;
using GymApi.Models;
using GymApi.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymApi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IPasswordHasher<Usuario> _hasher;
    private readonly TokenService _tokenService;

    public AuthController(AppDbContext db, IPasswordHasher<Usuario> hasher, TokenService tokenService)
    {
        _db = db;
        _hasher = hasher;
        _tokenService = tokenService;
    }

    // Cadastro: Personal se cadastra sozinho; Cliente precisa informar o
    // PersonalTrainerId de quem vai acompanhá-lo (na prática, o personal cria
    // o cadastro do cliente ou compartilha o próprio Id/link de convite).
    [HttpPost("registrar")]
    public async Task<ActionResult<LoginResponse>> Registrar(RegistrarRequest req)
    {
        if (await _db.Usuarios.AnyAsync(u => u.Email == req.Email))
            return Conflict("Já existe um usuário com esse e-mail.");

        if (!Enum.TryParse<RoleUsuario>(req.Role, ignoreCase: true, out var role))
            return BadRequest("Role inválida. Use 'Personal' ou 'Cliente'.");

        var usuario = new Usuario
        {
            Nome = req.Nome,
            Email = req.Email,
            Role = role,
        };
        usuario.SenhaHash = _hasher.HashPassword(usuario, req.Senha);

        _db.Usuarios.Add(usuario);
        await _db.SaveChangesAsync();

        if (role == RoleUsuario.Personal)
        {
            _db.PersonalTrainers.Add(new PersonalTrainer { Id = usuario.Id });
        }
        else
        {
            if (req.PersonalTrainerId is null)
                return BadRequest("Cliente precisa informar o PersonalTrainerId.");

            var personalExiste = await _db.PersonalTrainers.AnyAsync(p => p.Id == req.PersonalTrainerId);
            if (!personalExiste)
                return BadRequest("PersonalTrainerId informado não existe.");

            _db.Clientes.Add(new Cliente { Id = usuario.Id, PersonalTrainerId = req.PersonalTrainerId.Value });
        }

        await _db.SaveChangesAsync();

        var token = _tokenService.GerarToken(usuario);
        return Ok(new LoginResponse(token, usuario.Nome, usuario.Role.ToString()));
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest req)
    {
        var usuario = await _db.Usuarios.SingleOrDefaultAsync(u => u.Email == req.Email);
        if (usuario is null)
            return Unauthorized("E-mail ou senha inválidos.");

        var resultado = _hasher.VerifyHashedPassword(usuario, usuario.SenhaHash, req.Senha);
        if (resultado == PasswordVerificationResult.Failed)
            return Unauthorized("E-mail ou senha inválidos.");

        var token = _tokenService.GerarToken(usuario);
        return Ok(new LoginResponse(token, usuario.Nome, usuario.Role.ToString()));
    }
}
