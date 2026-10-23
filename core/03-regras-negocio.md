# 03 — Regras de negócio

Itens **(a confirmar)** dependem de resposta do cliente (ver [99-perguntas-abertas.md](99-perguntas-abertas.md)).

## Estrutura do evento
- **RN-01** A festividade é organizada por **edição** (ano). Uma edição possui vários **sub-eventos**.
- **RN-02** Tipos de sub-evento: `JOCEV_HANDBALL`, `JOCEV_FUTSAL`, `JOCEV_BEACH_VOLLEYBALL`, `CULTURAL_FESTIVAL`, `EMANCIPATION_RUN`, `ECOPEDAL`, `EMANCIPATION_PARTY`.
- **RN-03** Apenas **futsal e handebol** têm campeonato (times, grupos, partidas e placar). Vôlei de areia, Festival Cultural, Corrida, Ecopedal e Festa são só divulgação + galeria.
- **RN-04** Um sub-evento ocorre em um ou mais dias; a programação é ligada a data.

## Campeonato (JOCEV)
- **RN-10** Cada modalidade com campeonato (futsal, handebol) tem categorias; cada categoria é um campeonato independente.
- **RN-11** Categorias da edição 2026:
  - **Handebol:** 12–14 feminino · cadete feminino · cadete masculino · sub-18 feminino · sub-18 masculino · adulto feminino · adulto masculino
  - **Futsal (só masculino):** sub-13 · sub-15 · sub-18 · adulto (principal)
  - **Vôlei de areia** (só divulgação): dupla adulto masculino, sem times nem partidas no sistema.
- **RN-12** Formato: **fase de grupos** seguida de **mata-mata**. A categoria pode ter **grupo único** (todos contra todos), comum no handebol quando há poucas equipes; o grupo único segue as mesmas regras de classificação.
- **RN-13** Um time pertence a **uma categoria** e, nela, a **um grupo**. Cada inscrição em uma categoria é um time distinto.
- **RN-14** *(removida: vôlei de areia não tem campeonato no sistema.)*
- **RN-15** Partida: dois times diferentes da mesma categoria; fase `GROUP` (mesmo grupo) ou `KNOCKOUT` (rodada: oitavas/quartas/semi/final/3º lugar).
- **RN-16** Estados da partida: `SCHEDULED` → `FINALIZED` (e `POSTPONED`/`CANCELED`, a confirmar). Só partida `FINALIZED` conta na classificação.
- **RN-17** O registro é **somente o placar final** (sem súmula, gols individuais, cartões, nem placar ao vivo). O público só vê o resultado depois de finalizada.
- **RN-18** Cada partida pode ter **um melhor jogador, de forma opcional** (há partidas sem). Ele é informado por nome + foto e **vinculado a um dos dois times da partida**. Não existe cadastro de elenco. A partida também pode ter um **mural de fotos**.
- **RN-19** A classificação do grupo é **derivada** dos resultados (nunca digitada): pontos, jogos, V/E/D, pontos pró/contra, saldo.
- **RN-20** Pontuação na fase de grupos: **vitória = 3, empate = 1, derrota = 0** (futsal e handebol).
- **RN-21** Desempate pelo edital (ART. 16), sempre depois dos pontos e isolado em `tie-break.rule.ts`. **ART. 15:** em empate de pontos, quem faltou a algum jogo (W.O. sofrido ou W.O. dos dois) fica atrás de quem cumpriu todos. **Entre 2 times:** menos gols sofridos, mais gols feitos, confronto direto (o saldo vem depois, mas é redundante com os dois primeiros). **Entre 3 ou mais:** menos gols sofridos, maior saldo só nos jogos entre os empatados, mais gols feitos. Se o empate cai para 2 times no meio do desempate, recomeça pela regra de 2 times (interpretação nossa; o edital é omisso). **Sem sorteio no sistema:** se os critérios não separam os times, a tabela os marca como empatados (`tied`) e ordena por nome só para exibir; a equipe técnica decide na confirmação dos classificados (RN-29).
- **RN-22** No mata-mata não há empate: se o placar empata, **o placar dos pênaltis é registrado** e define o vencedor. Pênaltis só valem no mata-mata; na fase de grupos o empate vale 1 ponto.
- **RN-24** Os pênaltis não alteram o placar do jogo (ex.: 2x2, pênaltis 4x3), e não entram nos pontos pró/contra da classificação.
- **RN-23** Corrigir placar de partida finalizada é permitido e recalcula a classificação.
- **RN-25** Uma partida pode terminar em **W.O.**: vitória do time que compareceu (3 pontos) e sem melhor jogador. Na classificação o W.O. vale **2x0**, em futsal e em handebol: 2 gols pró para quem compareceu e 2 contra para o ausente, que entram no saldo. O placar da partida fica nulo. Conta como jogo para os dois times.
- **RN-27** **Chaveamento do mata-mata:** o organizador informa de 2 a 16 times (2, 4, 8 ou 16), do melhor para o pior cabeça de chave, e o sistema gera a primeira rodada: o 1º enfrenta o último, o 2º o penúltimo, e os melhores cabeças só se cruzam nas rodadas finais (16 times: oitavas; 8: quartas; 4: semifinais; 2: final). Cada categoria tem um chaveamento gerado. Partidas de mata-mata cadastradas à mão continuam permitidas e ficam fora do avanço automático.
- **RN-28** **Avanço automático (RF-29):** quando as duas partidas que alimentam uma partida da próxima rodada estão finalizadas, o sistema cria essa partida com os dois vencedores. Dos perdedores das semifinais nasce a disputa de 3º lugar. A partida criada herda a data da mais tardia das duas anteriores (provisória, ajustável pelo `PATCH`). Corrigir um resultado já finalizado atualiza os times da próxima rodada, exceto se a próxima partida já foi finalizada e o vencedor mudaria (`NEXT_ROUND_ALREADY_PLAYED`): corrija a próxima primeiro.
- **RN-29** **Classificados confirmados pela equipe técnica:** quantos times classificam varia por grupo (um grupo pode classificar 1 e outro 2, conforme o número de equipes e de grupos), então o número não é fixo. Quem tem permissão confirma, por grupo, a lista ordenada de classificados (`PUT /groups/:id/qualified`), pode mudar a lista ao longo do campeonato e decide os empates que o sistema não resolve. A tabela mostra a posição confirmada de cada time (`qualifiedPosition`). A `GET /categories/:categoryId/seeding` sugere a ordem de cabeças de chave: primeiro os 1º colocados de cada grupo, depois os 2º, e assim por diante; na mesma posição, mais pontos, menos gols sofridos, mais gols feitos (critérios dos melhores segundos do edital) e nome. O organizador envia os `teamIds` ao gerar o chaveamento (RN-27) e pode reordenar.
- **RN-26** **W.O. dos dois times** (nenhum compareceu): sem vencedor, derrota e 0 ponto para os dois, sem gols (o edital é omisso). Só existe na fase de grupos; no mata-mata alguém precisa avançar.

## Conteúdo e acesso
- **RN-30** Todo o portal público é de acesso livre, sem login.
- **RN-31** Somente usuário autenticado **com a permissão adequada** cria, edita ou exclui conteúdo.
- **RN-32** Foto pertence a um **álbum**: sub-evento + data, ou partida, ou item da história. **Só a equipe do painel envia fotos**; o público não envia (sem moderação).
- **RN-33** Excluir um time com partidas é bloqueado (as partidas devem ser removidas antes).

## Usuários, papéis e permissões
O controle de acesso é baseado em **permissões**; o papel é só um pacote padrão delas.

- **RN-40** Existem **permissões** atômicas (ex.: `match:record-score`). O sistema as define; o administrador não cria permissões novas.
- **RN-41** Um **papel** (Admin, Gerente, Assistente) agrupa permissões. Cada usuário tem **um papel**.
- **RN-42** Além do papel, o usuário pode ter **concessões** (permissão extra) e **revogações** (permissão removida) individuais.
- **RN-43** **Permissões efetivas = (permissões do papel + concessões) − revogações.** A revogação prevalece sobre a concessão.
- **RN-44** Mudar as permissões de um papel vale para todos os usuários dele, sem apagar concessões/revogações individuais.
- **RN-45** Só quem tem `user:manage-permissions` atribui ou remove permissões. Ninguém altera as próprias permissões.
- **RN-46** Deve existir sempre pelo menos **um usuário ativo** com `user:manage-permissions` (bloqueia remover o último).
- **RN-47** Usuário é **desativado**, não excluído, para preservar o histórico de quem lançou cada resultado.
- **RN-48** As permissões de cada papel **(a confirmar com o cliente)**; ver rascunho em [05-modelo-dominio.md](05-modelo-dominio.md).
