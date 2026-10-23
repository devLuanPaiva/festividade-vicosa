# 09 — Endpoints da API

Endpoints já implementados. Toda rota exige `Authorization: Bearer <token>`, exceto as marcadas como públicas. Erros seguem o formato padrão do Nest (`statusCode`, `error`, `message`).

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
| POST | `/users` | `user:manage` | Cria usuário: `name`, `email`, `password` (mínimo de 12 caracteres), `roleCode`. 409 se o e-mail já existe |
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

## Papéis
| Método | Rota | Permissão | Descrição |
|--------|------|-----------|-----------|
| GET | `/roles` | `user:manage` | Papéis com o pacote padrão de permissões de cada um |

## Ainda não implementado
- Alterar o pacote de permissões de um **papel** (RN-44). Hoje o pacote vem do seed da migration.
