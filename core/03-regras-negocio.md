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
- **RN-12** Formato: **fase de grupos** seguida de **mata-mata**.
- **RN-13** Um time pertence a **uma categoria** e, nela, a **um grupo**. Cada inscrição em uma categoria é um time distinto.
- **RN-14** *(removida: vôlei de areia não tem campeonato no sistema.)*
- **RN-15** Partida: dois times diferentes da mesma categoria; fase `GROUP` (mesmo grupo) ou `KNOCKOUT` (rodada: oitavas/quartas/semi/final/3º lugar).
- **RN-16** Estados da partida: `SCHEDULED` → `FINALIZED` (e `POSTPONED`/`CANCELED`, a confirmar). Só partida `FINALIZED` conta na classificação.
- **RN-17** O registro é **somente o placar final** (sem súmula, gols individuais, cartões, nem placar ao vivo). O público só vê o resultado depois de finalizada.
- **RN-18** Cada partida pode ter **um melhor jogador, de forma opcional** (há partidas sem). Ele é informado por nome + foto e **vinculado a um dos dois times da partida**. Não existe cadastro de elenco. A partida também pode ter um **mural de fotos**.
- **RN-19** A classificação do grupo é **derivada** dos resultados (nunca digitada): pontos, jogos, V/E/D, pontos pró/contra, saldo.
- **RN-20** Pontuação na fase de grupos: **vitória = 3, empate = 1, derrota = 0** (futsal e handebol).
- **RN-21** Quantos times classificam por grupo: **a definir** (grupos ainda não formados; depende de número de equipes por categoria). Critérios de desempate: **(a confirmar)**.
- **RN-22** No mata-mata não há empate: se o placar empata, **o placar dos pênaltis é registrado** e define o vencedor. Pênaltis só valem no mata-mata; na fase de grupos o empate vale 1 ponto.
- **RN-24** Os pênaltis não alteram o placar do jogo (ex.: 2x2, pênaltis 4x3), e não entram nos pontos pró/contra da classificação.
- **RN-23** Corrigir placar de partida finalizada é permitido e recalcula a classificação.

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
