# 99 — Perguntas abertas

Marque `[x]` quando resolvida e mova a decisão para o doc correspondente.

## Resolvidas
- [x] Interação com o público → nada definido; fica como evolução futura (RF-13). Meta é reter o usuário, principalmente no mobile.
- [x] Categorias do JOCEV → ver RN-11.
- [x] Formato → fase de grupos + mata-mata (RN-12).
- [x] Registro de partida → só placar (RN-17).
- [x] Vôlei, Corrida e Ecopedal → 1 dia cada.
- [x] Pontuação → V=3, E=1, D=0 (RN-20).
- [x] Pênaltis → registra o placar (RN-22, RN-24).
- [x] Vôlei de areia → só galeria; sem placar nem times.
- [x] Placar → só resultado final, sem ao vivo.
- [x] Usuários → vários; papéis Admin, Gerente, Assistente; permissões ajustáveis por usuário (RN-40 a RN-47).
- [x] Corrida e Ecopedal → só divulgação e galeria.
- [x] Melhor jogador → opcional por partida, vinculado a um time, sem cadastro de elenco (RN-18).
- [x] Fotos → só a equipe do painel envia (RN-32).
- [x] PWA → sim (RNF-09).
- [x] Infra → S3 + CloudFront + Route 53; conexões partem sempre da API (ADR-01, ADR-02).
- [x] Hospedagem → Next.js na Vercel; API + Postgres + Caddy via docker-compose numa EC2 (ADR-03).
- [x] Banco → PostgreSQL em container, TypeORM com migrations, backup diário para o S3 (ADR-04).
- [x] Volume de fotos → ~20 por partida, ~180 partidas, ~2.500 no total (~2 GB em variantes WebP).
- [x] "claude front" = CloudFront e "router 53" = Route 53.
- [x] Evento roda ~1 mês, com domínio próprio.

## Cliente / negócio
- [ ] **Identidade visual** (logo, cores, fontes): quando será entregue? Bloqueia o acabamento do front.
- [ ] Quem organiza (prefeitura, secretaria, comissão)? Quantas pessoas vão operar o painel e com quais papéis?
- [ ] Conteúdo da história: quem fornece textos, fatos e fotos? Existe um acervo?
- [ ] Festival Cultural (dia 8) e Festa de Emancipação (27–28): programação com atrações, horários e local?
- [ ] Patrocinadores/apoiadores precisam aparecer no portal?
- [ ] Futsal 9–19: jogos todos os dias ou há dias sem jogo? Vôlei e corrida no dia 13 coincidem com jogos de futsal?

## JOCEV (regras do campeonato)
- [ ] **Desempate** na fase de grupos (RN-21): resposta virá junto com a formação dos grupos.
- [ ] **Quantos classificam por grupo**: aguardando a formação dos grupos pela organização.
- [ ] Mata-mata empatado: há prorrogação antes dos pênaltis? (só afeta o texto da regra, não o sistema)
- [ ] Quantas equipes e quantos grupos por categoria? As equipes são de bairros, comunidades, escolas?
- [ ] Partidas adiadas ou canceladas precisam aparecer como tal?

## Técnico
- [ ] **Domínio:** qual é, e onde está registrado (Registro.br, GoDaddy...)? Se não for na AWS, é preciso apontar os nameservers para o Route 53.
- [ ] **Orçamento mensal de nuvem** (estimativa no resumo da conversa: ~US$ 18/mês).
- [ ] Projeto é comercial (patrocínio/contrato)? Define se a Vercel Hobby serve ou precisa do Pro.
- [ ] **Permissões de cada papel**: validar a proposta da tabela em `05-modelo-dominio.md`.
- [ ] Quem será o primeiro Admin? (o sistema cria o usuário no primeiro boot a partir de variáveis de ambiente, ver `07-modelo-dados.md`)
- [x] JWT de 12 h sem refresh token: adotado no MVP (reavaliar se necessário).
- [ ] Login por e-mail e senha serve, ou os assistentes precisam de algo mais simples (ex.: PIN)?
