# Guide

Cette application utilise Markdown pour mettre en forme le texte.

Dans ce guide, je vais te montrer la syntaxe Markdown supportée sur ce site que tu peux utiliser pour rendre tes bios plus jolies !

# Table des matières

<!-- TOC start (generated with https://github.com/derlin/bitdowntoc) -->

- [Titres](#titres)
- [Style du texte](#style-du-texte)
- [Listes](#listes)
  * [Listes non ordonnées](#listes-non-ordonnées)
  * [Listes ordonnées](#listes-ordonnées)
  * [Liste de tâches](#liste-de-tâches)
  * [Listes imbriquées](#listes-imbriquées)
  * [Notes](#notes)
- [Séparation horizontale](#séparation-horizontale)
- [Citations](#citations)
- [Links](#links)
- [Code](#code)
  * [Code en ligne](#code-en-ligne)
  * [Bloc de code](#bloc-de-code)
- [Tableaux](#tableaux)
- [Images ?](#images-)
- [Les choses ne s'affichent pas comme prévues?](#les-choses-ne-saffichent-pas-comme-prévues)

<!-- TOC end -->

# Titres

Tu peux créer des titres en commençant une nouvelle ligne par `#`, puis du texte.

Ça va créer un titre de niveau 1, le plus gros.

Tu peux ajouter plus de `#` pour créer des titres de niveaux de plus en haut, qui deviendront de plus en plus petit. Le title le plus petit est le titre de niveau 6.

Voici un exemple avec tous les titres.

```
#Très grand titre
##Grand titre
###Titre un peu plus petit mais grand quand même
####Un titre plus petit
#####Encore plus petit
######Titre le plus petit
```

Ce qui donne :

# Très grand titre
## Grand titre
### Titre un peu plus petit mais grand quand même
#### Un titre plus petit
##### Encore plus petit
###### Titre le plus petit

# Style du texte

Avec Markdown, on peut créer 3 styles de textes différents :

- *italique*
- **gras**
- ~~barré~~

Pour écrire un texte en italique, entoure le d'`*`, comme ça : `*ce texte est affiché en italique*`.

Ce qui donne : *ce texte est affiché en italique*.

Ensuite, pour le texte en gras, c'est la même chose mais avec 2 `*` au lieu d'un.

Donc, `**ce texte est affiché en gras**` donnera **ce texte est affiché en gras**.

Et enfin, pour le texte barré, il suffit d'entourer le texte de 2 `~`.

Par exemple, `~~je suis barré~~` s'affichera ~~je suis barré~~.

Tu peux aussi combiner plusieurs styles (même dans les titres).

Par exemple: ***ce texte est en gras et italique est aussi ~~barré~~*** est `***ce texte est en gras et italique est aussi ~~barré~~***`.

# Listes
## Listes non ordonnées

Tu peux créer un élément de liste non ordonée en commençant une ligne par `+`, `*` ou `-`, suivi d'un espace, puis du texte.
Tu peux ensuite faire une liste avec une chaîne d'élement séparés par **un seul** saut de ligne.

Par exemple,

- Élement 1
- Élement 2
- Élement 3
  
s'écrit :

```
- Élement 1
- Élement 2
- Élement 3
```

Les éléments de la liste peuvent aussi prendre plusieurs lignes.

## Listes ordonnées

Tu peux créer un élément de liste ordonée en commençant une ligne par un nombre, suivi d'un `.`, puis d'un espace et du texte.

Par exemple,

```
1. Salut !
2. Je
3. suis
4. une
5. liste !
```

donnera :

1. Salut !
2. Je
3. suis
4. une
5. liste !

## Liste de tâches

Tu peux créer un élement de liste de tâches en commençant par `+`, `*` ou `-`, puis un espace et ensuite

- `[ ]` pour une tâche à faire
- `[x]` pour une tâche terminée

Puis du texte.

Par exemple,

- [x] Cette tâche est terminée !
- [ ] Celle-là non.

s'écrit :

```
- [x] Cette tâche est terminée !
- [ ] Celle-là non.
```

## Listes imbriquées


Tous les types de listes peuvent être imbriquées en ajoutant 4 espaces avant le signe de lists. Tu peux aussi imbriquer des listes imbriquées (ajoute 4 espaces par niveau d'imbrication).

For example,

- [ ] Voici une tâche avec une liste imbriquée
    - Et cette liste imbriquée a aussi une liste imbriquée
        1. Ça fait beaucoup, là, non?
- [x] Cette tâche n'a pas de liste imbriquée
  
is written as

```
- [ ] Voici une tâche avec une liste imbriquée
    - Et cette liste imbriquée a aussi une liste imbriquée
        1. Ça fait beaucoup, là, non?
- [x] Cette tâche n'a pas de liste imbriquée
```

## Notes
À cause de la façon dont Markdown est géré sur cette application, les listes distinctes doivent **impérativement** être séparées d'au moins 3 sauts de ligne pour s'afficher correctement.

Ce bug sera résolu (*ou pas*) dans le futur.

# Séparation horizontale

Tu peux créer une séparation horizontale avec `***`, `___` ou `---` sur une ligne à part.

Ce qui donne :

---

# Citations

Tu peux créer un bloc de citations en commençant une ligne par `>`, puis du texte.

Les blocs de citations ressemblent à ça:

> Voici une citation !

Pour les citations avec des sauts de ligne, tu dois ajouter une ligne vide commençant par `>`.

Par exemple,

> Les choses amusantes sont amusantes.
>
> — Yui Hirasawa

doit s'écrire

```
> Les choses amusantes sont amusantes.
>
> — Yui Hirasawa
```

# Links

Tu peux créer un lien avec la syntaxe `[texte](lien)`, où texte est le texte qui va s'afficher et le lien et le lien en lui-même.

Tu peux aussi créer des liens vers des titres spécifiques de ta page.

Pour ça, tu dois d'abord ajouter un ID à ton titre avec la syntaxe `{}`.

Commence ton titre normalement, puis à la fin, ajotue un espace et ouvre une accolade. Ensuite, écris l'ID que tu veux que ton titre ait et referme l'accolade.

Un exemple, `# Haut de la page {haut}`.

**Utilise uniquement des lettres non accentuées et des nombres pour les IDs.**

Ensuite, une fois créé, l'ID peut être utilisé comme lien, de cette façon :

`[Retourner tout en haut](#haut)`.

# Code
## Code en ligne
Tu peux insérer du code dans la ligne en entourant ton texte de backticks.

<code>\`Ceci est du code !\`</code> s'affichera `Ceci est du code !`.

## Bloc de code
Tu peux créer un bloc de code avec 3 backticks, un saut de ligne, puis ton code, puis un saut de ligne et enfin, 3 backticks.

Ce qui donnera :

```
// Mon code:
console.log("Salut !");
```

# Tableaux

Tu peux créer des tables à l'aide de `|` et `-`.

Par exemple,

```
| Colonne 1 | Colonne 2 |
| -------- | -------- |
| Donnée 1   | Donnée 2   |
```

s'affichera

| Colonne 1 | Colonne 2 |
| -------- | -------- |
| Donnée 1   | Donnée 2   |

# Images ?

Les images sont désactivées pour empêcher des pixel trackers.

# Les choses ne s'affichent pas comme prévues?

La gestion de Markdown sur ce site est assez chaotique et par conséquent, imparfaite. Si certaines choses ne s'affichent pas comme prévues, essayes d'ajouter des sauts de ligne entre les éléments distincts.

Si ça ne résout rien, utilise l'onglet "Issues" pour reporter le bug. Ou si tu as trouvé une solution, fais une pull request (demande d'extraction).
