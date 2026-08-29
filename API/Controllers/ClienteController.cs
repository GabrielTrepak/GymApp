using System.Security.Claims;
using GymApi.Data;
using GymApi.Dtos;
using GymApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymApi.Controllers;

[ApiController]
[Route("api/cliente")]
[Authorize(Roles = "Cliente")]
public class ClienteController : ControllerBase
{
    private readonly AppDbContext _db;

    public ClienteController(AppDbContext db)
    {
        _db = db;
    }

    private int ClienteIdAtual =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("plano-treino-ativo")]
    public async Task<ActionResult<PlanoAtivoResponse>> PlanoAtivo()
    {
        var clienteId = ClienteIdAtual;

        var plano = await _db.PlanosDeTreino
            .Where(p => p.ClienteId == clienteId && p.Ativo)
            .Include(p => p.Dias)
                .ThenInclude(d => d.Exercicios)
            .OrderByDescending(p => p.DataInicio)
            .FirstOrDefaultAsync();

        if (plano is null)
            return NotFound("Nenhum plano de treino ativo encontrado.");

        var dto = new PlanoAtivoResponse(
            plano.Id,
            plano.Nome,
            plano.Dias
                .OrderBy(d => d.Ordem)
                .Select(d => new DiaDeTreinoDto(
                    d.Id,
                    d.NomeDia,
                    d.Exercicios.Select(e => new ExercicioDto(
                        e.Id, e.Nome, e.Series, e.Repeticoes, e.CargaSugeridaKg, e.DescansoSegundos, e.Observacoes
                    )).ToList()
                ))
                .ToList()
        );

        return Ok(dto);
    }

    [HttpPost("registro-execucao")]
    public async Task<IActionResult> RegistrarExecucao(RegistrarExecucaoRequest req)
    {
        var clienteId = ClienteIdAtual;

        var registro = new RegistroExecucaoTreino
        {
            ClienteId = clienteId,
            DiaDeTreinoId = req.DiaDeTreinoId,
            Concluido = req.Concluido,
            Observacoes = req.Observacoes,
        };

        foreach (var carga in req.Cargas)
        {
            registro.Cargas.Add(new RegistroCargaExercicio
            {
                ExercicioDoDiaId = carga.ExercicioDoDiaId,
                SeriesFeitas = carga.SeriesFeitas,
                RepeticoesFeitas = carga.RepeticoesFeitas,
                CargaUtilizadaKg = carga.CargaUtilizadaKg,
            });
        }

        _db.RegistrosExecucaoTreino.Add(registro);
        await _db.SaveChangesAsync();

        return Created(string.Empty, new { registro.Id });
    }

    [HttpPost("registro-progresso")]
    public async Task<IActionResult> RegistrarProgresso(RegistrarProgressoRequest req)
    {
        var clienteId = ClienteIdAtual;

        var registro = new RegistroProgresso
        {
            ClienteId = clienteId,
            PesoKg = req.PesoKg,
            PercentualGordura = req.PercentualGordura,
            FotoUrl = req.FotoUrl,
        };

        if (req.Medidas is not null)
        {
            foreach (var (regiao, valor) in req.Medidas)
                registro.Medidas.Add(new MedidaCorporal { Regiao = regiao, ValorCm = valor });
        }

        _db.RegistrosProgresso.Add(registro);
        await _db.SaveChangesAsync();

        return Created(string.Empty, new { registro.Id });
    }

    [HttpGet("historico-progresso")]
    public async Task<ActionResult<List<RegistroProgressoResponse>>> HistoricoProgresso()
    {
        var clienteId = ClienteIdAtual;

        var registros = await _db.RegistrosProgresso
            .Where(r => r.ClienteId == clienteId)
            .OrderBy(r => r.Data)
            .Select(r => new RegistroProgressoResponse(r.Data, r.PesoKg, r.PercentualGordura))
            .ToListAsync();

        return Ok(registros);
    }
}
