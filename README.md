# Blue Velvet Insumos

Gestión de costos, recetas, insumos y stock para emprendimientos.

## Características

- Dashboard con métricas, alertas de stock bajo y recetas incompletas.
- Materias primas e insumos: alta, stock, costos normalizados por unidad base.
- Recetas con ingredientes, rendimiento, costos adicionales y cálculo automático.
- Productos con precio de venta por margen o recargo, ganancia y margen real.
- Stock con movimientos (ingreso, ajuste, merma) y alertas.
- Compras que actualizan stock y costo de referencia.
- Confirmación de producción con descuento automático de existencias.
- Actualización de precios con historial.
- Exportación CSV y backup/restauración JSON.
- Integración de IPC mensual (Argentina) para contexto inflacionario.
- Tema claro/oscuro.
- Diseño Blue Velvet (navy/cream/silver, Playfair + Inter).

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Tests

```bash
npm test
```

## Despliegue (Vercel)

- Build command: `npm run build`
- Output directory: `dist`
- Configurado en `vercel.json`.

Los datos se guardan en `localStorage`. Para multiusuario, migrar a Supabase (Postgres + Auth + RLS).