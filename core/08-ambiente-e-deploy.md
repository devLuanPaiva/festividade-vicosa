# 08 — Ambiente local e deploy

## Variáveis de ambiente
| Variável | Onde | Para quê |
|----------|------|----------|
| `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME` | `.env` na raiz | Credenciais do Postgres; o compose repassa para o container `db` e para a API |
| `JWT_SECRET` | `.env` na raiz | Segredo para assinar os tokens de login (mínimo de 32 caracteres, gerado aleatoriamente) |
| `JWT_EXPIRES_IN` | `.env` na raiz | Validade do token de acesso (padrão `15m`) |
| `REFRESH_TOKEN_EXPIRES_IN_DAYS` | `.env` na raiz | Validade do token de renovação, em dias (padrão `7`, máximo `90`) |
| `GOOGLE_CLIENT_ID` | `.env` na raiz e `client/.env` | ID do cliente OAuth do Google (opcional; sem ele o login com Google fica indisponível) |
| `GOOGLE_CLIENT_SECRET`, `SITE_URL` | `client/.env` | Segredo do cliente OAuth (só o client usa) e endereço público do site, usado na URL de retorno `SITE_URL/admin/login/google/callback` |
| `CORS_ORIGIN` | `.env` na raiz | Origens permitidas, separadas por vírgula (produção: `https://painel.jocevs.com.br`) |
| `API_DOMAIN` | `.env` na raiz | Domínio público da API (Caddy emite o certificado); produção: `api.jocevs.com.br` |
| `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | `.env` na raiz e `api/.env` | Credenciais do usuário IAM da API e a região do bucket. **Só a API usa.** Em branco, a API sobe normalmente e o envio de imagem responde `STORAGE_NOT_CONFIGURED` |
| `S3_BUCKET` | `.env` na raiz e `api/.env` | Nome do bucket (padrão `jocevs`) |
| `MEDIA_PUBLIC_URL` | `.env` na raiz, `api/.env` e variáveis do painel na Vercel | Endereço público das imagens, sem barra no final (padrão `https://cdn.jocevs.com.br`) |
| `S3_ENDPOINT` | `.env` na raiz e `api/.env` | Opcional: endereço de um servidor compatível com S3 para testes locais; vazio na AWS |
| `DATABASE_HOST`, `DATABASE_PORT`, `PORT`, `NODE_ENV` | `api/.env` (fora do Docker) | Rodar a API direto com `npm run start:dev` |

A API valida tudo na subida (`api/src/config/environment.ts`) e **não sobe** com variável faltando ou inválida. Nenhum `.env` é versionado; use os `.env.example`.

## AWS: bucket, IAM e CloudFront
A API é a única que fala com o S3 (ADR-02). O navegador só lê as imagens pelo CloudFront.

1. **Bucket `jocevs`**: privado, com *Block all public access* ligado e sem ACL. As pastas nascem sozinhas quando a API grava (ver ADR-06).
2. **Usuário IAM da API**: só pode escrever e apagar neste bucket (nada de leitura, listagem ou outros serviços):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "ApiWritesMedia",
         "Effect": "Allow",
         "Action": ["s3:PutObject", "s3:DeleteObject"],
         "Resource": "arn:aws:s3:::jocevs/*"
       }
     ]
   }
   ```
   A chave de acesso desse usuário vai para `AWS_ACCESS_KEY_ID` e `AWS_SECRET_ACCESS_KEY` no `.env` do servidor. Nunca no repositório, no client nem no chat.
3. **Certificado (ACM)** para `cdn.jocevs.com.br`, na região `us-east-1` (exigência do CloudFront).
4. **CloudFront**: origem no bucket `jocevs` com *Origin Access Control* (OAC), nome alternativo `cdn.jocevs.com.br`, certificado do passo 3, redirecionar HTTP para HTTPS e a política de cache *CachingOptimized* (os arquivos nunca mudam de nome).
5. **Política do bucket** para o CloudFront ler (troque `ACCOUNT_ID` e `DISTRIBUTION_ID`):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "CloudFrontReadsMedia",
         "Effect": "Allow",
         "Principal": { "Service": "cloudfront.amazonaws.com" },
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::jocevs/*",
         "Condition": {
           "StringEquals": {
             "AWS:SourceArn": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
           }
         }
       }
     ]
   }
   ```
6. **Route 53**: registro `cdn` (alias A/AAAA) para a distribuição, `api` para o IP elástico da EC2 e `painel` e o apex para a Vercel.
7. No servidor: `AWS_REGION` (a região do bucket), as duas chaves, `S3_BUCKET=jocevs` e `MEDIA_PUBLIC_URL=https://cdn.jocevs.com.br`. Para o login com Google no painel, `SITE_URL=https://painel.jocevs.com.br` e a URL de retorno `https://painel.jocevs.com.br/admin/login/google/callback` cadastrada no console do Google.

As rotas de foto aceitam JPG, PNG ou WebP de até 10 MB e têm limite de 20 envios por minuto.

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
5. Conferir `https://api.jocevs.com.br/health`.

As migrations rodam sozinhas quando a API sobe (`migrationsRun`). Cada feature traz a sua migration e a sua entidade (arquivos `*.entity.ts`), então o esquema cresce junto com o código.

## Criar um administrador
A API não cria nenhum usuário sozinha. O primeiro administrador (e qualquer outro, depois) nasce de um script interativo, que pergunta no terminal e cria o usuário com o papel `ADMIN`:

- **Local:** `cd api && npm run create:admin`.
- **Produção (EC2):** `docker compose -f docker-compose.yml exec api node dist/cli/create-admin/run-create-admin.js` (ou `npm run create:admin:prod` dentro do container).

O script pede **nome completo**, **e-mail**, **senha** e a **confirmação da senha** (a senha não aparece enquanto você digita), mostra um resumo e só cria depois que você responde `s`. Ele valida na hora, com as mesmas regras do `POST /users`: e-mail válido e ainda não usado (sem diferenciar maiúsculas) e senha de 6 a 128 caracteres; se algo estiver errado, pergunta de novo. `Ctrl+C` cancela sem criar nada.

- Usa os serviços da própria API (sem HTTP, sem login), então precisa do banco acessível (no local, `docker compose up -d db` e o `api/.env`). Se o banco estiver vazio, as migrations rodam antes.
- Pode ser executado quantas vezes for preciso, por exemplo para recuperar o acesso quando ninguém consegue entrar.
- O login com Google só funciona para e-mails que já existem como usuário; crie o administrador com o e-mail da conta Google que ele vai usar.

## Dados de demonstração
`cd api && npm run seed:demo` popula a edição 2026 com dados fictícios para ver o portal funcionando: 88 times (8 por categoria, em dois grupos), 142 partidas no calendário real (4 a 6/12 handebol, 9 a 19/12 futsal), resultados em parte das categorias, classificados confirmados e dois mata-matas completos (Handebol Adulto Masculino e Futsal Adulto, este com semifinal decidida nos pênaltis). As demais categorias ficam em estágios diferentes: só agendadas, jogos parciais (uma com W.O.), grupos encerrados e chaveamento gerado sem jogar.

- É uma ferramenta **só para o localhost**: fica em `api/src/database/demo/`, **sem testes** e fora da cobertura (de propósito, para não pesar no `npm run verify`).
- O seed usa os **serviços da própria API** (sem HTTP), então respeita as regras de negócio (vencedor, desempate, sugestões confirmadas do chaveamento). Os dados são sempre os mesmos (semente fixa).
- `npm run seed:demo -- --reset` **apaga todas as partidas, times e grupos** das categorias da edição e recria. Recusa rodar com `NODE_ENV=production`.
- Sem `--reset`, o seed para se alguma categoria já tem times.
- Como o upload de fotos ainda não existe, `photo_key` dos times e `best_player_photo_key` guardam **URL completa**: fotos do Wikimedia Commons para os times e avatares gerados (DiceBear) para os melhores jogadores, que são nomes fictícios. Quando o resource de fotos existir, o client deve aceitar os dois formatos (chave do S3 ou URL absoluta) e os dados reais usarão só a chave.
- Antes de divulgar o portal, rode `--reset` e apague os dados de demonstração pelo painel, ou recrie o banco.

Créditos das fotos do Wikimedia Commons (licenças que exigem atribuição):

| Modalidade | Foto | Autor | Licença |
|-----------|------|-------|---------|
| Handebol | [Mara Friton 2006](https://commons.wikimedia.org/wiki/File:Mara_Friton_2006.jpg) | Armin Kuebelbeck | CC BY-SA 3.0 |
| Handebol | [Faroese handball match 2010 VB vs Tjaldur](https://commons.wikimedia.org/wiki/File:Faroese_handball_match_2010_VB_vs_Tjaldur.JPG) | Eileen Sandá | CC BY-SA 3.0 |
| Handebol | [Bdp Handball](https://commons.wikimedia.org/wiki/File:Bdp_Handball.jpg) | Rune Moyo | CC BY-SA 4.0 |
| Futsal | [Futebol Salao Pan2007](https://commons.wikimedia.org/wiki/File:Futebol_Salao_Pan2007.jpg) | Wilson Dias/ABr | CC BY 3.0 br |
| Futsal | [Futsal indoor](https://commons.wikimedia.org/wiki/File:Futsal_indoor.jpg) | Christopherjeffrey04 | CC BY-SA 4.0 |
| Futsal | [Kazakhstan National Futsal Team Training](https://commons.wikimedia.org/wiki/File:Kazakhstan_National_Futsal_Team_Training.jpg) | Ashina | CC BY-SA 4.0 |
| Futsal | [2025 FIFA Futsal Women’s World Cup Brazil v Panama](https://commons.wikimedia.org/wiki/File:2025_FIFA_Futsal_Women%27s_World_Cup_Brazil_v_Panama.jpg) | Patrick Cristiano | CC BY 4.0 |
| Futsal | [SMSC FUTSAL TOURNAMENT 2023 119](https://commons.wikimedia.org/wiki/File:SMSC_FUTSAL_TOURNAMENT_2023_119.jpg) | চিত্রকথক | CC BY-SA 4.0 |

## Ainda por fazer
- Backup diário do Postgres para o S3 (ADR-04): feature à parte.
- Alarme no CloudWatch e snapshot do EBS antes do evento.
