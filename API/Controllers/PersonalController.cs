using System.Security.Claims;
using GymApi.Data;
using GymApi.Dtos;
using GymApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GymApi.Controllers;

[ApiController]
[Route("api/personal")]
[Authorize(Roles = "Personal")]
public class PersonalController : ControllerBase
{
    private readonly JsonUserStore _store;

    public PersonalController(JsonUserStore store)
    {
        _store = store;
    }

    private int PersonalIdAtual => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("clientes")]
    public ActionResult<List<ClienteResumoDto>> ListarClientes()
    {
        var personal = _store.BuscarPorId(PersonalIdAtual);
        if (personal is null) return NotFound();

        var clientes = _store.ListarPorIds(personal.ClientesIds);

        var resultado = clientes.Select(c =>
        {
            var registros = c.RegistrosProgresso.OrderByDescending(r => r.Data).ToList();
            var ultimo = registros.ElementAtOrDefault(0);
            var penultimo = registros.ElementAtOrDefault(1);
            decimal? delta = (ultimo is not null && penultimo is not null)
                ? ultimo.PesoKg - penultimo.PesoKg
                : null;

            return new ClienteResumoDto(c.Id, c.Nome, ultimo?.Data, ultimo?.PesoKg, delta);
        }).ToList();

        return Ok(resultado);
    }

    // Só deixa mexer em cliente que é seu, mesmo que o Id exista no sistema
    private bool ClientePertenceAoPersonal(int clienteId, out UsuarioArquivo personal)
    {
        personal = _store.BuscarPorId(PersonalIdAtual)!;
        return personal.ClientesIds.Contains(clienteId);
    }

    [HttpGet("clientes/{clienteId}/plano-treino")]
    public ActionResult<PlanoAtivoResponse?> ObterPlano(int clienteId)
    {
        if (!ClientePertenceAoPersonal(clienteId, out _))
            return Forbid();

        var cliente = _store.BuscarPorId(clienteId);
        if (cliente is null) return NotFound();
        if (cliente.PlanoDeTreino is null) return Ok(null);

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

    [HttpPost("clientes/{clienteId}/plano-treino")]
    public IActionResult SalvarPlano(int clienteId, CriarPlanoTreinoRequest req)
    {
        if (!ClientePertenceAoPersonal(clienteId, out _))
            return Forbid();

        var cliente = _store.BuscarPorId(clienteId);
        if (cliente is null) return NotFound();

        var proximoDiaId = 1;
        var proximoExercicioId = 1;

        var plano = new PlanoDeTreinoArquivo
        {
            Nome = req.Nome,
            Dias = req.Dias.Select(d => new DiaDeTreinoArquivo
            {
                Id = proximoDiaId++,
                NomeDia = d.NomeDia,
                Exercicios = d.Exercicios.Select(e => new ExercicioArquivo
                {
                    Id = proximoExercicioId++,
                    Nome = e.Nome,
                    Series = e.Series,
                    Repeticoes = e.Repeticoes,
                    CargaSugeridaKg = e.CargaSugeridaKg,
                    DescansoSegundos = e.DescansoSegundos,
                    Observacoes = e.Observacoes,
                }).ToList(),
            }).ToList(),
        };

        cliente.PlanoDeTreino = plano;
        _store.Salvar(cliente);

        return Ok();
    }
}
