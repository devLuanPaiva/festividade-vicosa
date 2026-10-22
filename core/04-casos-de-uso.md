# 04 — Casos de uso

## Diagrama geral
```mermaid
flowchart LR
  V([Visitante])
  A([Administrador])

  subgraph PUB[Portal público]
    UC01(UC-01 Ver landing e história)
    UC02(UC-02 Ver programação)
    UC03(UC-03 Ver galeria por sub-evento e data)
    UC04(UC-04 Consultar jogos e filtrar)
    UC05(UC-05 Ver detalhe da partida)
    UC06(UC-06 Ver classificação e chaveamento)
    UC07(UC-07 Ver página do time)
  end

  subgraph ADM[Painel administrativo]
    UC10(UC-10 Autenticar)
    UC11(UC-11 Gerir programação e sub-eventos)
    UC12(UC-12 Gerir categorias, grupos e times)
    UC13(UC-13 Cadastrar partidas)
    UC14(UC-14 Lançar placar e finalizar partida)
    UC15(UC-15 Definir melhor jogador)
    UC16(UC-16 Gerir fotos e álbuns)
    UC17(UC-17 Gerir história)
    UC18(UC-18 Gerir usuários)
    UC19(UC-19 Gerir permissões)
  end

  V --- UC01 & UC02 & UC03 & UC04 & UC05 & UC06 & UC07
  A --- UC10
  A --- UC11 & UC12 & UC13 & UC14 & UC15 & UC16 & UC17 & UC18 & UC19
  UC11 & UC12 & UC13 & UC14 & UC16 & UC17 & UC18 & UC19 -. exige .-> UC10
  UC14 -. estende .-> UC15
  UC04 -. leva a .-> UC05
  UC05 -. leva a .-> UC07
```

## Especificação dos principais

### UC-14 Lançar placar e finalizar partida (fluxo crítico)
- **Ator:** Administrador (no celular, durante o jogo)
- **Pré-condição:** autenticado; partida `SCHEDULED` existente.
- **Fluxo principal:**
  1. Admin abre a lista "jogos de hoje" e escolhe a partida.
  2. Informa o placar de cada lado.
  3. Confirma "Finalizar partida".
  4. Sistema grava, marca `FINALIZED` e recalcula a classificação (RN-19).
  5. Portal público passa a exibir o resultado.
- **Alternativos:**
  - A1. Correção de partida já finalizada: reedita o placar; classificação recalculada (RN-23).
  - A2. Mata-mata empatado: sistema exige o placar dos pênaltis, que define o vencedor (RN-22, RN-24).
  - A3. Admin define o melhor jogador logo em seguida (UC-15).
- **Pós-condição:** resultado visível ao público; classificação atualizada.

### UC-05 Ver detalhe da partida
- **Ator:** Visitante
- **Fluxo:** abre a partida → vê times, placar, fase, data/local → vê melhor jogador (nome + foto) → navega pelo mural de fotos → toca em um time (UC-07).
- **Alternativo:** partida `SCHEDULED` mostra só data/local e "Em breve".

### UC-04 Consultar jogos e filtrar
- **Ator:** Visitante
- **Fluxo:** abre "Jogos" → vê abas Próximos / Finalizados → filtra por modalidade, categoria, fase, grupo e data.

### UC-03 Ver galeria por sub-evento e data
- **Ator:** Visitante
- **Fluxo:** abre "Galeria" → escolhe sub-evento → escolhe data → navega pelas fotos.

### UC-13 Cadastrar partidas
- **Ator:** Administrador
- **Fluxo:** escolhe categoria → escolhe fase (grupos/mata-mata) → seleciona dois times, data, hora, local → salva.
- **Regras:** RN-13, RN-15.

### UC-19 Gerir permissões
- **Ator:** Usuário com `user:manage-permissions` (hoje, o Admin)
- **Fluxo A (papel):** escolhe um papel → marca/desmarca permissões → salva; vale para todos os usuários do papel (RN-44).
- **Fluxo B (usuário):** escolhe um usuário → vê as permissões efetivas, com a origem de cada uma (papel, concessão) → concede ou revoga uma permissão → salva.
- **Regras:** RN-42, RN-43, RN-45, RN-46.
- **Alternativo:** tentativa de remover a permissão do último gestor de permissões é bloqueada.

Os demais (UC-01, 02, 06, 07, 10, 11, 12, 15, 16, 17, 18) são consulta ou CRUD simples e serão detalhados quando formos desenhar as telas.
