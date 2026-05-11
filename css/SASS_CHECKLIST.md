# Checklist Sass — Rebyte

## ✅ 5 Variables Sass (en styles.scss)
| Variable | Valor | Uso |
|---|---|---|
| `$color-accent` | `#2563eb` | Color principal azul |
| `$color-bg` | `#0a0f1c` | Fondo oscuro base |
| `$color-text` | `#f1f5f9` | Texto principal |
| `$font-display` | `'Syne', sans-serif` | Tipografía de títulos |
| `$radius-lg` | `18px` | Radio de esquinas grande |

Variables adicionales: `$color-accent-2`, `$color-text-2`, `$color-text-3`,
`$color-border`, `$color-bg-2`, `$color-bg-3`, `$font-body`, `$radius-sm`,
`$radius-md`, `$transition`.

## ✅ Anidación de selectores
- `#header` > `.header-logo` > `img`
- `#header` > `.nav` > `.nav-link` > `&:hover`
- `.sidebar` > `.sidebar-menu` > `li` > `&.active`
- `.main` > `.cards` > `.card` > `h3`
- `.nos-historia` > `.nos-grid` > `.nos-text` > `h2`
- `.equipo-grid` > `.equipo-card` > `.equipo-avatar`

## ✅ 2 Casos de Interpolación (en styles.scss)
### Interpolación 1 — Clases de color dinámicas
```scss
$color-names: ("accent": $color-accent, "accent-2": $color-accent-2, "muted": $color-text-2);
@each $name, $value in $color-names {
  .text-#{$name} { color: $value; }
}
// Genera: .text-accent, .text-accent-2, .text-muted
```

### Interpolación 2 — Clases de fondo dinámicas
```scss
$bg-layers: ("base": $color-bg, "card": $color-bg-2, "deep": $color-bg-3);
@each $layer, $value in $bg-layers {
  .bg-#{$layer} { background-color: $value; }
}
// Genera: .bg-base, .bg-card, .bg-deep
```

## Archivos generados
- `scss/styles.scss` → reemplaza `css/styles.css`
- `scss/nosotros.scss` → reemplaza `css/nosotros.css`
- `scss/dashboard.scss` → reemplaza `css/dashboard.css`
