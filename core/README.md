# Core — Festividade de Viçosa/RN

Documentação viva do projeto: visão, requisitos, regras de negócio, casos de uso e modelo de domínio.
Tudo em Markdown, com diagramas em Mermaid, versionado junto do código.

## Índice

| Doc | Conteúdo | Status |
|-----|----------|--------|
| [01-visao.md](01-visao.md) | Ideia, objetivos, atores, calendário, escopo | rascunho |
| [02-requisitos.md](02-requisitos.md) | RF / RNF com prioridade (P1 = MVP) | rascunho |
| [03-regras-negocio.md](03-regras-negocio.md) | Regras RN-xx, com pendências marcadas | rascunho |
| [04-casos-de-uso.md](04-casos-de-uso.md) | Diagrama e especificação dos UCs | rascunho |
| [05-modelo-dominio.md](05-modelo-dominio.md) | Diagrama de classes e decisões de modelagem | rascunho |
| [06-arquitetura.md](06-arquitetura.md) | Stack, ADRs, fluxos de foto/placar/cache, infra AWS | rascunho |
| [07-modelo-dados.md](07-modelo-dados.md) | Tabelas PostgreSQL/TypeORM, restrições, índices e ordem de implementação | rascunho |
| [08-ambiente-e-deploy.md](08-ambiente-e-deploy.md) | Variáveis de ambiente, desenvolvimento local e deploy na EC2 | rascunho |
| [09-api-endpoints.md](09-api-endpoints.md) | Endpoints já implementados, com permissões e regras | ativo |
| [99-perguntas-abertas.md](99-perguntas-abertas.md) | Dúvidas pendentes (cliente / decisões) | ativo |

## Convenções

- Requisitos funcionais: `RF-xx`; não funcionais: `RNF-xx`; regras de negócio: `RN-xx`; casos de uso: `UC-xx`.
- Item sem confirmação do cliente fica marcado como **(a confirmar)**.
- Stack atual do repositório: `api/` (NestJS) e `client/` (Next.js, App Router).
