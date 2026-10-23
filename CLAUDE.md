# Festividade de Viçosa/RN

Portal da festividade (JOCEV, programação, galeria, história). Monorepo com `api/` (NestJS + TypeORM + PostgreSQL), `client/` (Next.js, pages router) e `core/` (documentação em português: requisitos, regras, modelo, arquitetura).

Antes de implementar algo, leia o doc correspondente em `core/` (regras `RN-xx`, modelo em `07-modelo-dados.md`, decisões em `06-arquitetura.md`).

## Idioma

- **Em inglês:** código, nomes de tabelas, colunas, enums, rotas da API, variáveis de ambiente, nomes de branch e mensagens de commit.
- **Em português (pt-BR):** documentação em `core/` e textos exibidos ao usuário final.

## Padrão de código

- Código limpo e autoexplicativo: **sem comentários** (regra de lint). Se precisa explicar, renomeie ou extraia uma função.
- Nomes claros e completos, sem abreviações (`scheduledAt`, não `dt`). Funções com verbo, classes e tipos com substantivo.
- Cada função faz **uma única coisa**: até 20 linhas na API, parâmetros até 3 (use objeto acima disso), no máximo 2 níveis de aninhamento, complexidade ciclomática até 6.
- **Arquivo ou componente com no máximo 200 linhas.** Passou disso, divida (componentização, extração de serviços).
- **Tipagem forte:** `strict` ligado, proibido `any`, `!` (non-null assertion) e retorno implícito. Tipos de retorno explícitos nas funções da API.
- **Sem duplicação:** extraia o que se repete (`npm run duplication` falha acima de 3%). Sem strings e números mágicos repetidos: use constantes e enums.
- Sem `console.log`; use o `Logger` do Nest na API.
- Regras de negócio vivem em serviços e funções puras, não em controllers nem em componentes.

Tudo isso é verificado por ESLint (`eslint-plugin-sonarjs`, `eslint-plugin-no-comments`, regras de tamanho e complexidade), `tsc` e `jscpd`. Não desligue regra com `eslint-disable`; corrija o código.

## Estrutura da API (resources)

Cada entidade de negócio é um **resource** em `api/src/resources/<nome>/`, com esta organização:

```
resources/user/
  controllers/   rotas HTTP (só recebem, validam e delegam)
  services/      regras de negócio
  repository/    acesso a dados (encapsula o repositório do TypeORM)
  dto/           contratos de entrada e saída
  entities/      entidades TypeORM
  <nome>.module.ts
```

- **Obrigatórios em todo resource com API:** `controllers/`, `services/`, `repository/`, `dto/` e o `*.module.ts`. Os testes seguem a seção Testes: ficam ao lado do arquivo (`*.spec.ts`) e só onde há regra a proteger.
- O resto entra **só quando necessário**: `guards/`, `validators/`, `decorators/`, `enums/`, `rules/` (funções puras de regra), `mappers/` etc. Não crie pasta vazia.
- Resource sem persistência própria (ex.: `auth`, `health`) dispensa `repository/` e `entities/`.
- Services dependem de repositories, nunca do `Repository` do TypeORM diretamente.
- Infraestrutura compartilhada fica fora de `resources/`: `config/` (variáveis de ambiente), `database/` (conexão e migrations), `common/` (erros, validação e pipes reutilizáveis), `filters/` e `interceptors/` (formato global das respostas).

## Padrões da API (NestJS)

Baseado na skill `nestjs-best-practices`:

- **Módulos por resource** (`match`, `team`, `photo`...), nunca por camada técnica global. Sem dependência circular entre módulos.
- Controller só recebe, valida e delega; **serviço** concentra a regra; acesso a dados por repositório do TypeORM injetado no construtor.
- **DTOs com `class-validator`** em toda entrada, `ValidationPipe` global com `whitelist` e `forbidNonWhitelisted`. Nunca devolva a entidade crua: use DTO de resposta.
- **Respostas e erros seguem o padrão global** (`ResponseInterceptor` e `HttpExceptionFilter`, registrados em `app.setup.ts`; formato em `core/09-api-endpoints.md`). Nunca monte a resposta de sucesso à mão: o controller devolve o dado e o interceptor embrulha (`status`, `result`, ou lista paginada).
- **Todo erro lançado leva `code`, `detail` e, quando vem de um campo, `field`:** `throw new ConflictException(apiError('EMAIL_ALREADY_EXISTS', 'Já existe um usuário com este e-mail.', 'email'))`. O `detail` é **uma frase em pt-BR pronta para o usuário**; o client mostra no campo indicado por `field`. Sem `try/catch` silencioso.
- Mensagens de validação dos DTOs ficam em `common/validation/validation-messages.ts` (pt-BR) e todo `@Param('id')` usa o `ParseIdPipe`.
- Erros inesperados (500) nunca expõem a mensagem interna ao cliente; o filtro só registra no log.
- Autorização por _guard_ e permissão (`@RequirePermission('match:record-score')`), nunca por `if` de papel.
- Configuração só via `@nestjs/config` com variáveis validadas na subida. Sem `process.env` espalhado.
- Banco: migrations versionadas (`synchronize: false`), transações em operações com mais de uma escrita, sem N+1.
- Log pelo `Logger` do Nest, `enableShutdownHooks`, rota de saúde (`/health`) e limite de requisições nas rotas de login e upload.

## Testes

- **Exceção:** `api/src/database/demo/` (seed de demonstração) é ferramenta só do localhost, sem testes e fora da cobertura.
- **Qualidade acima de quantidade:** poucos testes que previnem regressão real valem mais que muitos que só conferem se um parâmetro chegou na função. Cada teste precisa responder "que bug este teste pega?". Sem resposta, não escreva.
- **Toda feature entra com testes no mesmo PR, escolhidos por risco:** `*.spec.ts` na API (Jest), `*.test.ts(x)` no client (Vitest + Testing Library). Teste regra de negócio (`RN-xx`), integridade de dados, segurança e erros que o client exibe.
- **Não escreva teste de:** controller que só repassa para o serviço, repository que só chama o TypeORM, mapper 1:1, decorator, validação que o `class-validator` já garante, nem de código só do localhost.
- Teste comportamento, não implementação: verifique o resultado, não as chamadas do mock. Cubra caso feliz, bordas e erros da regra envolvida.
- Todo teste segue F.I.R.S.T.: rápido, independente, repetível, autovalidável e escrito junto da regra. Nome que descreve a regra e o mínimo de expressão para dizer isso.
- Regras de negócio puras (ex.: classificação do grupo) com testes por tabela de casos.
- Cobertura mínima de 80% (linhas, funções, branches) sobre a lógica: controllers, repositories e mappers ficam fora da coleta. Cobertura é consequência, não meta.
- **Todos os testes passam antes de abrir o PR:** `npm run verify` na raiz (lint + typecheck + testes + duplicação). O hook de `pre-push` roda isso.

## Git flow

Branches:

- `main`: produção, sempre estável. Só recebe merge de `development` (release) e de `hotfix/*`.
- `development`: integração. Base de todo trabalho.
- `feature/<nome>`, `refactor/<nome>`, `fix/<nome>`, `chore/<nome>`, `docs/<nome>`, `test/<nome>`: saem de `development` e voltam para ela via PR.
- `hotfix/<nome>`: sai de `main`, volta para `main` e `development`.

Fluxo de cada mudança:

1. Atualize `development` e crie a branch a partir dela.
2. Commits **separados, na ordem de dependência** (ex.: entidade → migration → serviço → controller → testes). Nunca um commit gigante com tudo.
3. Rode `npm run verify`; tudo precisa passar.
4. Abra o PR para `development` (merge commit, sem squash, para preservar os commits).
5. Após o merge, **apague a branch** (remota e local).

Mensagens de commit: Conventional Commits em inglês, no imperativo, minúsculas, até 72 caracteres: `feat(match): add score recording service`. Tipos: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `ci`, `build`, `perf`, `style`, `revert`. O hook `commit-msg` valida.

Nunca commitar segredos (`.env`, chaves AWS, senhas). Use `.env.example` com valores fictícios.

## Comandos

Na raiz: `npm run lint`, `npm run typecheck`, `npm test`, `npm run duplication`, `npm run verify`.
API (`cd api`): `npm run start:dev`, `npm test`, `npm run test:e2e`, `npm run lint:fix`, `npm run migration:generate -- src/database/migrations/<Name>`, `npm run migration:run`, `npm run seed:demo` (dados fictícios; `-- --reset` apaga e recria as partidas, times e grupos da edição).
Banco e API locais: copie `.env.example` para `.env` e rode `docker compose up -d db` (o override expõe o Postgres em `127.0.0.1:5432`). Produção (EC2): `docker compose -f docker-compose.yml up -d --build`, que também sobe o Caddy com HTTPS.
Client (`cd client`): `npm run dev`, `npm test`, `npm run lint:fix`.

## Observações

- O Next.js do `client/` tem mudanças incompatíveis com o que se conhece; siga `client/AGENTS.md` e leia `node_modules/next/dist/docs/` antes de usar uma API do Next.
- Skills de NestJS instaladas em `api/.claude/skills/`.
- Skill de performance React/Next instalada em `client/.claude/skills/vercel-react-best-practices/`: siga-a ao escrever componentes, páginas e busca de dados (sem barrel files, `Promise.all` para chamadas independentes, `next/dynamic` para componentes pesados).
- No client, o contrato das respostas da API (`ApiResult`, `ApiPage`, `ApiError`) está em `src/lib/api/api-response.ts`: exiba `error.details.detail` e use `messageForField` para mostrar a mensagem junto ao campo.
- No client, `src/pages/` só contém rotas finas; a lógica e os componentes ficam em `src/features/<feature>/` (arquivos de teste dentro de `pages/` virariam rotas).
