# 09 — Endpoints da API

Endpoints já implementados. Toda rota exige `Authorization: Bearer <token>`, exceto as marcadas como públicas.

## Formato das respostas
Toda resposta segue o padrão definido por `ResponseInterceptor` e `HttpExceptionFilter` (registrados globalmente em `app.setup.ts`).

**Sucesso (um item ou ação):**
```json
{ "status": "success", "result": { "id": 1, "name": "Ana" } }
```

**Sucesso (lista, com paginação por `?offset=0&limit=100`):**
```json
{
  "status": "success",
  "count": 25,
  "currentPage": 1,
  "totalPages": 1,
  "next": null,
  "previous": null,
  "results": []
}
```
`next` e `previous` são links completos, já com os demais filtros da consulta. Respostas `204` não têm corpo.

**Erro:**
```json
{
  "status": "error",
  "message": "Conflito de dados",
  "data": null,
  "errors": {
    "code": "EMAIL_ALREADY_EXISTS",
    "field": "email",
    "detail": "Já existe um usuário com este e-mail."
  }
}
```
- `detail`: uma frase em português, pronta para exibir ao usuário.
- `field`: nome do campo que falhou (ex.: `email`, `password`); o client mostra o `detail` junto ao campo. Vazio quando o erro não é de um campo.
- `code`: identificador estável para o client decidir comportamento (ex.: `INVALID_CREDENTIALS`, `LAST_PERMISSIONS_MANAGER`, `VALIDATION_ERROR`).
- Erros inesperados (500) nunca expõem a mensagem interna; ficam só no log do servidor.

**Como lançar erros no código:** `throw new ConflictException(apiError('CODIGO', 'Frase para o usuário.', 'campo'))` (`common/errors/api-error.ts`). Mensagens de validação dos DTOs ficam em `common/validation/validation-messages.ts`.

## Identificadores e filtros
- **IDs são UUID v4** (ex.: `a3bb189e-8bf9-4888-9912-ace4e6543002`), gerados pelo banco. Um `:id` que não seja UUID v4 devolve 400 (`INVALID_ID`, campo `id`).
- **Toda listagem aceita filtros pela query string**, combinados com `E`, além da paginação `?offset=0&limit=100`. Parâmetro desconhecido ou valor inválido devolve 400 (`VALIDATION_ERROR`, com o `field` do parâmetro). Os links `next` e `previous` preservam os filtros.
- **`search`** faz busca parcial, sem diferenciar maiúsculas de minúsculas, no nome (máx. 120 caracteres). Em `/users` busca no nome ou no e-mail.

| Listagem | Filtros |
|----------|---------|
| `GET /editions` | `year`, `search` |
| `GET /editions/:editionId/sub-events` | `type` |
| `GET /sub-events/:subEventId/categories` | `gender` (`MALE`/`FEMALE`), `search` |
| `GET /categories/:categoryId/groups` | `search` |
| `GET /categories/:categoryId/teams` | `groupId`, `city` (parcial), `search` |
| `GET /users` | `active` (`true`/`false`), `roleCode`, `search` |

Exemplo: `GET /categories/<id>/teams?city=viçosa&search=cen&limit=20`.

## Autenticação
| Método | Rota | Permissão | Descrição |
|--------|------|-----------|-----------|
| POST | `/auth/login` | pública | Recebe `email` e `password`; devolve `{ accessToken }`. Limite de 5 tentativas por minuto (429 depois disso) |
| GET | `/auth/me` | qualquer usuário logado | Usuário atual com as permissões efetivas (o client usa para esconder botões; a API é quem barra) |
| GET | `/health` | pública | Estado da API e do banco (200 ou 503) |

## Usuários (RF-30)
| Método | Rota | Permissão | Descrição |
|--------|------|-----------|-----------|
| GET | `/users` | `user:manage` | Lista usuários (nunca devolve a senha) |
| POST | `/users` | `user:manage` | Cria usuário: `name`, `email`, `password` (mínimo de 6 caracteres), `roleCode`. 409 se o e-mail já existe |
| PATCH | `/users/:id/activate` | `user:manage` | Reativa o usuário |
| PATCH | `/users/:id/deactivate` | `user:manage` | Desativa (RN-47: nunca exclui). 409 se for o último gestor de permissões (RN-46) |
| PATCH | `/users/:id/role` | `user:manage-permissions` | Troca o papel. 403 se for o próprio usuário (RN-45); 409 pela RN-46 |

## Permissões individuais (RF-31)
| Método | Rota | Permissão | Descrição |
|--------|------|-----------|-----------|
| GET | `/users/:id/permissions` | `user:manage` | Permissões efetivas e concessões/revogações do usuário |
| PUT | `/users/:id/permissions/:permission` | `user:manage-permissions` | Define `{ "effect": "GRANTED" \| "REVOKED" }`. 204 |
| DELETE | `/users/:id/permissions/:permission` | `user:manage-permissions` | Remove a concessão/revogação. 204 |

`:permission` é um dos códigos do catálogo (ex.: `photo:delete`). Regras: ninguém altera as **próprias** permissões (RN-45, 403) e a mudança nunca pode deixar o sistema sem um usuário ativo com `user:manage-permissions` (RN-46, 409).

## Edições e sub-eventos (RF-21)
| Método | Rota | Permissão | Descrição |
|--------|------|-----------|-----------|
| GET | `/editions` | pública | Lista as edições (ano mais recente primeiro) |
| GET | `/editions/:id` | pública | Uma edição |
| POST | `/editions` | `schedule:manage` | Cria edição: `year` (2000–2100), `name`, `description?`. 409 se o ano já existe |
| PATCH | `/editions/:id` | `schedule:manage` | Altera os campos informados |
| GET | `/editions/:editionId/sub-events` | pública | Sub-eventos da edição, por data de início |
| GET | `/sub-events/:id` | pública | Um sub-evento |
| POST | `/editions/:editionId/sub-events` | `schedule:manage` | Cria: `type`, `name`, `startDate`, `endDate` (`AAAA-MM-DD`), `description?`, `location?`. 409 se a edição já tem o tipo; 400 se `endDate` < `startDate` |
| PATCH | `/sub-events/:id` | `schedule:manage` | Altera nome, descrição, datas e local (o `type` não muda) |

A edição **2026** e os 7 sub-eventos do calendário (handebol 4–6/12, festival cultural 8/12, futsal 9–19/12, vôlei de areia e corrida 13/12, ecopedal 20/12, festa 27–28/12) vêm do seed da migration.

## Categorias, grupos e times (RF-22)
| Método | Rota | Permissão | Descrição |
|--------|------|-----------|-----------|
| GET | `/sub-events/:subEventId/categories` | pública | Categorias do sub-evento |
| GET | `/categories/:id` | pública | Uma categoria |
| POST | `/sub-events/:subEventId/categories` | `team:manage` | Cria: `name`, `gender` (`MALE`/`FEMALE`), `ageRange?`. 400 se o sub-evento não é futsal nem handebol (RN-03); 409 se o nome já existe no sub-evento |
| PATCH | `/categories/:id` | `team:manage` | Altera nome, gênero e faixa etária |
| GET | `/categories/:categoryId/groups` | pública | Grupos da categoria, por nome |
| GET | `/groups/:id` | pública | Um grupo |
| POST | `/categories/:categoryId/groups` | `team:manage` | Cria: `name`. 409 se o nome já existe na categoria |
| PATCH | `/groups/:id` | `team:manage` | Renomeia |
| DELETE | `/groups/:id` | `team:manage` | Exclui o grupo; os times dele ficam sem grupo. 204 |
| GET | `/categories/:categoryId/teams` | pública | Times da categoria, por nome |
| GET | `/teams/:id` | pública | Um time |
| POST | `/categories/:categoryId/teams` | `team:manage` | Cria: `name`, `city`, `slug?`, `abbreviation?` (2 a 10 caracteres), `photoKey?`, `groupId?`. Sem `slug`, ele é gerado do nome. 409 se o nome ou o slug já existem na categoria; 400 se o grupo é de outra categoria (RN-13) |
| PATCH | `/teams/:id` | `team:manage` | Altera os campos informados (`groupId: null` tira o time do grupo; `abbreviation: null` e `photoKey: null` limpam o campo). O slug não muda sozinho quando o nome muda |
| DELETE | `/teams/:id` | `team:manage` | Exclui o time. 204 |

As 11 categorias da edição 2026 (RN-11: 7 de handebol e 4 de futsal) vêm do seed da migration. O time guarda só a chave do arquivo da foto (`photoKey`); o upload entra com o resource de fotos; o bloqueio de excluir time com partidas (RN-33) entra junto com o resource de partidas.

## Papéis
| Método | Rota | Permissão | Descrição |
|--------|------|-----------|-----------|
| GET | `/roles` | `user:manage` | Papéis com o pacote padrão de permissões de cada um |

## Ainda não implementado
- Alterar o pacote de permissões de um **papel** (RN-44). Hoje o pacote vem do seed da migration.
