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
| `GET /matches` | `categoryId`, `subEventId` e todos os filtros da linha abaixo |
| `GET /categories/:categoryId/matches` | `stage`, `groupId`, `round`, `status`, `teamId` (time de qualquer lado), `scheduledFrom`, `scheduledTo` (data e hora ISO 8601) |

Exemplo: `GET /categories/<id>/teams?city=viçosa&search=cen&limit=20`.

## Autenticação
| Método | Rota | Permissão | Descrição |
|--------|------|-----------|-----------|
| POST | `/auth/login` | pública | Recebe `email` e `password`; devolve `{ accessToken, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt }`. Limite de 5 tentativas por minuto (429 depois disso) |
| POST | `/auth/google` | pública | Recebe `idToken` e `nonce` do login com Google; devolve os mesmos tokens do login. 403 `GOOGLE_EMAIL_NOT_AUTHORIZED` se o e-mail não tem usuário ativo; 401 `GOOGLE_TOKEN_INVALID`, `GOOGLE_NONCE_MISMATCH` ou `GOOGLE_EMAIL_UNVERIFIED`; 503 `GOOGLE_LOGIN_UNAVAILABLE` sem `GOOGLE_CLIENT_ID`. Mesmo limite do login |
| POST | `/auth/refresh` | pública | Recebe `refreshToken`; devolve um novo par de tokens e invalida o recebido (tolerância de 10 s para requisições paralelas). 401 `INVALID_REFRESH_TOKEN` se desconhecido, expirado ou já reutilizado (reuso encerra a sessão inteira); 401 `USER_INACTIVE` se o usuário foi desativado |
| POST | `/auth/logout` | pública | Recebe `refreshToken` e encerra a sessão dele. 204, mesmo se o token já não existir |
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

## Partidas e resultados (RF-04, RF-05, RF-23)
| Método | Rota | Permissão | Descrição |
|--------|------|-----------|-----------|
| GET | `/categories/:categoryId/matches` | pública | Partidas da categoria, por data |
| GET | `/matches` | pública | Partidas de **todas as categorias**, por data, já com `teamA`, `teamB` e `category` embutidos (sem chamadas extras para descobrir nomes). Filtros: os de `/categories/:categoryId/matches` mais `categoryId` e `subEventId` (a modalidade é o sub-evento: futsal ou handebol). `subEventId` e `categoryId` juntos só devolvem partidas se a categoria for do sub-evento. 404 se o sub-evento ou a categoria não existe |
| GET | `/matches/:id` | pública | Uma partida, com placar, pênaltis, vencedor e melhor jogador quando finalizada |
| POST | `/categories/:categoryId/matches` | `match:create` | Cria (sempre `SCHEDULED`): `stage` (`GROUP`/`KNOCKOUT`), `scheduledAt`, `teamAId`, `teamBId`, `location?`, `groupId` (fase de grupos) ou `round` (mata-mata) |
| PATCH | `/matches/:id` | `match:create` | Altera `scheduledAt`, `location`, `teamAId`, `teamBId`. Trocar time só em partida `SCHEDULED` (409 `MATCH_ALREADY_FINALIZED`) |
| PUT | `/matches/:id/result` | `match:record-score` | Lança o resultado (jogado, W.O. ou W.O. dos dois times) e finaliza a partida; chamar de novo **corrige o resultado** (RN-23) |
| DELETE | `/matches/:id` | `match:create` | Exclui a partida. 204 |
| POST | `/categories/:categoryId/bracket` | `match:create` | Gera a primeira rodada do mata-mata (RN-27): `teamIds` (2, 4, 8 ou 16 times, do melhor para o pior cabeça de chave), `scheduledAt` (data da primeira rodada), `location?`. Devolve as partidas criadas, com `bracketPosition` |

**Chaveamento (RN-27, RN-28):** `BRACKET_SIZE_INVALID` e `BRACKET_TEAMS_DUPLICATED` (campo `teamIds`), 409 `BRACKET_ALREADY_EXISTS` se a categoria já tem chaveamento, e os mesmos erros de time fora da categoria da criação de partida. Ao finalizar uma partida do chaveamento, a próxima é criada ou atualizada na mesma chamada do `PUT /matches/:id/result`; refazer o `PUT` repete o avanço, então ele também conserta um avanço interrompido. 409 `NEXT_ROUND_ALREADY_PLAYED` se a correção trocaria o vencedor de uma partida cuja próxima já foi finalizada.

**Criação (RN-15):** os dois times são diferentes (`SAME_TEAM`) e da categoria da partida (`TEAM_NOT_IN_CATEGORY`). Na fase de grupos exige `groupId` e proíbe `round` (`GROUP_REQUIRED`, `ROUND_NOT_ALLOWED`) e os dois times têm de ser do grupo (`TEAM_NOT_IN_GROUP`). No mata-mata exige `round` e proíbe `groupId` (`ROUND_REQUIRED`, `GROUP_NOT_ALLOWED`). Rodadas: `ROUND_OF_16`, `QUARTER_FINAL`, `SEMI_FINAL`, `THIRD_PLACE`, `FINAL`.

**Resultado:** `resultType` (`PLAYED`, padrão; `WALKOVER`; `DOUBLE_WALKOVER`). Jogado: `scoreA` e `scoreB` (0 a 999) obrigatórios (`SCORE_REQUIRED`); a resposta traz `winnerId` calculado (nulo no empate da fase de grupos, que vale 1 ponto, RN-20).
- **Pênaltis (RN-22, RN-24):** `penaltiesA` e `penaltiesB` só no mata-mata e só quando o jogo empata; neles são obrigatórios e precisam definir um vencedor (`PENALTIES_REQUIRED`, `PENALTIES_TIED`, `PENALTIES_NOT_ALLOWED`, `PENALTIES_INCOMPLETE`). O placar do jogo não muda.
- **Melhor jogador (RN-18), opcional:** `bestPlayerName`, `bestPlayerTeamId` (um dos dois times da partida, `BEST_PLAYER_TEAM_INVALID`) e `bestPlayerPhotoKey?`. Sem nome, os outros dois também não podem vir (`BEST_PLAYER_NAME_REQUIRED`). Um novo `PUT` substitui tudo o que foi lançado antes.
- **W.O. (RN-25, RN-26):** `resultType: WALKOVER` com `walkoverWinnerId` (o time que compareceu, um dos dois da partida; `WALKOVER_WINNER_REQUIRED`, `WALKOVER_WINNER_INVALID`). `DOUBLE_WALKOVER` não tem vencedor (`DOUBLE_WALKOVER_WITH_WINNER`) e não existe no mata-mata (`DOUBLE_WALKOVER_IN_KNOCKOUT`). Em ambos o placar, os pênaltis e o melhor jogador são recusados (`WALKOVER_HAS_NO_PLAY`) e a resposta traz `scoreA`/`scoreB` nulos.
- Quem finalizou e quando fica gravado (RN-47); a API pública só devolve `finalizedAt`.

**Exclusões bloqueadas (RN-33):** excluir um time ou um grupo que tenha partidas devolve 409 (`TEAM_HAS_MATCHES`, `GROUP_HAS_MATCHES`); apague as partidas antes. 
## Classificação (RF-06)
| Método | Rota | Permissão | Descrição |
|--------|------|-----------|-----------|
| GET | `/categories/:categoryId/standings` | pública | Tabela de cada grupo da categoria: `[{ groupId, groupName, rows }]` |
| GET | `/groups/:id/standings` | pública | Tabela de um grupo |
| GET | `/categories/:categoryId/seeding` | pública | Classificados confirmados de todos os grupos na ordem sugerida de cabeças de chave: `[{ seed, teamId, teamName, groupId, groupName, qualifiedPosition }]` (RN-29). Vazio enquanto nenhum grupo confirmou |
| PUT | `/groups/:id/qualified` | `team:manage` | Confirma os classificados do grupo: `{ teamIds }` do 1º ao último colocado, só times do grupo e sem repetir (`TEAM_NOT_IN_GROUP`, `QUALIFIED_TEAMS_DUPLICATED`). Substitui a lista anterior; lista vazia limpa a confirmação. Devolve `[{ teamId, position }]` |

A classificação é **calculada na hora** a partir das partidas `FINALIZED` da fase de grupos (RN-16, RN-19), nunca gravada. Cada linha traz `position`, `teamId`, `teamName`, `played`, `wins`, `draws`, `losses`, `goalsFor`, `goalsAgainst`, `goalDifference`, `points`, `walkoverLosses`, `tied` (os critérios não separaram o time de outro, RN-21) e `qualifiedPosition` (posição confirmada pela equipe técnica, ou nulo, RN-29). Vitória vale 3, empate 1 e derrota 0 (RN-20); o W.O. dá vitória e vale 2x0 no saldo (RN-25) e o W.O. dos dois times conta derrota para ambos (RN-26). Times sem jogo aparecem zerados. Desempate pelo edital (RN-21). A tabela não calcula quem classifica: a equipe técnica confirma os classificados de cada grupo (RN-29).

## Papéis
| Método | Rota | Permissão | Descrição |
|--------|------|-----------|-----------|
| GET | `/roles` | `user:manage` | Papéis com o pacote padrão de permissões de cada um |

## Ainda não implementado
- Alterar o pacote de permissões de um **papel** (RN-44). Hoje o pacote vem do seed da migration.
