# Plan de implementación — Costita

Fuente: `SDD_app_gestion_costos_recetas_stock.md` v1.0. Un solo flujo núcleo: materia prima → receta → costo por unidad → precio de venta → stock.

## Decisiones base (cerradas antes de codear)

- Stack: React + TS + Vite, Tailwind, React Hook Form + Zod, TanStack Query.
- Persistencia: Vercel-first. Dev: SQLite local. Prod: Supabase free tier o Neon serverless Postgres (liviano, sin DB pesada) + Auth + RLS. No SQLite en serverless. Para uso single-user/offline-first considerar IndexedDB + sync opcional.
- Backend: API TypeScript (mismo lenguaje) desplegada aparte o Supabase client. Elegir Supabase client para MVP.
- Moneda: ARS. Formato centralizado en `MoneyInput`/`formatMoney`.
- IPC: consumir API gratuita (datos.gob.ar INDEC) para IPC mensual; cachear y mostrar impacto real de precios (ganancia/pérdida ajustada por inflación) en dashboard.
- Cálculos: capa de dominio pura (`domain/`), sin dependencias de UI. Decimal.js para dinero.
- Identificadores de artículo: tablas separadas `materias_primas`, `insumos` (simpleza > genérico).
- Seguridad: secretos solo en servidor/env; variables `VITE_` solo públicas; IPC vía proxy serverless si requiere clave; Supabase RLS por usuario; contraseñas gestionadas por Auth (hash, nunca en código); validación en cliente y servidor; rate limiting en endpoints; no loguear datos de negocio ni PII.

## Fase 0 — Descubrimiento y validación (sin código)

Objetivo: cerrar ambigüedades del SDD antes de implementar.

Tareas:
1. Obtener copia de la planilla actual; mapear columnas → entidades del SDD.
2. Entrevistar usuaria con las 10 preguntas de la sección 20 (productos, unidades, auto-descuento stock, presentaciones, costos indirectos, margen vs recargo, dispositivos, importación, exportación, moneda).
3. Acordar definición operativa de "ganancia" (margen sobre venta vs recargo sobre costo) y mostrar ambos con ejemplo.
4. Validar unidades habituales y reglas de conversión.
5. Prototipo navegable (Figma o HTML estático) de flujo A→B→C; testear con usuaria.
6. Decidir despliegue: local single-user vs web multi-dispositivo. Define persistencia (SQLite vs Supabase).

Entregable: `docs/decisiones.md` con respuestas y alcance MVP confirmado.
Criterio de salida: preguntas 1–10 respondidas; persistencia elegida.

## Fase 1 — Fundaciones (proyecto + dominio)

Objetivo: base técnica y lógica de negocio probada, sin UI final.

Tareas:
1. Scaffold Vite + React + TS. Configurar Tailwind, ESLint, Prettier, Vitest.
2. Crear módulo `src/domain/`:
   - `units.ts`: dimensiones (masa g, volumen ml, conteo u), conversiones compatibles, rechazo incompatibles.
   - `money.ts`: Decimal, redondeo, formato ARS.
   - `cost.ts`: `costoIngrediente`, `costoReceta`, `costoUnitario`, `precioPorRecargo`, `precioPorMargen`, `ganancia`, `margenPorcentual`.
   - `validation.ts`: Zod schemas compartidos.
3. Tests unitarios de dominio (casos numéricos de aceptación sección 17): kg↔g, L↔ml, rechazo incompatibles, costo ingrediente, costo unitario, precio margen/recargo, margen inválido, división por cero.
4. Capa de persistencia abstracta `repositories/` con interfaz; implementación SQLite (dev) + Supabase (prod) detrás de la misma interfaz.
5. Migraciones versionadas del esquema (tablas: materias_primas, insumos, recetas, receta_ingredientes, receta_insumos, productos, compras, compra_detalles, movimientos_stock, historial_precios, producciones, configuracion).
6. Auth básica si web (Supabase Auth). RLS por usuario.

Entregable: dominio con ≥80% cobertura; migraciones aplicables; `npm run build` OK.
Criterio de salida: tests verdes; build OK.

## Fase 2 — MVP usable (UI + CRUD + cálculo)

Objetivo: usuaria puede crear materia prima, receta, producto, precio y stock.

Tareas:
1. Layout + navegación (Inicio, Productos, Recetas, Materias primas, Insumos, Stock, Compras, Reportes, Configuración). Responsive.
2. Sistema de diseño: tokens (paleta verde salvia + acento cálido), componentes base: `MoneyInput`, `QuantityUnitInput`, `DataTable`, `EmptyState`, `ConfirmDialog`, `Toast`, `StockLevelBadge`, `CalculationBreakdown`, `CostSummaryCard`, `MarginCalculator`, `PriceChangeNotice`.
3. CRUD Materias primas e Insumos (alta/edición/archivar, precio, cantidad, unidad, stock mínimo, notas).
4. Conversión de unidades en formularios (selector por dimensión).
5. Editor de recetas: nombre, rendimiento, unidad rendimiento, ingredientes (materia prima, cantidad, unidad), insumos asociados (cantidad fija por lote/unidad), costos adicionales. Cálculo en tiempo real.
6. Productos vinculados a receta: costo unitario vigente, método de precio (manual/margen/recargo), objetivo %, precio de venta, ganancia, margen real.
7. Stock: compras (ingreso), ajustes manuales con motivo, alertas bajo mínimo, no stock negativo silencioso.
8. Dashboard: tarjetas resumen, alertas stock bajo, datos incompletos, accesos rápidos, métricas de ganancia/pérdida y costo real. Estados vacíos accionables. Sin métricas ficticias.
9. Integración IPC: cliente para API gratuita (datos.gob.ar), cache mensual, mostrar variación de precios vs IPC y poder real de ganancia.
9. Configuración: moneda, preferencias básicas.

Entregable: flujo A/B/C/E operativo en desktop y móvil.
Criterio de salida: criterios de aceptación MVP (sección 19) excepto producción confirmada y exportación.

## Fase 3 — Calidad operativa (producción, historial, exportación, E2E)

Objetivo: cerrar MVP con integridad histórica y pruebas.

Tareas:
1. Confirmación de producción: preview de consumo de ingredientes/insumos, confirmación, registro de movimientos, aviso de insuficiencia.
2. Historial de precios: guardar anterior/nuevo, fecha, origen; recalcular dependientes; mostrar productos afectados; no alterar producciones históricas.
3. Exportación CSV (listados, reportes de costos y márgenes). PDF de resumen de receta si tiempo.
4. Reportes: costos y márgenes por producto.
5. Backup/restore probado (export/import completo + fecha última copia).
6. Pruebas de integración (crear MP → receta; compra → stock/precio; cambio precio → recálculo; producción → descuento; archivar sin romper).
7. Pruebas E2E (Playwright): primera receta desde vacío, edición cantidades, precio venta, compra, alerta stock, móvil, teclado, errores.
8. Accesibilidad: contraste, foco visible, labels, navegación teclado.
9. Publicación Vercel: build, env vars, migraciones prod, RLS probado, rutas SPA fallback, dominio, backup.

Entregable: MVP listo según criterios de aceptación sección 19.
Criterio de salida: todos los criterios de aceptación cumplidos; E2E verdes.

## Fase 4 — Mejoras posteriores (post-MVP)

- Costos indirectos avanzados (mano de obra, energía por minuto).
- Merma porcentual configurable.
- Lotes y vencimientos.
- Promedio ponderado de inventario.
- Importación desde Excel/CSV.
- Variantes de presentación y recetas escalables.
- Historial de rentabilidad por período.
- Multiusuario y permisos.

## Orden de ejecución recomendado y dependencias

Fase 0 → Fase 1 (dominio + persistencia) → Fase 2 (UI CRUD) → Fase 3 (operación + calidad). No iniciar Fase 2 sin dominio y migraciones listas. No iniciar Fase 3 sin flujo A/B/C funcionando.

## Riesgos y mitigaciones (resumen)

- Margen vs recargo: ambos métodos con explicación y ejemplo en `MarginCalculator`.
- Unidades: conversión por dimensión, validaciones estrictas, sin masa↔volumen automático.
- Precios: separar costo actual de snapshots históricos; no sobrescribir precio de venta manual.
- Stock: historial de movimientos, confirmación en ajustes, no negativo silencioso.
- Alcance: cerrar MVP en Fase 3; postergar Fase 4.

## Checklist de arranque (siguiente paso)

- [ ] Responder preguntas de descubrimiento (Fase 0).
- [ ] Elegir persistencia (SQLite dev / Supabase prod).
- [ ] Scaffold proyecto (Fase 1.1).
- [ ] Implementar `domain/units` + tests.
- [ ] Implementar `domain/cost` + tests numéricos de aceptación.