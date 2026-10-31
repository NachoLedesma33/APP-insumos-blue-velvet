# SDD --- Aplicación de gestión de costos, recetas, insumos y stock

**Nombre provisional:** Costita\
**Versión del documento:** 1.0\
**Estado:** Borrador funcional para validación con la usuaria\
**Fecha:** 20 de octubre de 2026

------------------------------------------------------------------------

## 1. Resumen ejecutivo

La aplicación busca reemplazar una hoja de cálculo difícil de mantener
por una herramienta visual, sencilla y confiable para calcular el costo
de elaboración y el precio de venta de productos a partir de recetas,
materias primas e insumos. La usuaria carga los precios de compra, las
cantidades utilizadas y las unidades correspondientes; el sistema
vincula automáticamente los datos y actualiza los costos, márgenes,
ganancias estimadas y stock relacionado.

La prioridad no es reproducir una planilla dentro de una web, sino
convertir una tarea propensa a errores en un flujo de trabajo guiado:
**cargar una vez, reutilizar en las recetas y recalcular automáticamente
cuando cambia un precio**.

La experiencia debe sentirse cuidada y moderna, con jerarquía visual
clara, formularios comprensibles, indicadores útiles, tablas legibles y
estados vacíos que expliquen qué hacer. Debe ser atractiva para
mostrarla a otras personas, sin sacrificar precisión ni facilidad de
uso.

## 2. Problema y oportunidad

### Problemas actuales

-   Los precios de materia prima se cargan en una hoja de cálculo.
-   Para obtener el costo de una receta hay que vincular manualmente
    celdas y fórmulas.
-   Las referencias se pueden romper o quedar desactualizadas.
-   Los insumos y el stock no están necesariamente conectados con los
    costos.
-   Es fácil olvidar una fórmula, una unidad o una actualización de
    precio.
-   Resulta difícil ver rápidamente cuánto cuesta producir, cuánto se
    gana y qué precio de venta conviene usar.

### Oportunidad

Centralizar materias primas, insumos, recetas, productos y existencias
en una aplicación donde los datos se relacionen de forma explícita. El
sistema debe mostrar de dónde sale cada número y recalcular los valores
dependientes automáticamente.

## 3. Objetivos

### Objetivos principales

1.  Registrar materias primas y sus precios de compra.
2.  Registrar insumos complementarios, como envoltorios, cajas,
    etiquetas, bolsas y otros materiales.
3.  Crear recetas indicando ingredientes, cantidades y rendimiento.
4.  Calcular automáticamente el costo total de una receta y el costo por
    unidad producida.
5.  Configurar un porcentaje de ganancia o margen y obtener precios de
    venta sugeridos.
6.  Registrar y consultar stock de materias primas e insumos.
7.  Descontar existencias al registrar producción, si la usuaria activa
    ese flujo.
8.  Actualizar los costos relacionados cuando cambia el precio de un
    ingrediente.
9.  Presentar indicadores claros para tomar decisiones sin tener que
    revisar fórmulas.
10. Permitir exportar información útil para respaldo o análisis.

### No objetivos de la primera versión

-   Contabilidad formal, facturación fiscal o liquidación de impuestos.
-   Integración con bancos, medios de pago, proveedores o tiendas
    online.
-   Gestión multiempresa, multiusuario avanzada o permisos complejos.
-   Predicción automática de demanda mediante inteligencia artificial.
-   Sincronización bidireccional completa con Excel o Google Sheets.
-   Cálculo de costos laborales, alquiler, energía y otros costos
    indirectos de manera avanzada. Se podrá contemplar un campo simple
    de costos adicionales por receta en el MVP.

## 4. Usuarios y escenarios de uso

### Usuario principal

Emprendedora o productora que elabora productos en lotes ---por ejemplo,
alfajores, pastelería, alimentos artesanales u otros productos hechos
mediante recetas--- y necesita controlar costos, precios y existencias
sin administrar fórmulas.

### Escenarios clave

-   **Alta de materia prima:** compra 1 kg de chocolate por determinado
    precio y lo registra en pesos.
-   **Creación de receta:** define que una preparación usa 250 g de
    chocolate, 500 g de harina y otros ingredientes.
-   **Rendimiento:** indica que la receta produce 12 unidades.
-   **Costo unitario:** la aplicación calcula el costo del lote y de
    cada unidad.
-   **Precio de venta:** establece una ganancia deseada y ve el precio
    sugerido y la ganancia estimada.
-   **Actualización de proveedor:** modifica el precio del chocolate y
    ve qué recetas y productos aumentan su costo.
-   **Control de stock:** registra compras, producción, ajustes y
    consulta cuánto queda.
-   **Compra necesaria:** detecta que un ingrediente está por debajo del
    mínimo y necesita reponerlo.

## 5. Principios de producto y UX

1.  **Automatización visible:** los cálculos se actualizan solos y se
    indica qué datos los originan.
2.  **Una sola fuente de verdad:** el precio de un ingrediente se
    administra en su ficha y se reutiliza en todas las recetas.
3.  **Claridad antes que densidad:** mostrar primero los datos que
    ayudan a decidir; dejar el detalle técnico accesible.
4.  **Prevención de errores:** validar unidades, cantidades, precios y
    rendimientos antes de calcular.
5.  **Edición segura:** explicar cuándo un cambio de precio afecta a
    productos existentes.
6.  **Diseño adaptable:** usable en computadora, tablet y celular.
7.  **Terminología cotidiana:** usar "materia prima", "insumos",
    "receta", "costo por unidad", "ganancia" y "stock".
8.  **Transparencia:** no presentar estimaciones como resultados reales
    ni confundir margen con recargo.
9.  **Accesibilidad:** contraste suficiente, foco visible, etiquetas
    claras y controles utilizables con teclado.
10. **Interfaz demostrable:** componentes consistentes,
    microinteracciones discretas y estados vacíos bien diseñados.

## 6. Alcance funcional

### 6.1 Panel principal / Dashboard

Debe responder rápidamente: - ¿Cuánto cuesta producir mis productos? -
¿Qué productos tengo registrados? - ¿Qué materias primas o insumos están
bajos de stock? - ¿Qué precios o costos cambiaron recientemente? - ¿Qué
productos tienen un margen inferior al objetivo?

Componentes propuestos: - Tarjetas de resumen: productos, recetas,
materias primas, alertas de stock. - Lista de productos recientes o más
consultados. - Alertas accionables de stock bajo. - Avisos de recetas
incompletas o con precios pendientes. - Accesos rápidos: "Nueva materia
prima", "Nueva receta", "Registrar compra".

No se deben mostrar métricas ficticias en producción. Si no hay datos,
mostrar un estado vacío con una acción concreta para comenzar.

### 6.2 Materias primas

Cada registro debe incluir: - Nombre. - Categoría opcional. - Proveedor
opcional. - Precio de compra. - Cantidad comprada. - Unidad de compra:
kg, g, L, ml, unidad u otra unidad definida. - Costo unitario
normalizado. - Stock actual. - Stock mínimo deseado. - Fecha de
actualización del precio. - Notas opcionales. - Estado activo/inactivo.

Ejemplo: 1 kg de harina cuesta \$1.800 → costo base de \$1,80 por gramo.
Si una receta usa 250 g, el costo asignado a esa cantidad será \$450.

El sistema debe permitir registrar precios en pesos argentinos (ARS) en
la primera versión. El formato monetario se centraliza para poder
incorporar otras monedas en el futuro.

### 6.3 Insumos

Los insumos son materiales que acompañan o permiten entregar el
producto, pero no siempre forman parte de la receta alimentaria:
envoltorios, cajas, etiquetas, cintas, bolsas, separadores, etc.

Campos: - Nombre y categoría. - Proveedor opcional. - Precio de
compra. - Cantidad y unidad comprada. - Costo por unidad o por medida. -
Stock actual y mínimo. - Notas y fecha de actualización.

Un insumo puede asociarse a un producto o receta en una cantidad
determinada. Ejemplo: una caja por cada seis unidades o una etiqueta por
producto. La primera versión puede resolver las asociaciones por
cantidad fija por lote o por unidad, dejando reglas más complejas para
después.

### 6.4 Recetas

Una receta representa la elaboración de un lote de producto.

Datos generales: - Nombre de receta. - Producto asociado (opcional en el
primer alta, obligatorio al publicarlo para venta). - Descripción o
notas. - Rendimiento esperado: cantidad de unidades por lote. - Unidad
de rendimiento, por ejemplo unidades, docenas o porciones. - Tiempo de
elaboración opcional. - Estado: borrador, lista para usar o archivada.

Cada ingrediente incluye: - Materia prima. - Cantidad requerida. -
Unidad de uso. - Costo calculado automáticamente. - Posibilidad de
eliminar o reemplazar el ingrediente.

La receta debe convertir unidades compatibles de forma automática.
Ejemplos: - 1 kg = 1.000 g. - 1 L = 1.000 ml. - Una unidad solo puede
convertirse a otra unidad si existe una equivalencia definida; no asumir
conversiones entre masa y volumen sin una densidad específica.

Resumen de receta: - Costo por ingrediente. - Costo total de materia
prima del lote. - Costo de insumos asociados. - Costos adicionales
manuales opcionales. - Costo total estimado del lote. - Rendimiento del
lote. - Costo estimado por unidad. - Última actualización y advertencias
de datos incompletos.

### 6.5 Costos adicionales

Para evitar que el cálculo quede limitado a ingredientes, el MVP puede
incluir un campo opcional por receta o lote para costos adicionales
estimados: energía, gas, mano de obra u otros. Debe aclararse que son
valores cargados por la usuaria y no cálculos contables automáticos.

Se recomienda empezar con un importe fijo por lote. La asignación
detallada por minutos de trabajo, consumo energético o amortización de
equipos queda para una fase posterior.

### 6.6 Productos y precios de venta

Un producto es el artículo comercial que se vende. Puede utilizar una
receta como base.

Campos: - Nombre comercial. - Receta asociada. - Presentación o
tamaño. - Costo unitario actual calculado. - Precio de venta actual. -
Método de cálculo del precio. - Margen o recargo objetivo. - Ganancia
estimada por unidad. - Margen real calculado. - Estado activo/inactivo.

La aplicación debe distinguir dos conceptos que suelen confundirse:

-   **Recargo sobre costo (markup):** ganancia dividida por costo.
-   **Margen sobre venta:** ganancia dividida por precio de venta.

Fórmulas: - Costo unitario = costo total del lote / rendimiento del
lote. - Precio con recargo = costo unitario × (1 + porcentaje de
recargo). - Precio para un margen objetivo = costo unitario / (1 −
margen objetivo). - Ganancia estimada por unidad = precio de venta −
costo unitario. - Margen sobre venta = (precio de venta − costo
unitario) / precio de venta × 100.

El margen objetivo debe ser menor que 100 %. Validar valores negativos o
incoherentes. Mostrar la fórmula o una explicación breve en contexto
para evitar que la usuaria confunda margen y recargo.

Los resultados son estimaciones de costos y no equivalen a rentabilidad
neta contable: impuestos, comisiones, desperdicio, costos fijos y otros
gastos solo se consideran si fueron incluidos.

### 6.7 Stock e inventario

El stock no debe ser solo un número editable sin explicación. Debe
existir un historial de movimientos.

Tipos de movimiento: - Compra o ingreso. - Consumo por producción. -
Ajuste manual. - Merma o desperdicio. - Devolución, si corresponde.

Cada movimiento registra: - Artículo. - Tipo. - Cantidad. - Fecha. -
Motivo o nota. - Referencia a compra o producción cuando exista.

Reglas: - La compra incrementa el stock. - La producción puede descontar
las cantidades de receta e insumos, si se confirma el lote producido. -
Un ajuste debe requerir confirmación y motivo. - Mostrar alertas cuando
el stock esté por debajo del mínimo. - Por defecto, no permitir stock
negativo silenciosamente. Si se decide permitirlo, mostrar advertencia
explícita y registrar el movimiento. - El costo de la receta debe
calcularse con precios de referencia actuales, sin alterar
retroactivamente el historial de movimientos.

En el MVP, el control de stock puede ser básico: registro de compras,
ajustes manuales y descuento de insumos al confirmar producción. La
gestión avanzada de lotes, vencimientos y trazabilidad queda fuera del
alcance inicial.

### 6.8 Registro de compras

Una compra permite cargar el ingreso de materia prima o insumos. Debe
registrar: - Fecha. - Artículo. - Cantidad comprada y unidad. - Precio
total pagado. - Proveedor opcional. - Nota o número de comprobante
opcional.

El sistema calcula el costo unitario normalizado y actualiza el stock.
Si se actualiza el precio de referencia, debe solicitar o aplicar una
regla clara: el precio vigente pasa a ser el costo de la última compra,
mientras que las compras históricas conservan sus valores.

Para el MVP, usar **último costo de compra** como referencia de cálculo
y documentarlo en la interfaz. El promedio ponderado puede añadirse en
una versión futura.

### 6.9 Historial y cambios de precio

Al modificar el precio de un ingrediente o insumo: - Guardar el precio
anterior y el nuevo. - Registrar fecha del cambio. - Recalcular las
recetas y productos dependientes. - Mostrar qué productos se ven
afectados. - No modificar registros históricos de producción ya
confirmados.

### 6.10 Búsqueda, filtros y orden

Materias primas, insumos, recetas y productos deben permitir: - Buscar
por nombre. - Filtrar por categoría o estado. - Ordenar por nombre,
costo, fecha de actualización o stock. - Identificar rápidamente datos
faltantes.

### 6.11 Exportación y respaldo

MVP recomendado: - Exportar listados y reportes a CSV. - Exportar
resumen de receta y costos a PDF si el tiempo lo permite. - Realizar
copia de seguridad de la base de datos o permitir exportar/importar un
respaldo completo. - Informar claramente cuándo fue la última copia y
qué incluye.

La exportación no debe ser el mecanismo principal para calcular: las
fórmulas oficiales viven en la aplicación.

## 7. Flujos principales

### Flujo A --- Preparar la aplicación

1.  La usuaria crea una materia prima.
2.  Ingresa precio, cantidad y unidad de compra.
3.  La aplicación calcula el costo normalizado.
4.  Repite el proceso para insumos.
5.  El dashboard muestra que ya puede crear una receta.

### Flujo B --- Crear una receta

1.  Selecciona "Nueva receta".
2.  Asigna nombre y rendimiento del lote.
3.  Agrega ingredientes y cantidades.
4.  La aplicación calcula cada costo en tiempo real.
5.  Asocia insumos de empaque y costos adicionales.
6.  Revisa costo del lote y costo por unidad.
7.  Guarda como borrador o marca como lista para usar.

### Flujo C --- Definir precio de venta

1.  Abre un producto vinculado a una receta.
2.  Ve el costo unitario vigente.
3.  Elige "Definir precio por margen" o "Definir precio por recargo".
4.  Introduce el porcentaje deseado o el precio manual.
5.  Ve precio sugerido, ganancia estimada y margen resultante.
6.  Confirma el precio de venta.

### Flujo D --- Actualizar el costo de una materia prima

1.  Abre la materia prima y registra la nueva compra o actualiza el
    precio.
2.  El sistema conserva el historial.
3.  Recalcula las recetas y productos dependientes.
4.  Muestra un resumen de los productos afectados y el cambio de costo.

### Flujo E --- Registrar producción

1.  Selecciona receta/producto y cantidad de lotes o unidades
    producidas.
2.  La aplicación calcula los ingredientes e insumos que se consumirán.
3.  Muestra una vista previa del descuento de stock.
4.  La usuaria confirma.
5.  Se registran los movimientos de stock y el lote producido.
6.  Se informa si algún ingrediente resulta insuficiente.

## 8. Arquitectura de información y navegación

Navegación principal sugerida: 1. **Inicio** 2. **Productos** 3.
**Recetas** 4. **Materias primas** 5. **Insumos** 6. **Stock** 7.
**Compras** 8. **Reportes** 9. **Configuración**

En móvil, usar navegación compacta y priorizar acciones frecuentes.
Evitar esconder funcionalidades esenciales en menús difíciles de
descubrir.

## 9. Dirección visual y sistema de diseño

### Concepto

Una aplicación de gestión pequeña con estética de producto SaaS moderno:
clara, cálida y profesional. Debe resultar visualmente atractiva sin
parecer una planilla coloreada ni un panel corporativo sobrecargado.

### Propuesta visual

-   Fondo neutro cálido o gris muy claro.
-   Superficies blancas, bordes sutiles y sombras discretas.
-   Color principal verde salvia o verde profundo, asociado a control y
    progreso.
-   Acento cálido (durazno/coral o ámbar) para acciones destacadas.
-   Rojo reservado para errores o alertas críticas; no usarlo como
    decoración.
-   Tipografía sans-serif legible, jerarquía clara y números tabulares
    para importes.
-   Espaciado consistente, radios moderados y alineación precisa.
-   Iconografía consistente y etiquetas textuales para acciones
    importantes.

La paleta definitiva debe comprobar contraste accesible. No depender
únicamente del color para comunicar estados.

### Componentes destacados

-   **CostSummaryCard:** costo total, costo unitario y variación.
-   **MoneyInput:** entrada monetaria con formato ARS, sin alterar el
    valor numérico interno.
-   **QuantityUnitInput:** cantidad y selector de unidad.
-   **IngredientRow:** materia prima, cantidad, costo unitario y
    subtotal.
-   **MarginCalculator:** selector entre margen y recargo, precio
    sugerido y ganancia.
-   **StockLevelBadge:** nivel de stock con texto y estado.
-   **PriceChangeNotice:** aviso de cambio de costo y productos
    afectados.
-   **EmptyState:** ilustración o icono discreto, explicación y acción
    siguiente.
-   **ConfirmDialog:** confirmación para acciones destructivas o ajustes
    importantes.
-   **DataTable:** tabla adaptable con búsqueda, orden y acciones por
    fila.
-   **CalculationBreakdown:** desglose transparente de la fórmula y los
    importes.
-   **Toast/InlineFeedback:** confirmaciones y errores sin interrumpir
    tareas innecesariamente.

### Reglas de interacción

-   Recalcular al editar cantidades o precios, con respuesta rápida.
-   Mostrar indicadores de guardado y errores de validación.
-   Confirmar acciones destructivas.
-   Mantener los datos introducidos si ocurre un error recuperable.
-   Evitar modales para formularios largos; preferir páginas o paneles
    dedicados.
-   Usar ayuda contextual para margen, recargo, unidades y costo
    unitario.
-   No llenar el dashboard de gráficos si las tarjetas y alertas
    resuelven mejor la tarea.

## 10. Requisitos funcionales

-   **RF-01:** crear, editar, archivar y consultar materias primas.
-   **RF-02:** guardar precio, cantidad de compra, unidad y costo
    normalizado.
-   **RF-03:** crear y administrar insumos.
-   **RF-04:** definir unidades y conversiones compatibles.
-   **RF-05:** crear recetas con rendimiento e ingredientes.
-   **RF-06:** calcular automáticamente subtotales, costo de lote y
    costo unitario.
-   **RF-07:** asociar insumos y costos adicionales a recetas o
    productos.
-   **RF-08:** crear productos comerciales vinculados a recetas.
-   **RF-09:** calcular precio sugerido mediante margen o recargo.
-   **RF-10:** mostrar ganancia estimada y margen real.
-   **RF-11:** registrar compras y actualizar existencias.
-   **RF-12:** registrar movimientos de stock con fecha, cantidad y
    motivo.
-   **RF-13:** previsualizar y confirmar consumos por producción.
-   **RF-14:** alertar sobre stock bajo, datos incompletos y precios
    desactualizados.
-   **RF-15:** registrar historial de cambios de precio.
-   **RF-16:** recalcular dependencias sin modificar el historial de
    producciones confirmadas.
-   **RF-17:** buscar, filtrar y ordenar las entidades principales.
-   **RF-18:** exportar datos relevantes a CSV.
-   **RF-19:** validar entradas y explicar errores con mensajes
    accionables.
-   **RF-20:** permitir configurar moneda y preferencias básicas.

## 11. Requisitos no funcionales

-   **RNF-01 --- Usabilidad:** una usuaria sin conocimientos de hojas de
    cálculo debe poder crear su primera receta sin ayuda técnica.
-   **RNF-02 --- Rendimiento:** operaciones de cálculo comunes deben
    actualizar la interfaz sin demoras perceptibles con cientos o
    algunos miles de registros.
-   **RNF-03 --- Integridad:** los importes y movimientos deben
    persistirse de forma consistente.
-   **RNF-04 --- Precisión:** usar aritmética decimal para cálculos
    monetarios; evitar errores de coma flotante binaria en valores de
    dinero.
-   **RNF-05 --- Seguridad:** validar entradas en cliente y servidor;
    proteger sesiones y credenciales si existe backend.
-   **RNF-06 --- Respaldo:** ofrecer un mecanismo de copia y
    recuperación de datos.
-   **RNF-07 --- Accesibilidad:** navegación por teclado, foco visible,
    etiquetas y contraste suficiente.
-   **RNF-08 --- Adaptabilidad:** soportar escritorio, tablet y móvil.
-   **RNF-09 --- Mantenibilidad:** lógica de dominio y cálculos
    separados de la interfaz.
-   **RNF-10 --- Observabilidad:** registrar errores técnicos sin
    guardar información innecesaria.
-   **RNF-11 --- Privacidad:** no compartir ni transmitir datos de
    negocio a terceros sin consentimiento.
-   **RNF-12 --- Compatibilidad:** definir navegadores y versiones
    objetivo durante la implementación.

## 12. Reglas de negocio y cálculos

### Normalización de unidades

El sistema guarda una unidad base por dimensión: - Masa: gramos (g). -
Volumen: mililitros (ml). - Conteo: unidades (u).

Las cantidades de compra y de receta se convierten a la unidad base
cuando pertenecen a la misma dimensión. No convertir automáticamente
gramos a mililitros ni unidades a masa sin una equivalencia explícita.

### Cálculo de costo de ingrediente

`costo_ingrediente = cantidad_usada_base × costo_por_unidad_base`

### Costo de receta

`costo_materia_prima = suma(costo de cada ingrediente)`

`costo_insumos = suma(cantidad de insumo × costo unitario del insumo)`

`costo_lote_estimado = costo_materia_prima + costo_insumos + costos_adicionales`

`costo_unitario_estimado = costo_lote_estimado / rendimiento`

### Precio y ganancia

`ganancia_unitaria = precio_venta − costo_unitario_estimado`

`margen_porcentual = ganancia_unitaria / precio_venta × 100`

`precio_por_recargo = costo_unitario_estimado × (1 + recargo / 100)`

`precio_por_margen = costo_unitario_estimado / (1 − margen / 100)`

Validar división por cero, rendimiento igual a cero, valores negativos y
margen igual o superior a 100 %.

### Reglas de consistencia

-   Una receta con ingredientes sin precio no se considera completa.
-   Una receta con rendimiento cero no se puede publicar.
-   Los productos deben advertir cuando su costo no está actualizado o
    contiene datos faltantes.
-   El precio de venta manual no se sobrescribe automáticamente al
    cambiar el costo; se conserva y se muestra una alerta si el margen
    cae.
-   Los registros históricos de compras y producción son inmutables en
    cuanto a sus importes originales; las correcciones se realizan
    mediante ajustes auditables.
-   Los cálculos deben estar centralizados en una capa de dominio y
    compartirse entre vistas, reportes y exportaciones.

## 13. Modelo de datos conceptual

### Entidades principales

**MateriaPrima** - id - nombre - categoría - proveedor_preferido_id
(opcional) - unidad_base - precio_unitario_base_actual - stock_actual
(derivado de movimientos o mantenido con consistencia) - stock_minimo -
activo - created_at / updated_at

**Insumo** - id - nombre - categoría - unidad_base -
precio_unitario_base_actual - stock_minimo - activo - created_at /
updated_at

**Receta** - id - nombre - descripción - rendimiento -
unidad_rendimiento - estado - created_at / updated_at

**RecetaIngrediente** - id - receta_id - materia_prima_id - cantidad -
unidad - orden

**RecetaInsumo** - id - receta_id - insumo_id - cantidad_por_lote o
cantidad_por_unidad - unidad - regla_aplicación

**Producto** - id - nombre - receta_id - presentación -
precio_venta_actual - método_precio (manual, margen, recargo) -
objetivo_porcentual - activo - created_at / updated_at

**Compra** - id - fecha - proveedor - total - nota

**CompraDetalle** - id - compra_id - tipo_artículo - artículo_id -
cantidad - unidad - precio_total - costo_unitario_calculado

**MovimientoStock** - id - tipo_artículo - artículo_id -
tipo_movimiento - cantidad_base (positiva o signo definido
consistentemente) - fecha - motivo - referencia_tipo / referencia_id

**HistorialPrecio** - id - tipo_artículo - artículo_id -
precio_anterior - precio_nuevo - fecha - origen (edición, compra u otro)

**Producción** - id - producto_id o receta_id - cantidad_lotes -
unidades_producidas - costo_estimado_al_confirmar - fecha - notas

**Configuración** - moneda - preferencias de visualización - reglas
básicas de stock

Los identificadores de artículos de distintos tipos pueden modelarse con
tablas separadas o una tabla común de artículos. La decisión final debe
priorizar integridad referencial y simplicidad del código.

## 14. Arquitectura técnica propuesta

La arquitectura concreta debe validarse según dónde se usará la
aplicación y si necesita sincronización entre dispositivos.

### Opción recomendada para un MVP

-   **Frontend:** React + TypeScript + Vite.
-   **UI:** Tailwind CSS y una biblioteca de componentes accesibles o
    componentes propios consistentes.
-   **Formularios y validación:** React Hook Form + Zod, o alternativas
    equivalentes.
-   **Estado de servidor:** TanStack Query si existe API.
-   **Backend:** Python + FastAPI, o una API TypeScript si el equipo
    prefiere un único lenguaje.
-   **Persistencia:** SQLite para una primera instalación local de un
    solo usuario; PostgreSQL si se necesita despliegue multiusuario o
    acceso concurrente.
-   **Pruebas:** Vitest y Testing Library en frontend; Pytest en backend
    si se usa Python.
-   **Despliegue:** decidir después de validar si la app será local, web
    privada o accesible desde varios dispositivos.

No implementar ambas opciones de backend. Elegir una en función de
experiencia del desarrollador y requisitos de despliegue.

### Separación por capas

1.  **Presentación:** páginas, componentes, formularios, accesibilidad y
    navegación.
2.  **Aplicación:** casos de uso como crear receta, registrar compra,
    confirmar producción y exportar datos.
3.  **Dominio:** entidades, reglas de negocio, conversiones de unidades
    y cálculos de costos.
4.  **Persistencia:** repositorios y acceso a la base de datos.
5.  **Infraestructura:** autenticación, copias de seguridad,
    importación/exportación y despliegue.

La interfaz no debe contener las fórmulas definitivas. Las reglas de
negocio se prueban de forma independiente para que todas las pantallas
muestren los mismos resultados.

## 15. Despliegue en Vercel y estrategia de persistencia

El frontend debe poder compilarse y desplegarse en Vercel. **Vercel aloja la interfaz, pero no debe tratarse como una base de datos persistente ni como un servidor tradicional que conserva archivos locales entre ejecuciones.** La persistencia debe resolverse con un servicio externo compatible.

### Configuración recomendada para una aplicación web real
- **Frontend:** React + TypeScript + Vite, desplegado en Vercel.
- **Base de datos y autenticación:** Supabase (PostgreSQL y Auth) como opción inicial sencilla, o un backend/API separado.
- **Secretos:** variables de entorno configuradas en Vercel; nunca incluir claves privadas en el código del frontend.
- **API:** llamadas al proveedor de persistencia mediante un cliente seguro y políticas de acceso. Si se usa una API propia, desplegarla en un servicio compatible y configurar CORS y autenticación.
- **Migraciones:** mantener el esquema de base de datos y las migraciones versionados en el repositorio.
- **Ambientes:** separar desarrollo, preview y producción; usar datos de prueba en previews.
- **Respaldo:** configurar y verificar copias de seguridad de la base de datos. La exportación CSV de la aplicación no sustituye por sí sola un backup completo.

### Configuración de build para Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`
- Framework preset: Vite
- No configurar reglas de rewrites de SPA sin necesidad; si se usa React Router con rutas del lado del cliente, configurar el fallback correspondiente para que las rutas profundas no devuelvan 404.

### Persistencia y arquitectura
No usar SQLite guardado en el sistema de archivos de una función serverless como almacenamiento duradero de producción. SQLite puede servir para desarrollo local o una instalación local de un solo usuario, pero para una app publicada en Vercel con datos que deben persistir se recomienda PostgreSQL administrado.

### Seguridad de claves
- Las variables con prefijo `VITE_` se exponen al navegador; solo pueden contener valores públicos.
- Nunca colocar claves `service_role`, contraseñas de base de datos o secretos de servidor en variables `VITE_`.
- Activar políticas de Row Level Security (RLS) y definir reglas para que cada usuaria acceda únicamente a sus propios datos, si hay autenticación.
- Probar permisos de lectura y escritura con sesiones reales antes de publicar.

### Lista de comprobación para publicar
1. El proyecto compila localmente con `npm run build`.
2. El repositorio contiene un `README.md` con instrucciones de instalación y configuración.
3. Las variables de entorno necesarias están documentadas en `.env.example`, sin secretos reales.
4. La base de datos de producción está configurada y sus migraciones aplicadas.
5. La autenticación y las políticas de acceso están probadas.
6. La aplicación no depende de archivos locales para conservar datos de usuarias.
7. Se verifican las rutas, formularios, cálculos y estados de error en la URL de preview de Vercel.
8. Se verifica el dominio definitivo y se configura una política de respaldo.

## 16. Seguridad, privacidad y recuperación

-   Si la aplicación es solo local, documentar dónde se guardan los
    datos y cómo respaldarlos.
-   Si es web, usar autenticación y autorización apropiadas; no confiar
    solo en validaciones del navegador.
-   Proteger secretos mediante variables de entorno y nunca subir
    credenciales al repositorio.
-   Validar tipos, límites y referencias de todas las entradas.
-   Evitar borrar de forma irreversible recetas, artículos o movimientos
    que ya estén vinculados a registros históricos; preferir archivar.
-   Implementar exportación de respaldo y probar la restauración.
-   No incluir datos personales innecesarios en logs.
-   Si hay múltiples usuarios, definir propiedad de datos, aislamiento y
    permisos antes de desplegar.

## 17. Estrategia de pruebas

### Pruebas unitarias de dominio

-   Conversión kg ↔ g y L ↔ ml.
-   Rechazo de conversiones incompatibles.
-   Costo de ingredientes y receta.
-   Costo unitario según rendimiento.
-   Precio por margen y por recargo.
-   Redondeo y presentación de moneda.
-   Validación de margen inválido.
-   Cambios de precios y recálculo de dependencias.
-   Movimientos y stock resultante.

### Pruebas de integración

-   Crear materia prima y usarla en una receta.
-   Registrar compra y comprobar actualización de stock y precio de
    referencia.
-   Modificar un precio y comprobar que el costo actual de las recetas
    cambia.
-   Confirmar producción y comprobar el descuento de existencias.
-   Archivar un ingrediente usado históricamente sin romper consultas.

### Pruebas de interfaz / E2E

-   Crear la primera receta desde un estado vacío.
-   Editar cantidades y comprobar actualización del costo.
-   Configurar precio de venta.
-   Registrar compra.
-   Resolver una alerta de stock bajo.
-   Usar la app en viewport móvil.
-   Comprobar navegación por teclado y mensajes de error.

### Casos numéricos de aceptación

1.  Compra de 1.000 g de harina por \$1.800; receta usa 250 g → costo de
    harina: \$450.
2.  Si la receta cuesta \$6.000 y rinde 12 unidades → costo unitario:
    \$500.
3.  Costo unitario de \$500 con recargo del 40 % → precio sugerido:
    \$700; ganancia estimada: \$200; margen sobre venta aproximado:
    28,57 %.
4.  Costo unitario de \$500 con margen objetivo del 40 % → precio
    sugerido: \$833,33; ganancia aproximada: \$333,33.
5.  Si se modifica el precio de la harina, las recetas actuales deben
    recalcularse sin alterar el costo registrado en producciones
    históricas.
6.  Una receta con rendimiento cero o ingrediente sin precio debe
    mostrar un error o advertencia y no presentarse como lista para
    vender.

## 18. MVP y fases

### Fase 0 --- Descubrimiento y validación

-   Confirmar tipos de productos que elabora la usuaria.
-   Obtener una copia de la planilla actual y revisar columnas, fórmulas
    y errores frecuentes.
-   Acordar qué significa "ganancia" para ella: margen sobre venta o
    recargo sobre costo.
-   Definir si necesita usar la app desde más de un dispositivo.
-   Validar unidades habituales y cómo calcula el stock.
-   Probar un prototipo navegable antes de desarrollar toda la lógica.

### Fase 1 --- MVP usable

-   Dashboard básico.
-   CRUD de materias primas e insumos.
-   Unidades y conversiones esenciales.
-   Editor de recetas con rendimiento.
-   Cálculo automático de costos por lote y unidad.
-   Producto, precio de venta, margen y recargo.
-   Registro de stock, compras y ajustes.
-   Alertas de stock bajo y datos incompletos.
-   Persistencia confiable y respaldo básico.
-   Diseño responsive y componentes visuales consistentes.
-   Pruebas unitarias de cálculos.

### Fase 2 --- Calidad operativa

-   Confirmación de producción y descuento automático de stock.
-   Historial de precios y productos afectados.
-   Exportación CSV.
-   Reporte de costos y márgenes.
-   Restauración de respaldo probada.
-   Pruebas E2E de flujos principales.

### Fase 3 --- Mejoras posteriores

-   Costos indirectos avanzados.
-   Merma porcentual configurable.
-   Lotes y vencimientos.
-   Promedio ponderado de inventario.
-   Importación desde Excel/CSV.
-   Variantes de presentación y recetas escalables.
-   Historial de rentabilidad por período.
-   Multiusuario y permisos si surge la necesidad.

## 19. Criterios de aceptación del MVP

El MVP se considera listo cuando: - La usuaria puede registrar una
materia prima con cantidad, unidad y precio. - Puede crear una receta y
agregar ingredientes sin escribir fórmulas. - El costo del lote y el
costo por unidad se actualizan automáticamente. - Puede registrar
insumos de empaque y contemplarlos en el costo. - Puede definir un
precio de venta y entender la diferencia entre margen y recargo. - Puede
registrar una compra y consultar el stock. - El sistema alerta sobre
existencias bajas. - Un cambio de precio actualiza los costos actuales
relacionados. - Los registros históricos de compras y producción no se
alteran silenciosamente. - Los cálculos clave tienen pruebas
automatizadas. - La interfaz funciona en computadora y celular. - Los
datos pueden respaldarse y recuperarse según el modo de despliegue
elegido. - Una persona que no conoce la implementación puede completar
las tareas principales sin ayuda del desarrollador.

## 20. Riesgos y decisiones pendientes

  -----------------------------------------------------------------------
  Tema                    Riesgo                  Decisión o mitigación
  ----------------------- ----------------------- -----------------------
  Margen vs. recargo      Precio de venta         Mostrar ambos métodos
                          calculado               con explicación y
                          incorrectamente por     ejemplos
                          confusión conceptual    

  Unidades                Costos erróneos por     Conversión por
                          mezclar gramos,         dimensión y
                          mililitros y unidades   validaciones estrictas

  Cambios de precios      Cambiar la historia de  Separar costo actual de
                          costos pasados          snapshots históricos

  Stock                   Existencias negativas o Historial de
                          movimientos sin         movimientos y
                          explicación             confirmación

  Costos omitidos         Precio sugerido         Campo de costos
                          demasiado bajo          adicionales y
                                                  advertencias sobre
                                                  alcance

  Datos perdidos          Pérdida de recetas y    Exportación y
                          precios                 restauración de copias

  Exceso de alcance       Demorar la entrega con  Cerrar el MVP y
                          funciones avanzadas     priorizar los flujos
                                                  principales

  Diseño sobrecargado     Interfaz atractiva pero Priorizar jerarquía,
                          lenta de usar           claridad y tareas
                                                  frecuentes
  -----------------------------------------------------------------------

### Preguntas que deben resolverse con la usuaria

1.  ¿Qué productos fabrica y vende actualmente?
2.  ¿Las recetas suelen expresarse en gramos, mililitros, unidades,
    docenas u otras medidas?
3.  ¿Quiere que el stock se descuente automáticamente al registrar
    producción o solo consultarlo y modificarlo manualmente?
4.  ¿Necesita calcular el costo por lote, por unidad, por caja y por
    presentación?
5.  ¿Incluye gas, electricidad, mano de obra, comisiones, desperdicio o
    impuestos en el costo?
6.  ¿Quiere fijar un porcentaje de ganancia o introducir un precio de
    venta y ver cuánto gana?
7.  ¿La aplicación se usará en una sola computadora o desde celular y
    computadora?
8.  ¿Es necesario importar los datos de la planilla actual?
9.  ¿Qué información necesita ver en una impresión o exportación?
10. ¿Los precios se cargan siempre en pesos argentinos?

## 21. Recomendación final

Construir primero un flujo completo y confiable para NÚCLEO: **materia prima →
receta → costo por unidad → precio de venta → stock**. El valor
diferencial está en que todo esté vinculado y el recálculo sea
automático, con explicaciones transparentes y sin fórmulas manuales.

La interfaz debe destacar el costo unitario, el precio sugerido, la
ganancia estimada y las alertas de stock, pero no ocultar los
componentes del cálculo. Antes de definir presupuesto y fecha de
entrega, validar el documento con la usuaria y revisar su planilla
actual: eso permitirá ajustar el alcance a su operación real y evitar
desarrollar funcionalidades que no necesita.
