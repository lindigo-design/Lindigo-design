# Lindigo Design Studio — site web

Site vitrine du studio **Lindigo Design Studio** : services web, sites et identités de marque pour les startups et les PME.

> D’abord la stratégie. Ensuite un design qui fonctionne.

- Site définitif (à venir) : https://lindigo-design.com
- Copie de prévisualisation (GitHub Pages, non indexée) : https://lindigo-design.github.io/Lindigo-design/
- Plan du site et décisions de conception : [`docs/plan.md`](docs/plan.md) (en ukrainien)

## État actuel

Le projet est en cours de construction. Pour l’instant, la page d’accueil contient :

- **l’en-tête** en verre, collé en haut de page : logo, menu des langues, interrupteur de thème, bouton « Réserver un appel », bouton du menu ;
- **le premier écran** : titre, texte, deux boutons et la carte « Dernière réalisation » ;
- **un fluide WebGL** en fond : l’image du premier écran devient un liquide que la souris mélange, puis elle se recompose d’elle-même ;
- **le menu plein écran**, qui s’ouvre en cercle depuis le bouton du menu ;
- **un pied de page provisoire** : langues et interrupteur de thème.

Les pages « Réalisations », « Services », « Studio » et « Contact » ne sont pas encore créées : les liens du menu mènent pour l’instant à une page 404.

## Technologies

- [Astro](https://astro.build) 7, site statique, sans framework JavaScript côté client
- CSS natif avec variables (palette Lindigo, thèmes sombre et clair)
- TypeScript pour les scripts
- WebGL 2 pour le fluide du premier écran
- Polices auto-hébergées via Fontsource : Unbounded (titres), Mulish (texte), Martian Mono (libellés)

## Démarrer

Node.js 22.23.4 ou plus récent est nécessaire (exigence d’Astro 7).

```bash
npm install
npm run dev       # serveur de développement : http://localhost:4321
npm run build     # build de production dans dist/
npm run preview   # aperçu du build
```

## Langues

Le français est la langue principale, à la racine du site. L’anglais et l’ukrainien ont leur propre préfixe :

| Langue | Adresse |
| --- | --- |
| Français | `/` |
| English | `/en/` |
| Українська | `/uk/` |

- Tous les textes sont dans [`src/i18n/ui.ts`](src/i18n/ui.ts). Les textes anglais sont un brouillon à relire.
- Les adresses sont construites par `localePath()`, qui ajoute le préfixe de langue et le `base` du site.
- Chaque page déclare les trois versions dans `<link rel="alternate" hreflang>`, plus `x-default` vers le français.
- Le choix de langue est mémorisé (`localStorage`, clé `lindigo-lang`). Le site ne redirige jamais automatiquement selon la langue du navigateur.

## Thèmes

- Deux thèmes : **sombre** (par défaut) et **clair**.
- Le thème est appliqué dans le `<head>` avant le premier affichage, donc la page ne clignote pas.
- Le choix est mémorisé (`localStorage`, clé `lindigo-theme`).
- Le même interrupteur apparaît dans l’en-tête, dans le menu et dans le pied de page ; ils affichent toujours le même état.

## Structure

```
src/
  assets/            images (fonds du premier écran, logos, fonds du menu, icônes)
  components/
    hero/
      Hero.astro     premier écran
      fluid/         fluide WebGL : fluid.ts (lancement, boucle, pauses), shaders.ts, config.ts
    Button.astro     bouton principal et bouton secondaire
    Header.astro     en-tête
    LangMenu.astro   menu déroulant des langues (en-tête)
    LangSwitch.astro langues en ligne « FR EN UK » (menu, pied de page)
    Menu.astro       menu plein écran
    ThemeSwitch.astro interrupteur de thème
    WorkCard.astro   carte « Dernière réalisation »
    Footer.astro     pied de page provisoire
  data/featured.ts   réalisations affichées dans la carte du premier écran
  i18n/ui.ts         textes, langues, adresses
  layouts/Base.astro <head>, SEO, script du thème
  pages/             /, /en/, /uk/
  styles/global.css  palette, thèmes, styles communs
docs/plan.md         plan du site
```

## Accessibilité et mouvement

- Tout ce qui réagit à la souris réagit aussi au clavier, avec un focus visible.
- Le menu est une boîte de dialogue : le focus reste à l’intérieur, `Échap` le ferme, la page dessous ne défile pas.
- Avec « réduire les animations » activé dans le système, le fluide ne démarre pas et les animations sont remplacées par de simples fondus.
- Le fluide se met en pause hors écran, dans un onglet inactif et sous le menu ouvert. Il se désactive si l’appareil est trop lent ou si WebGL n’est pas disponible : l’image fixe reste affichée.

## Publication

La copie de prévisualisation est publiée sur GitHub Pages par [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) à chaque push sur `main` (ou manuellement).

- Le workflow construit le site avec `PUBLIC_PREVIEW=true`. Le site est alors servi sous `https://lindigo-design.github.io/Lindigo-design/`, et la balise `<meta name="robots" content="noindex, nofollow">` empêche son indexation.
- Sans cette variable, `npm run build` produit la version pour le domaine définitif `https://lindigo-design.com`, sans préfixe ni `noindex`.
- Aucun domaine personnalisé n’est configuré sur GitHub Pages.

## Licences et crédits

- Le fluide du premier écran s’appuie sur [WebGL-Fluid-Simulation](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation) de Pavel Dobryakov (licence MIT). La mention de licence est conservée dans [`shaders.ts`](src/components/hero/fluid/shaders.ts).
- Polices Unbounded, Mulish et Martian Mono : SIL Open Font License.
- Design, textes, logo et images : © Lindigo Design Studio. Tous droits réservés.
