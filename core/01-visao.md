# 01 — Visão

## Contexto
Viçosa é um município do interior do Rio Grande do Norte. Em dezembro acontece a festividade
de aniversário/emancipação política, composta por vários eventos encadeados.
Planejamento iniciado em 20/10/2026 (cerca de 6–8 semanas antes do evento).

## Problema / ideia
Um portal público para acompanhar a festividade, mais um painel administrativo para o organizador
manter tudo atualizado em tempo real.

## Objetivos
1. Divulgar a programação completa.
2. Publicar resultados dos jogos (e tabelas/classificação) durante o campeonato.
3. Exibir fotos durante todo o evento.
4. Contar a história da festividade.
5. Ser interativo e **prender o usuário na plataforma** (foco em mobile). Ações de interação ficam como evolução futura; ainda não há definição.
6. Dar ao organizador um painel administrativo que gerencie todo o conteúdo.

## Atores
| Ator | Acesso | Descrição |
|------|--------|-----------|
| Visitante (população) | Livre, sem cadastro | Consulta programação, resultados, fotos, história; interage |
| Administrador | Autenticado | Gerencia todo o conteúdo no painel (perfis/papéis **a confirmar**) |

## Calendário (dezembro)
| Dia(s) | Evento |
|--------|--------|
| 4–6 | JOCEV — Handebol |
| 8 | JOCEV — Festival Cultural |
| 9–19 | JOCEV — Futsal |
| 13 | JOCEV — Vôlei de areia (1 dia) **e** Corrida de Emancipação Política (1 dia) |
| 20 | Ecopedal (1 dia) |
| 27–28 | Festa de Emancipação Política |

**JOCEV** = Jornada Cultural e Esportiva de Viçosa: campeonato de futsal, handebol e vôlei
(mais o festival cultural). Abre a festividade.

## Escopo (rascunho)
**Dentro:** landing com identidade visual e história do evento (fotos e fatos); jogos (agendados e finalizados, com placar, melhor jogador e mural de fotos por partida); programação por sub-evento e data, com galeria separada; painel admin.
**Fora:** venda de ingressos, pagamentos, inscrições online (Corrida e Ecopedal são só divulgação e galeria), súmula, artilharia e cartões (só placar). Interação com o público: futura.

## Premissas e riscos
- Prazo curto: o MVP precisa estar no ar **antes do dia 4/12** (primeiro jogo).
- Pico de acesso durante os jogos e festa: o portal deve ser leve e funcionar bem no celular, com internet móvel no interior.
- Quem atualiza resultados/fotos durante o evento precisa de um fluxo rápido (celular, poucos cliques).

## Pendência crítica
A **identidade visual ainda não foi fornecida** (logo, cores, tipografia). Construir com design tokens trocáveis (cores e fonte em um só lugar) para aplicá-la quando chegar sem retrabalho.
