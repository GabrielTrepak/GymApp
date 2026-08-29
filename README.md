# Gym App — Frontend (React + Vite)

## Rodando localmente

```
npm install
npm run dev
```

Abre em http://localhost:5173

## Login

O login está mockado (sem backend ainda). Na tela de login, escolha
"Cliente" ou "Personal" e qualquer e-mail — isso já te leva pra área certa.

## Estrutura

- `src/auth` — contexto de autenticação e proteção de rotas por papel
- `src/layouts` — layout do Personal (sidebar) e do Cliente (bottom nav mobile)
- `src/features/personal` — telas do personal trainer
- `src/features/cliente` — telas do cliente
- `src/styles/tokens.css` — variáveis de cor/tipografia (design tokens)

## Próximos passos sugeridos

1. Trocar `loginMock` em `src/auth/AuthContext.jsx` pela chamada real a
   `POST /api/auth/login` quando o backend .NET estiver pronto, guardando o
   JWT (ex: em memória + refresh, ou localStorage se aceitável pro projeto).
2. Criar `src/api/http.js` com uma instância de fetch/axios que já injeta o
   token no header Authorization.
3. Trocar os dados mock (`clientesMock`, `exerciciosMock`) por chamadas reais.
4. Registrar um service worker (ex: `vite-plugin-pwa`) pra deixar o app
   instalável de verdade e funcionar offline.
