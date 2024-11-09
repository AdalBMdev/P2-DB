# README.md - Consultas a la Base de Datos

## Descripción General
Este archivo README.md proporciona información detallada sobre los scripts y consultas a la base de datos relacionados con eventos y usuarios. Los métodos están estructurados para responder a diversas necesidades de búsqueda y filtrado de eventos basados en las preferencias del usuario.

### Estructura de la Base de Datos
La base de datos contiene dos colecciones principales:
1. **users**: Almacena datos sobre los usuarios, incluidas sus preferencias de categorías de eventos.
   ```json
   {
     "_id": ObjectId("unique_id"),
     "name": "Ana Santos",
     "preferences": ["música", "arte", "teatro"]
   }
   ```

2. **events**: Almacena información sobre los eventos, como la categoría, el estado de pago, las restricciones de edad y la ubicación.
   ```json
   {
     "_id": ObjectId("unique_id"),
     "name": "Concierto de Jazz",
     "category": "música",
     "status": {
       "isPaid": true,
       "requiresAgeVerification": false
     },
     "location": {
       "city": "Santo Domingo"
     }
   }
   ```

### Descripción de los Scripts de Consulta

1. **Encontrar eventos que le gusten al usuario**:
   - **Descripción**: Busca eventos que coincidan con las preferencias de categorías del usuario.
   - **Script**:
     ```javascript
     const user = db.users.findOne({ name: "Ana Santos" });
     db.events.find({ category: { $in: user.preferences } });
     ```

2. **Encontrar eventos gratis que le gusten al usuario**:
   - **Descripción**: Busca eventos gratuitos que coincidan con las preferencias del usuario.
   - **Script**:
     ```javascript
     db.events.find({
       category: { $in: user.preferences },
       $or: [
         { "status.isPaid": { $exists: false } },
         { "status.isPaid": false }
       ]
     });
     ```

3. **Encontrar eventos de pago que le gusten al usuario**:
   - **Descripción**: Busca eventos de pago dentro de las preferencias del usuario.
   - **Script**:
     ```javascript
     db.events.find({
       category: { $in: user.preferences },
       "status.isPaid": true
     });
     ```

4. **Encontrar eventos para mayores de edad que le gusten al usuario**:
   - **Descripción**: Busca eventos que requieran verificación de edad y que coincidan con las preferencias del usuario.
   - **Script**:
     ```javascript
     db.events.find({
       category: { $in: user.preferences },
       "status.requiresAgeVerification": true
     });
     ```

5. **Encontrar eventos sin restricción de edad que le gusten al usuario**:
   - **Descripción**: Busca eventos sin restricciones de edad que coincidan con las preferencias del usuario.
   - **Script**:
     ```javascript
     db.events.find({
       category: { $in: user.preferences },
       $or: [
         { "status.requiresAgeVerification": { $exists: false } },
         { "status.requiresAgeVerification": false }
       ]
     });
     ```

6. **Encontrar eventos en Santo Domingo que le gusten al usuario**:
   - **Descripción**: Busca eventos en Santo Domingo que coincidan con las preferencias del usuario.
   - **Script**:
     ```javascript
     db.events.find({
       category: { $in: user.preferences },
       "location.city": "Santo Domingo"
     });
     ```

7. **Encontrar eventos en Santiago que le gusten al usuario**:
   - **Descripción**: Busca eventos en Santiago que coincidan con las preferencias del usuario.
   - **Script**:
     ```javascript
     db.events.find({
       category: { $in: user.preferences },
       "location.city": "Santiago"
     });
     ```

### Ejemplos de Uso
#### Ejemplo 1: Consultar eventos que le gusten a Ana Santos
- **Consulta**:
  ```javascript
  const user = db.users.findOne({ name: "Ana Santos" });
  db.events.find({ category: { $in: user.preferences } });
  ```
- **Resultado esperado**:
  Una lista de eventos que coincidan con las preferencias de Ana Santos.

#### Ejemplo 2: Consultar eventos gratuitos en Santo Domingo
- **Consulta**:
  ```javascript
  db.events.find({
    category: { $in: user.preferences },
    $or: [
      { "status.isPaid": { $exists: false } },
      { "status.isPaid": false }
    ],
    "location.city": "Santo Domingo"
  });
  ```
- **Resultado esperado**:
  Una lista de eventos gratuitos en Santo Domingo que sean del gusto de Ana Santos.

## Conclusión
Este `README.md` proporciona las consultas esenciales para la búsqueda de eventos basados en las preferencias del usuario, la ubicación y otras condiciones específicas. Cada método facilita una búsqueda eficiente y personalizada en la base de datos.

