# Gym API — Backend (.NET 8)

⚠️ **Importante:** este código foi escrito diretamente, sem compilar aqui
(o ambiente onde eu trabalho não tem o SDK do .NET nem acesso ao NuGet).
Revise ao rodar pela primeira vez — é bem provável que funcione de primeira,
mas fique atento a possíveis erros de compilação.

## Pré-requisitos

- .NET 8 SDK
- SQL Server (local, Docker, ou LocalDB no Windows)
- `dotnet-ef` instalado globalmente: `dotnet tool install --global dotnet-ef`

## Como rodar

1. Ajuste a connection string em `appsettings.json` (`ConnectionStrings:Default`)
   pro seu SQL Server local.
2. Troque `Jwt:Key` por uma chave secreta de verdade (mín. 32 caracteres) —
   **nunca** commite a chave real; use `dotnet user-secrets` ou variável de
   ambiente em produção.
3. Restaura os pacotes e cria o banco:

```bash
dotnet restore
dotnet ef migrations add Inicial
dotnet ef database update
```

4. Roda a API:

```bash
dotnet run
```

O Swagger sobe em `https://localhost:<porta>/swagger` — use ele pra testar
os endpoints sem precisar do frontend ainda.

## Fluxo de teste sugerido (via Swagger ou Postman)

1. `POST /api/auth/registrar` com `role: "Personal"` → anota o `Id` retornado
   no token (dá pra decodificar em jwt.io) ou consulta direto no banco.
2. `POST /api/auth/registrar` de novo com `role: "Cliente"` e
   `personalTrainerId` apontando pro Personal criado no passo 1.
3. `POST /api/auth/login` com o Cliente → copia o token.
4. No Swagger, clica em "Authorize" e cola `Bearer <token>`.
5. Popula um `PlanoDeTreino` com `DiaDeTreino` e `ExercicioDoDia` direto no
   banco (ainda não tem endpoint do personal pra criar plano — é o próximo
   passo) e testa `GET /api/cliente/plano-treino-ativo`.

## O que falta (próximos passos)

- Endpoints do Personal para criar/editar `PlanoDeTreino` e seus dias/exercícios
  (hoje só existe leitura do lado do cliente — a escrita ainda é manual no banco)
- Entidades e endpoints de `PlanoDeDieta` / `Refeicao` / `ItemRefeicao`
  (mesmo padrão do treino, adiado de propósito pra manter esse primeiro
  corte pequeno)
- Conectar o frontend: trocar `loginMock` em `src/auth/AuthContext.jsx`
  pela chamada real a `POST /api/auth/login`, guardando o token e
  mandando ele no header `Authorization: Bearer <token>` de cada request
- Validação de entrada mais robusta (hoje os DTOs não têm anotações de
  validação como `[Required]`/`[Range]`)
- Migrar `appsettings.json` pra não guardar segredos em texto puro
  (`dotnet user-secrets` em dev, variáveis de ambiente/Key Vault em produção)

## Estrutura

```
/Models        → entidades (tabelas do banco)
/Data          → AppDbContext (mapeamento EF Core)
/Dtos          → contratos de entrada/saída da API
/Services      → TokenService (geração de JWT)
/Controllers   → AuthController, PersonalController, ClienteController
```
