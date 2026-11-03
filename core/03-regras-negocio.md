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
- **RN-15** Partida: dois times diferentes da mesma categoria; fase `GROUP` (mesmo grupo) ou `KNOCKOUT` (rodada: 16 avos/oitavas/quartas/semi/final/3º lugar).
- **RN-16** Estados da partida: `SCHEDULED` → `FINALIZED` (e `POSTPONED`/`CANCELED`, a confirmar). Só partida `FINALIZED` conta na classificação.
- **RN-17** O registro é **somente o placar final** (sem súmula, gols individuais, cartões, nem placar ao vivo). O público só vê o resultado depois de finalizada.
- **RN-18** Cada partida pode ter **um melhor jogador, de forma opcional** (há partidas sem). Ele é informado por nome + foto e **vinculado a um dos dois times da partida**. Não existe cadastro de elenco. A partida **não tem mural de fotos** (decisão de 03/11/2026). Sem foto do melhor jogador, o portal mostra um avatar padrão feliz; na categoria feminina, uma boneca feliz (RN-53).
- **RN-19** A classificação do grupo é **derivada** dos resultados (nunca digitada): pontos, jogos, V/E/D, pontos pró/contra, saldo.
- **RN-20** Pontuação na fase de grupos: **vitória = 3, empate = 1, derrota = 0** (futsal e handebol).
- **RN-21** Desempate pelo edital (ART. 16), sempre depois dos pontos e isolado em `tie-break.rule.ts`. **ART. 15:** em empate de pontos, quem faltou a algum jogo (W.O. sofrido ou W.O. dos dois) fica atrás de quem cumpriu todos. **Entre 2 times:** menos gols sofridos, mais gols feitos, confronto direto (o saldo vem depois, mas é redundante com os dois primeiros). **Entre 3 ou mais:** menos gols sofridos, maior saldo só nos jogos entre os empatados, mais gols feitos. Se o empate cai para 2 times no meio do desempate, recomeça pela regra de 2 times (interpretação nossa; o edital é omisso). **Sem sorteio no sistema:** se os critérios não separam os times, a tabela os marca como empatados (`tied`) e ordena por nome só para exibir; a equipe técnica decide na confirmação dos classificados (RN-29).
- **RN-22** No mata-mata não há empate: se o placar empata, **o placar dos pênaltis é registrado** e define o vencedor. Pênaltis só valem no mata-mata; na fase de grupos o empate vale 1 ponto.
- **RN-24** Os pênaltis não alteram o placar do jogo (ex.: 2x2, pênaltis 4x3), e não entram nos pontos pró/contra da classificação.
- **RN-23** Corrigir placar de partida finalizada é permitido e recalcula a classificação.
- **RN-25** Uma partida pode terminar em **W.O.**: vitória do time que compareceu (3 pontos) e sem melhor jogador. Na classificação o W.O. vale **2x0**, em futsal e em handebol: 2 gols pró para quem compareceu e 2 contra para o ausente, que entram no saldo. O placar da partida fica nulo. Conta como jogo para os dois times.
- **RN-27** **Sugestão de chaveamento (RF-29):** o organizador informa de 2 a 32 times (2, 4, 8, 16 ou 32), do melhor para o pior cabeça de chave, e o sistema **sugere** a primeira rodada: o 1º enfrenta o último, o 2º o penúltimo, e os melhores cabeças só se cruzam nas rodadas finais (32 times: 16 avos de final; 16: oitavas; 8: quartas; 4: semifinais; 2: final). A sugestão **não grava nada**: a organização revisa, troca times, define data, hora e local, desmarca o que não servir e só então confirma, e a partir daí as partidas existem. Cada categoria tem um chaveamento. Partidas de mata-mata cadastradas à mão continuam permitidas e ficam fora da sugestão.
- **RN-28** **Sugestão das rodadas seguintes (RF-29):** quando as duas partidas que alimentam uma partida da próxima rodada estão finalizadas, o sistema **sugere** essa partida com os dois vencedores (dos perdedores das semifinais, a disputa de 3º lugar), com a data da mais tardia das duas como valor inicial. A organização revisa e confirma; nada é criado sozinho. Se um resultado é corrigido e a partida seguinte, ainda agendada, ficou com times diferentes dos vencedores, o sistema sugere atualizá-la, também sujeito à confirmação. Partida seguinte já finalizada nunca é sugerida nem alterada.
- **RN-29** **Classificados confirmados pela equipe técnica:** quantos times classificam varia por grupo (um grupo pode classificar 1 e outro 2, conforme o número de equipes e de grupos), então o número não é fixo. Quem tem permissão confirma, por grupo, a lista ordenada de classificados (`PUT /groups/:id/qualified`), pode mudar a lista ao longo do campeonato e decide os empates que o sistema não resolve. A tabela mostra a posição confirmada de cada time (`qualifiedPosition`). A `GET /categories/:categoryId/seeding` sugere a ordem de cabeças de chave: primeiro os 1º colocados de cada grupo, depois os 2º, e assim por diante; na mesma posição, mais pontos, menos gols sofridos, mais gols feitos (critérios dos melhores segundos do edital) e nome. O organizador envia os `teamIds` ao gerar o chaveamento (RN-27) e pode reordenar.
- **RN-30** **Sugestão da fase de grupos (RF-28):** para cada grupo, o sistema sugere os confrontos todos contra todos que ainda não têm partida (cada dupla uma vez), agrupados em rodadas em que nenhum time joga duas vezes. Data, hora e local ficam por conta da organização, que revisa e confirma antes de qualquer partida ser criada.
- **RN-26** **W.O. dos dois times** (nenhum compareceu): sem vencedor, derrota e 0 ponto para os dois, sem gols (o edital é omisso). Só existe na fase de grupos; no mata-mata alguém precisa avançar.

## Conteúdo e acesso
- **RN-30** Todo o portal público é de acesso livre, sem login.
- **RN-31** Somente usuário autenticado **com a permissão adequada** cria, edita ou exclui conteúdo.
- **RN-32** Foto da galeria pertence a um **sub-evento** (sem separação por dia nem por partida), ou a um item da história. **Só a equipe do painel envia fotos** (Admin, Gerente e Fotógrafo); o público não envia (sem moderação).
- **RN-33** Excluir um time com partidas é bloqueado (as partidas devem ser removidas antes).

## Usuários, papéis e permissões
O controle de acesso é baseado em **permissões**; o grupo (papel) é só um pacote padrão delas.

- **RN-40** Existem **permissões** atômicas (ex.: `match:record-score`). O sistema as define; o administrador não cria permissões novas.
- **RN-41** Um **grupo** (papel) agrupa permissões. Os grupos padrão são Administrador, Gerente, Assistente e Fotógrafo; quem gerencia permissões pode criar, renomear e excluir outros grupos. Um usuário pertence a **um ou mais grupos** e um deles é o **principal**; as permissões do grupo somam-se.
- **RN-42** Além do papel, o usuário pode ter **concessões** (permissão extra) e **revogações** (permissão removida) individuais.
- **RN-43** **Permissões efetivas = (permissões de todos os grupos + concessões) − revogações.** A revogação prevalece sobre a concessão.
- **RN-44** Mudar as permissões de um grupo vale para todos os usuários dele, sem apagar concessões/revogações individuais.
- **RN-45** Só quem tem `user:manage-permissions` atribui ou remove permissões e grupos. Ninguém altera as próprias permissões, nem os próprios grupos, nem as permissões de um grupo a que pertence.
- **RN-46** Deve existir sempre pelo menos **um usuário ativo** com `user:manage-permissions` (bloqueia remover o último).
- **RN-47** Usuário que já lançou resultado ou enviou foto é **desativado**, não excluído, para preservar o histórico. Só é possível excluir um usuário sem histórico, e nunca a si mesmo.
- **RN-49** Os grupos padrão do sistema não podem ser excluídos. Um grupo só é excluído quando não tem mais usuários.
- **RN-50** **Local da partida:** só futsal e handebol têm local, escolhido entre `SQUARE_1` (Praça 1), `SQUARE_2` (Praça 2) e `GYMNASIUM` (Ginásio), gravado na **partida** e opcional. O rótulo em português fica no client.
- **RN-51** **Transmissão ao vivo (RF-15):** as lives são cadastradas pelo Admin (link não listado do YouTube, arte de preview, data e hora de início). **No máximo uma live ativa por vez**; ativar outra desativa a anterior (a final pode ter uma live nova). A seção da landing só existe enquanto há uma live ativa; desativar a live desliga a seção.
- **RN-52** **Player sempre disponível:** a live não tem estado por horário. Com a seção ligada, o player aparece mesmo antes do início; a contagem regressiva, que usa a data e hora de início, é só informativa e some ao zerar. Quem dá o play é o visitante; se não houver transmissão, vale o aviso do YouTube. A API só aceita link do YouTube e extrai o identificador do vídeo. Datas em UTC, exibidas no horário de Fortaleza.
- **RN-53** **Exibição:** nomes de categoria com "Sub-" aparecem sem o hífen ("Sub 15"); o valor gravado e os slugs não mudam. O melhor jogador sem foto usa um avatar feliz, e a boneca quando a categoria é feminina (`gender`).
- **RN-54** O papel **Fotógrafo** tem acesso apenas à galeria de todos os sub-eventos (`photo:upload` e `photo:delete`); não vê o resto do painel.
- **RN-48** As permissões de cada papel **(a confirmar com o cliente)**; ver rascunho em [05-modelo-dominio.md](05-modelo-dominio.md).
