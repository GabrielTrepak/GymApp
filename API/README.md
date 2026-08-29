# Gym API — Backend (.NET, ASP.NET Core)

⚠️ **Importante:** este código foi escrito diretamente, sem compilar aqui
(o ambiente onde eu trabalho não tem o SDK do .NET nem acesso ao NuGet).
Revise ao rodar pela primeira vez — bem provável que funcione de primeira,
mas fique atento a possíveis erros de compilação.

## Como funciona o "banco de dados"

Pra manter simples (isso é uma demo), **não tem banco de verdade**. Cada
usuário vira um arquivo `.json` dentro de `Dados/usuarios/`, criado
automaticamente na primeira vez que você registra alguém — não precisa criar
essa pasta manualmente.

- `Dados/usuarios/1.json`, `Dados/usuarios/2.json`, etc. — um arquivo por
  usuário, com todos os dados dele (login, e se for Cliente: plano de
  treino, execuções e progresso registrados)
- `Dados/usuarios/_indice.json` — controla o próximo Id disponível e faz o
  mapeamento e-mail → Id (pra login não precisar abrir todos os arquivos)

Essa pasta está no `.gitignore` — ela guarda senha com hash e dados de
teste, não deveria ir pro repositório.

**Diferente do banco em memória (EF InMemory) que usamos antes, agora os
dados sobrevivem a reiniciar a API** — é só reiniciar `dotnet run` que os
usuários continuam lá, porque estão em disco.

## Pré-requisitos

- .NET SDK (funciona com o 8 ou 9)

## Como rodar

1. Troque `Jwt:Key` (em `appsettings.json`) por uma chave secreta de
   verdade (mín. 32 caracteres) — **nunca** commite a chave real; use
   `dotnet user-secrets` ou variável de ambiente em produção.
2. Restaura os pacotes:

```bash
dotnet restore
```

3. Roda a API:

```bash
dotnet run
```

Pra ver o Swagger (documentação interativa), roda em modo Development:

```bash
# PowerShell
$env:ASPNETCORE_ENVIRONMENT="Development"
dotnet run
```

Depois abre `http://localhost:5000/swagger`.

## O que falta (próximos passos)

- Endpoints do Personal para criar/editar o plano de treino do cliente
  (hoje só existe leitura do lado do cliente)
- Dieta (mesmo padrão do treino, adiado de propósito)
- Conectar o frontend às rotas de treino/progresso (já conectamos
  login e listagem de clientes)
- Validação de entrada mais robusta nos DTOs

## Estrutura

```
/Models        → UsuarioArquivo (e as classes aninhadas: plano, exercícios, registros)
/Data          → JsonUserStore (lê/escreve os arquivos JSON)
/Dtos          → contratos de entrada/saída da API
/Services      → TokenService (geração de JWT)
/Controllers   → AuthController, PersonalController, ClienteController
/Dados         → gerado em runtime, não vai pro Git (dados dos usuários)
```
