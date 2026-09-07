# Balance (300 meetings per matchup)

Greedy players on both sides. "first" is the first stack; "road N" is the best legal stack from light up to that region's tier; "full" is the best from everything.

| Region | Node | diff | first | road N | full |
| --- | --- | --- | --- | --- | --- |
| 1 | t1 train | 0.50 | 78% | 97% | 100% |
| 1 | n1a npc | 0.40 | 95% | 99% | 100% |
| 1 | n1b npc | 0.45 | 96% | 99% | 100% |
| 1 | n1c npc | 0.50 | 49% | 80% | 100% |
| 1 | g1 keeper | 0.65 | 14% | 48% | 100% |
| 2 | t2 train | 0.58 | 51% | 98% | 100% |
| 2 | n2a npc | 0.50 | 54% | 98% | 100% |
| 2 | n2b npc | 0.55 | 50% | 99% | 100% |
| 2 | n2c npc | 0.60 | 0% | 56% | 99% |
| 2 | g2 keeper | 0.65 | 0% | 49% | 100% |
| 3 | t3 train | 0.66 | 14% | 95% | 100% |
| 3 | n3a npc | 0.60 | 10% | 90% | 100% |
| 3 | n3b npc | 0.65 | 7% | 99% | 100% |
| 3 | n3c npc | 0.65 | 0% | 61% | 99% |
| 3 | g3 keeper | 0.85 | 0% | 47% | 100% |
| 4 | t4 train | 0.74 | 0% | 90% | 100% |
| 4 | n4a npc | 0.65 | 0% | 89% | 99% |
| 4 | n4b npc | 0.70 | 0% | 86% | 100% |
| 4 | n4c npc | 0.70 | 0% | 71% | 100% |
| 4 | g4 keeper | 0.65* | 0% | 45% | 95% |
| 5 | t5 train | 0.82 | 0% | 86% | 99% |
| 5 | n5a npc | 0.70 | 0% | 79% | 99% |
| 5 | n5b npc | 0.80 | 0% | 63% | 99% |
| 5 | n5c npc | 0.80 | 0% | 53% | 100% |
| 5 | g5 keeper | 0.75* | 0% | 39% | 100% |
| 6 | t6 train | 0.90 | 0% | 94% | 98% |
| 6 | n6a npc | 0.75 | 0% | 94% | 100% |
| 6 | n6b npc | 0.85 | 0% | 90% | 97% |
| 6 | n6c npc | 0.85 | 0% | 89% | 99% |
| 6 | g6 keeper | 0.75* | 0% | 26% | 67% |
| 7 | t7 train | 0.98 | 0% | 97% | 98% |
| 7 | n7a npc | 0.80 | 0% | 97% | 96% |
| 7 | n7b npc | 0.90 | 0% | 84% | 83% |
| 7 | n7c npc | 0.90 | 0% | 38% | 40% |
| 7 | g7 keeper | 0.55* | 0% | 29% | 32% |
| 7 | c7a corp | 0.75* | – | 78% | 71% |
| 7 | c7b corp | 0.75* | – | 42% | 44% |
| 8 | h1 hall | 0.55* | – | 43% | 47% |
| 8 | h2 hall | 0.75* | – | 39% | 37% |
| 8 | h3 hall | 0.95* | – | 57% | 54% |

## Targets

| Target | Result | Pass |
| --- | --- | --- |
| first stack vs region-1 Train 75–85% | 78% | yes |
| Keeper 1 vs region-1 stack 45–55% | 48% | yes |
| Keeper 7 vs full-road stack 25–35% | 32% | yes |
| Keeper curve monotonic (road stacks) | 48 → 49 → 47 → 45 → 39 → 26 → 29 | yes |
