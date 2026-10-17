# Tabla de decisión - Checkout Sauce Demo

## Condiciones

| #  | Condición                         | Valores posibles |
|----|-----------------------------------|------------------|
| C1 | Usuario logueado                  | Sí / No          |
| C2 | Carrito tiene al menos 1 producto | Sí / No          |
| C3 | Campos de checkout completos      | Sí / No          |
| C4 | Código postal válido              | Sí / No          |

## Reglas (acciones)

| Regla | C1 | C2 | C3 | C4 | Acción esperada                                      |
|-------|----|----|----|----|------------------------------------------------------|
| R1    | Sí | Sí | Sí | Sí | Checkout exitoso → página de confirmación            |
| R2    | Sí | Sí | Sí | No | Error: "Error: Postal Code is required"              |
| R3    | Sí | Sí | No | -  | Error: campos requeridos                             |
| R4    | Sí | No | -  | -  | No se puede avanzar (carrito vacío)                  |
| R5    | No | -  | -  | -  | Redirección a login                                  |
| R6    | Sí | Sí | Sí | Sí (formato inválido) | Error de validación de formato de código postal |
