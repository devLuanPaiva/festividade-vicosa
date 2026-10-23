# 08 — Ambiente local e deploy

## Variáveis de ambiente
| Variável | Onde | Para quê |
|----------|------|----------|
| `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME` | `.env` na raiz | Credenciais do Postgres; o compose repassa para o container `db` e para a API |
| `JWT_SECRET` | `.env` na raiz | Segredo para assinar os tokens de login (mínimo de 32 caracteres, gerado aleatoriamente) |
| `JWT_EXPIRES_IN` | `.env` na raiz | Validade do token (padrão `12h`) |
| `ADMIN_EMAIL`, `ADMIN_INITIAL_PASSWORD` | `.env` na raiz | Criam o primeiro Admin quando não há nenhum usuário (senha com pelo menos 6 caracteres; troque após o primeiro login) |
| `CORS_ORIGIN` | `.env` na raiz | Origens permitidas, separadas por vírgula (ex.: `https://app.dominio`) |
| `API_DOMAIN` | `.env` na raiz | Domínio público da API (Caddy emite o certificado) |
| `DATABASE_HOST`, `DATABASE_PORT`, `PORT`, `NODE_ENV` | `api/.env` (fora do Docker) | Rodar a API direto com `npm run start:dev` |

A API valida tudo na subida (`api/src/config/environment.ts`) e **não sobe** com variável faltando ou inválida. Nenhum `.env` é versionado; use os `.env.example`.

## Desenvolvimento
1. `cp .env.example .env` e ajuste a senha.
2. `docker compose up -d db`: Postgres em `127.0.0.1:5432`.
3. `cd api && cp .env.example .env && npm run start:dev`: API em `http://localhost:3000`, com `GET /health`.
4. `docker compose up` (completo) também sobe a API em container na porta 3000; o Caddy fica desligado em desenvolvimento.

## Produção (EC2)
1. Security Group: abrir só 80 e 443 (22 restrito ao seu IP). O Postgres nunca é publicado.
2. IP elástico e registro `api` no Route 53 apontando para ele.
3. Criar o `.env` no servidor com senha forte e `API_DOMAIN`/`CORS_ORIGIN` reais.
4. `docker compose -f docker-compose.yml up -d --build` (ignora o override de desenvolvimento).
5. Conferir `https://api.<dominio>/health`.

As migrations rodam sozinhas quando a API sobe (`migrationsRun`). Cada feature traz a sua migration e a sua entidade (arquivos `*.entity.ts`), então o esquema cresce junto com o código.

## Ainda por fazer
- Backup diário do Postgres para o S3 (ADR-04): feature à parte.
- Alarme no CloudWatch e snapshot do EBS antes do evento.
