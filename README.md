# Agenda personal

Aplicación web personal para gestionar eventos y entregas de trabajos de la universidad. Pensada para usarse desde el móvil como una PWA (se puede añadir a la pantalla de inicio).

## Funciones

- Añadir, editar y eliminar eventos y entregas
- Filtrar la vista entre Todo / Eventos / Entregas
- Marcar entregas como completadas
- Modo claro/oscuro, seleccionable por el usuario
- Los datos se guardan en el propio dispositivo

## Estructura del proyecto

```
agenda_app/
├── index.html
├── css/
│   └── styles.css
└── js/
    ├── agenda.js      # lógica de eventos y entregas
    ├── main.js         # inicialización de la app
    ├── storage.js       # guardado y lectura de datos
    └── theme.js         # modo claro/oscuro
```

## Cómo usarla

La app está publicada con GitHub Pages en:

`https://KizFury516.github.io/agenda-app/`

Ábrela desde el navegador del móvil y usa "Añadir a pantalla de inicio" para instalarla como una app.

## Próximos pasos

- Sincronización en la nube para acceder desde varios dispositivos
