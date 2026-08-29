using System.Security.Claims;
using GymApi.Data;
using GymApi.Dtos;
using GymApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GymApi.Controllers;

[ApiController]
[Route("api/cliente")]
[Authorize(Roles = "Cliente")]
public class ClienteController : ControllerBase
{
    private readonly JsonUserStore _store;

    public ClienteController(JsonUserStore store)
    {
        _store = store;
    }

    private int ClienteIdAtual => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("plano-treino-ativo")]
    public ActionResult<PlanoAtivoResponse> PlanoAtivo()
    {
        var cliente = _store.BuscarPorId(ClienteIdAtual);
        if (cliente?.PlanoDeTreino is null)
            return NotFound("Nenhum plano de treino ativo encontrado.");

        var plano = cliente.PlanoDeTreino;
        var dto = new PlanoAtivoResponse(
            0,
            plano.Nome,
            plano.Dias.Select(d => new DiaDeTreinoDto(
                d.Id,
                d.NomeDia,
                d.Exercicios.Select(e => new ExercicioDto(
                    e.Id, e.Nome, e.Series, e.Repeticoes, e.CargaSugeridaKg, e.DescansoSegundos, e.Observacoes
                )).ToList()
            )).ToList()
        );

        return Ok(dto);
    }

    [HttpPost("registro-execucao")]
    public IActionResult RegistrarExecucao(RegistrarExecucaoRequest req)
    {
        var cliente = _store.BuscarPorId(ClienteIdAtual);
        if (cliente is null) return NotFound();

        cliente.RegistrosExecucao.Add(new RegistroExecucaoArquivo
        {
            DiaDeTreinoId = req.DiaDeTreinoId,
            Concluido = req.Concluido,
            Observacoes = req.Observacoes,
            Cargas = req.Cargas.Select(c => new CargaExercicioArquivo
            {
                ExercicioId = c.ExercicioDoDiaId,
                SeriesFeitas = c.SeriesFeitas,
                RepeticoesFeitas = c.RepeticoesFeitas,
                CargaUtilizadaKg = c.CargaUtilizadaKg,
            }).ToList(),
        });

        _store.Salvar(cliente);
        return Created(string.Empty, new { });
    }

    [HttpPost("registro-progresso")]
    public IActionResult RegistrarProgresso(RegistrarProgressoRequest req)
    {
        var cliente = _store.BuscarPorId(ClienteIdAtual);
        if (cliente is null) return NotFound();

        cliente.RegistrosProgresso.Add(new RegistroProgressoArquivo
        {
            PesoKg = req.PesoKg,
            PercentualGordura = req.PercentualGordura,
            FotoUrl = req.FotoUrl,
            Medidas = req.Medidas,
        });

        _store.Salvar(cliente);
        return Created(string.Empty, new { });
    }

    [HttpGet("historico-progresso")]
    public ActionResult<List<RegistroProgressoResponse>> HistoricoProgresso()
    {
        var cliente = _store.BuscarPorId(ClienteIdAtual);
        if (cliente is null) return NotFound();

        var registros = cliente.RegistrosProgresso
            .OrderBy(r => r.Data)
            .Select(r => new RegistroProgressoResponse(r.Data, r.PesoKg, r.PercentualGordura))
            .ToList();

        return Ok(registros);
    }
}
