using System.Text.Json;
using GymApi.Models;

namespace GymApi.Data;

// Substitui o banco de dados: cada usuário vira um arquivo
// Dados/usuarios/<id>.json. Um arquivo à parte (_indice.json) guarda o
// próximo Id disponível e o mapa de e-mail -> Id (pra login ser rápido
// sem precisar abrir todos os arquivos toda vez).
public class JsonUserStore
{
    private readonly string _pastaDados;
    private readonly string _arquivoIndice;
    private static readonly object _lock = new();
    private readonly JsonSerializerOptions _jsonOptions = new() { WriteIndented = true };

    public JsonUserStore(IWebHostEnvironment env)
    {
        _pastaDados = Path.Combine(env.ContentRootPath, "Dados", "usuarios");
        Directory.CreateDirectory(_pastaDados);
        _arquivoIndice = Path.Combine(_pastaDados, "_indice.json");
    }

    private class Indice
    {
        public int ProximoId { get; set; } = 1;
        public Dictionary<string, int> Emails { get; set; } = new();
    }

    private Indice LerIndice()
    {
        if (!File.Exists(_arquivoIndice)) return new Indice();
        var json = File.ReadAllText(_arquivoIndice);
        return JsonSerializer.Deserialize<Indice>(json) ?? new Indice();
    }

    private void SalvarIndice(Indice indice)
    {
        File.WriteAllText(_arquivoIndice, JsonSerializer.Serialize(indice, _jsonOptions));
    }

    private string CaminhoArquivo(int id) => Path.Combine(_pastaDados, $"{id}.json");

    public bool EmailExiste(string email)
    {
        lock (_lock)
        {
            var indice = LerIndice();
            return indice.Emails.ContainsKey(email.ToLowerInvariant());
        }
    }

    public UsuarioArquivo Criar(UsuarioArquivo usuario)
    {
        lock (_lock)
        {
            var indice = LerIndice();
            usuario.Id = indice.ProximoId;
            indice.ProximoId++;
            indice.Emails[usuario.Email.ToLowerInvariant()] = usuario.Id;
            SalvarIndice(indice);
            File.WriteAllText(CaminhoArquivo(usuario.Id), JsonSerializer.Serialize(usuario, _jsonOptions));
            return usuario;
        }
    }

    public void Salvar(UsuarioArquivo usuario)
    {
        lock (_lock)
        {
            File.WriteAllText(CaminhoArquivo(usuario.Id), JsonSerializer.Serialize(usuario, _jsonOptions));
        }
    }

    public UsuarioArquivo? BuscarPorId(int id)
    {
        lock (_lock)
        {
            var caminho = CaminhoArquivo(id);
            if (!File.Exists(caminho)) return null;
            return JsonSerializer.Deserialize<UsuarioArquivo>(File.ReadAllText(caminho));
        }
    }

    public UsuarioArquivo? BuscarPorEmail(string email)
    {
        int? id;
        lock (_lock)
        {
            var indice = LerIndice();
            id = indice.Emails.TryGetValue(email.ToLowerInvariant(), out var encontrado) ? encontrado : null;
        }
        return id is null ? null : BuscarPorId(id.Value);
    }

    public List<UsuarioArquivo> ListarPorIds(IEnumerable<int> ids)
    {
        return ids
            .Select(BuscarPorId)
            .Where(u => u is not null)
            .Select(u => u!)
            .ToList();
    }
}
