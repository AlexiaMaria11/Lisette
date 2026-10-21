# Tracker de echipă

Link: https://claude.ai/artifact/RQu7u4u4Ntfx7SoPC4ay4o

Tracker-ul echipei (Alexia și Alex) pentru cele 8 săptămâni, de luni 26 octombrie până duminică 20 decembrie 2026. Datele stau în baza de date a artifactului, nu în pagină. Claude le citește și le scrie cu tool-ul `ArtifactData` (acțiunile `list`, `get`, `update`, `set`, `batch`), pe URL-ul de mai sus. La fiecare scriere pe un document existent trebuie trecută versiunea citită (`if_version`).

Pagina se republică doar când se schimbă aspectul sau logica ei. Taskurile, statusurile și obiectivele se modifică numai prin date.

## Colecții

### `features/{fNN}`: funcționalitățile aplicației
| Câmp | Valori |
|---|---|
| `id` | `f01` … `f59` (aceeași valoare ca id-ul documentului) |
| `zona` | `Cont și setări`, `Profiluri`, `Manuscrise și trimiteri`, `Spațiul editurii`, `Comunitate`, `Bibliotecă`, `Hartă, evenimente și descoperiri`, `Notificări, căutare și siguranță`, `Versiunea web` |
| `titlu` | descrierea din perspectiva utilizatorului, fără detalii tehnice |
| `status` | `neinceput` · `partial` · `gata` |
| `prioritate` | `nucleu` · `daca-timp` · `taiat` (propus de tăiat; nu intră în procentul de progres) |
| `responsabil` | `alexia` · `alex` · `amandoua` · `""` (nealocat) |
| `platforma` | `android` · `web` |
| `ordine` | număr, ordinea de afișare |

### `tasks/{id}`: taskurile
| Câmp | Valori |
|---|---|
| `id` | aceeași valoare ca id-ul documentului (`t01` …, iar cele adăugate din pagină au un id generat) |
| `titlu`, `descriere` | text scurt, fără nume de fișiere, componente sau biblioteci |
| `saptamana` | 1 … 8 |
| `responsabil` | `alexia` · `alex` · `amandoua` |
| `ore` | număr (ore estimate; taskurile au de regulă 1–3 ore) |
| `functionalitate` | id-ul unei funcționalități (`fNN`) sau `""` |
| `status` | `de-facut` · `in-lucru` · `gata` |
| `ordine` | număr, ordinea în coloană |

### `weeks/w{1..8}`: obiectivele săptămânilor
`id`, `nr`, `titlu` (scurt, apare pe linia de timp), `obiectiv` (o frază).

### `prompts/{id}`: prompturile și skillurile comune (fila Prompturi)
| Câmp | Valori |
|---|---|
| `id` | aceeași valoare ca id-ul documentului (`p01` …, iar cele adăugate din pagină au un id generat) |
| `tip` | `prompt` · `skill` |
| `titlu` | numele scurt |
| `cand` | când îl folosim (o frază, opțional) |
| `text` | promptul de copiat, sau pentru un skill: comanda de instalare și cum îl folosim |
| `autor` | `alexia` · `alex` |
| `ordine` | număr; cele mai mari apar primele (cele noi folosesc ora adăugării) |

## Reguli
- Statusul unei funcționalități se stabilește după cod: `gata` = implementată și legată de date reale; `partial` = există interfață sau logică, dar incompletă, cu date fictive sau neconectată; `neinceput` = doar menționată.
- La 21 octombrie 2026 repo-ul nu avea încă cod de aplicație. Lista de funcționalități vine din `docs/product/requirements.md` și din schema bazei de date. Singura `partial` era limba, pentru că textele RO/EN există în `src/i18n`.
- Capacitate estimată: ~5 ore pe săptămână de persoană. Săptămâna 8 e rezervată testării, bug-urilor și prezentării.
- Colega trebuie să aibă acces de **Editor**, din meniul Share, ca să poată modifica datele.
