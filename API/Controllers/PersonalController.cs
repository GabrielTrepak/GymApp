using System.Security.Claims;
using GymApi.Data;
using GymApi.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymApi.Controllers;

[ApiController]
[Route("api/personal")]
[Authorize(Roles = "Personal")]
public class PersonalController : ControllerBase
{
    private readonly AppDbContext _db;

    public PersonalController(AppDbContext db)
    {
        _db = db;
    }

    // O claim "sub" do JWT é mapeado automaticamente para ClaimTypes.NameIdentifier
    private int PersonalIdAtual =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("clientes")]
    public async Task<ActionResult<List<ClienteResumoDto>>> ListarClientes()
    {
        var personalId = PersonalIdAtual;

        var clientes = await _db.Clientes
            .Where(c => c.PersonalTrainerId == personalId)
            .Include(c => c.Usuario)
            .ToListAsync();

        var resultado = new List<ClienteResumoDto>();

        foreach (var cliente in clientes)
        {
            var ultimosDois = await _db.RegistrosProgresso
                .Where(r => r.ClienteId == cliente.Id)
                .OrderByDescending(r => r.Data)
                .Take(2)
                .ToListAsync();

            var ultimo = ultimosDois.ElementAtOrDefault(0);
            var penultimo = ultimosDois.ElementAtOrDefault(1);
            decimal? delta = (ultimo is not null && penultimo is not null)
                ? ultimo.PesoKg - penultimo.PesoKg
                : null;

            resultado.Add(new ClienteResumoDto(
                cliente.Id,
                cliente.Usuario.Nome,
                ultimo?.Data,
                ultimo?.PesoKg,
                delta
            ));
        }

        return Ok(resultado);
    }
}
