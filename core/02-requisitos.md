# 02 — Requisitos

Prioridade: **P1** = MVP (no ar antes de 4/12) · **P2** = desejável · **P3** = futuro.

## Funcionais — portal público
| ID | Requisito | Prio |
|----|-----------|------|
| RF-01 | Landing page com identidade visual do evento e linha do tempo/história (fatos históricos + fotos) | P1 |
| RF-02 | Listar a programação por sub-evento e por data | P1 |
| RF-03 | Galeria de fotos separada por sub-evento e data | P1 |
| RF-04 | Listar jogos de futsal e handebol, filtrando por modalidade, categoria, fase, grupo, status e data | P1 |
| RF-05 | Exibir partida: times, placar, fase, horário/local, **melhor jogador (nome + foto)** e mural de fotos da partida | P1 |
| RF-06 | Exibir classificação de cada grupo (calculada a partir dos resultados) | P1 |
| RF-07 | Exibir chaveamento do mata-mata por categoria, em formato de chave: lado A e lado B diminuindo até a final no centro | P1 |
| RF-08 | Exibir página do time: nome, categoria, foto, grupo e partidas | P1 |
| RF-09 | Destacar "próximos jogos" e "últimos resultados" na home | P1 |
| RF-10 | Vôlei de areia, Corrida e Ecopedal: página de divulgação + galeria (sem inscrição, placar nem ranking) | P1 |
| RF-11 | Compartilhar partida/foto por link (WhatsApp) | P2 |
| RF-12 | Favoritar time e ver "meus times" (sem login, salvo no aparelho) | P3 |
| RF-13 | Interações com o público (a definir: enquete, palpite…). Envio de fotos pelo público está fora de escopo. | P3 |
| RF-14 | Baixar as fotos da galeria e do mural da partida, uma a uma (no visualizador) ou várias de uma vez (selecionar e baixar); o arquivo baixado leva um nome legível | P1 |

## Funcionais — painel administrativo
| ID | Requisito | Prio |
|----|-----------|------|
| RF-20 | Login de administrador | P1 |
| RF-21 | CRUD de edição, sub-eventos e programação (data, horário, local, descrição) | P1 |
| RF-22 | CRUD de modalidades, categorias, grupos e times (com foto) | P1 |
| RF-23 | Cadastrar partidas da fase de grupos e do mata-mata | P1 |
| RF-24 | Lançar/corrigir o placar final e finalizar partida (fluxo rápido no celular); no mata-mata empatado, registrar pênaltis | P1 |
| RF-25 | Definir melhor jogador da partida (nome + foto) | P1 |
| RF-26 | Upload de fotos para sub-evento/data e para partida; remover/reordenar | P1 |
| RF-27 | CRUD da história (itens da linha do tempo com fotos) | P1 |
| RF-28 | Sugerir as partidas da fase de grupos (todos contra todos) para a organização revisar, ajustar e confirmar; nada é criado sem confirmação | P2 |
| RF-29 | Sugerir o chaveamento (a partir dos 16 avos de final) e as partidas das rodadas seguintes para a organização revisar, ajustar e confirmar; nada é criado sem confirmação | P2 |
| RF-30 | Gerir usuários (criar, desativar, definir papel: Admin, Gerente, Assistente) | P1 |
| RF-31 | Gerir permissões: ajustar as permissões de um papel e conceder/revogar permissões para um usuário específico | P1 |
| RF-32 | Toda ação do painel e toda tela respeitam as permissões efetivas do usuário (API e interface) | P1 |

## Não funcionais
| ID | Requisito |
|----|-----------|
| RNF-01 | **Mobile-first**: uso principal em celular; layout testado a partir de 360px |
| RNF-02 | Desempenho em rede móvel fraca: imagens otimizadas (redimensionadas, WebP, lazy-load) |
| RNF-03 | Picos nos dias de jogo não podem derrubar o site. Páginas públicas **sem cache de dados por enquanto** (decisão de 25/10/2026); reavaliar com teste de carga antes de 4/12 (cache curto no servidor, SSG/ISR) |
| RNF-04 | Resultado publicado no portal em até ~1 min após finalizar a partida (cache invalidado ao finalizar). Sem tempo real. |
| RNF-05 | Painel admin protegido (autenticação, senha com hash, HTTPS) |
| RNF-06 | Identidade visual aplicada via design tokens trocáveis |
| RNF-07 | Acessibilidade básica (contraste, textos alternativos) |
| RNF-08 | Portal público sem cadastro e sem coleta de dados pessoais do visitante |
| RNF-09 | **PWA**: instalável na tela inicial, ícone/splash com a identidade do evento, casca do app e assets estáticos em cache; dados de jogos sempre buscados da rede (nunca resultado velho). Prioridade P2. |
| RNF-10 | **O client nunca acessa serviços de infraestrutura diretamente** (banco, S3 etc.); toda conexão parte da API (ver ADR-02) |
