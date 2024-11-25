# **README: API de Recomendación de Eventos**

## **Introducción**

Esta API está diseñada para recomendar eventos a los usuarios según sus preferencias. Utiliza Node.js, Express y Mongoose para conectarse a una base de datos MongoDB. Los usuarios pueden obtener recomendaciones de eventos basados en categorías, ubicación, costo y restricciones de edad.

---

## **Estructura de la Base de Datos**

La base de datos consta de dos colecciones principales: `users` y `events`.

### **Modelo de Usuario (`User`)**

**Archivo:** `models/User.js`

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  preferences: [String],
  attendedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
});

module.exports = mongoose.model('User', userSchema);
```

**Campos:**

- `name` (String): Nombre del usuario.
- `email` (String): Correo electrónico del usuario.
- `preferences` (Array de Strings): Categorías de eventos que le interesan al usuario.
- `attendedEvents` (Array de ObjectId): Referencias a eventos a los que el usuario ha asistido.

**Ejemplo de Documento:**

```json
{
  "_id": ObjectId("67228d1787fbdef3aa24cd19"),
  "name": "Ana Santos",
  "email": "ana.santos@example.com",
  "preferences": ["música", "cultura"],
  "attendedEvents": []
}
```

### **Modelo de Evento (`Event`)**

**Archivo:** `models/Event.js`

```javascript
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  date: Date,
  location: {
    city: String,
    address: String
  },
  status: {
    isPaid: Boolean,
    requiresAgeVerification: Boolean
  },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Event', eventSchema);
```

**Campos:**

- `name` (String): Nombre del evento.
- `description` (String): Descripción del evento.
- `category` (String): Categoría del evento (e.g., "música", "cultura").
- `date` (Date): Fecha y hora del evento.
- `location` (Objeto):
  - `city` (String): Ciudad donde se llevará a cabo el evento.
  - `address` (String): Dirección específica del evento.
- `status` (Objeto):
  - `isPaid` (Boolean): Indica si el evento es de pago (`true`) o gratuito (`false`).
  - `requiresAgeVerification` (Boolean): Indica si el evento tiene restricción de edad.
- `attendees` (Array de ObjectId): Referencias a usuarios que asistirán al evento.

**Ejemplo de Documento:**

```json
{
  "_id": ObjectId("60f7f1d4e8b9f33d8c9e5678"),
  "name": "Festival de Jazz",
  "description": "Disfruta de una noche de jazz con artistas internacionales.",
  "category": "música",
  "date": ISODate("2024-09-25T20:00:00.000Z"),
  "location": {
    "city": "Santo Domingo",
    "address": "Teatro Nacional"
  },
  "status": {
    "isPaid": true,
    "requiresAgeVerification": false
  },
  "attendees": []
}
```

---

## **Endpoints de la API**

### **1. Obtener eventos que le gusten al usuario**

- **Método HTTP:** `GET`
- **URL:** `/api/events/:userId`
- **Descripción:** Devuelve eventos que coinciden con las preferencias del usuario.
- **Parámetros:**
  - `:userId` - ID del usuario.
- **Ejemplo de Solicitud:**

  ```
  GET http://localhost:3000/api/events/67228d1787fbdef3aa24cd19
  ```

- **Ejemplo de Respuesta:**

  ```json
  [
    {
      "_id": "60f7f1d4e8b9f33d8c9e5678",
      "name": "Festival de Jazz",
      "description": "Disfruta de una noche de jazz con artistas internacionales.",
      "category": "música",
      "date": "2024-09-25T20:00:00.000Z",
      "location": {
        "city": "Santo Domingo",
        "address": "Teatro Nacional"
      },
      "status": {
        "isPaid": true,
        "requiresAgeVerification": false
      },
      "attendees": []
    },
    {
      "_id": "60f7f2e6e8b9f33d8c9e7890",
      "name": "Exposición de Arte Moderno",
      "description": "Una muestra de los mejores artistas modernos.",
      "category": "cultura",
      "date": "2024-10-10T18:00:00.000Z",
      "location": {
        "city": "Santiago",
        "address": "Centro Cultural"
      },
      "status": {
        "isPaid": false,
        "requiresAgeVerification": false
      },
      "attendees": []
    }
  ]
  ```

### **2. Obtener eventos gratuitos que le gusten al usuario**

- **Método HTTP:** `GET`
- **URL:** `/api/events/free/:userId`
- **Descripción:** Devuelve eventos gratuitos que coinciden con las preferencias del usuario.
- **Parámetros:**
  - `:userId` - ID del usuario.
- **Ejemplo de Solicitud:**

  ```
  GET http://localhost:3000/api/events/free/67228d1787fbdef3aa24cd19
  ```

### **3. Obtener eventos de pago que le gusten al usuario**

- **Método HTTP:** `GET`
- **URL:** `/api/events/paid/:userId`
- **Descripción:** Devuelve eventos de pago que coinciden con las preferencias del usuario.
- **Parámetros:**
  - `:userId` - ID del usuario.
- **Ejemplo de Solicitud:**

  ```
  GET http://localhost:3000/api/events/paid/67228d1787fbdef3aa24cd19
  ```

### **4. Obtener eventos para mayores de edad que le gusten al usuario**

- **Método HTTP:** `GET`
- **URL:** `/api/events/age-restricted/:userId`
- **Descripción:** Devuelve eventos que requieren verificación de edad y coinciden con las preferencias del usuario.
- **Parámetros:**
  - `:userId` - ID del usuario.
- **Ejemplo de Solicitud:**

  ```
  GET http://localhost:3000/api/events/age-restricted/67228d1787fbdef3aa24cd19
  ```

### **5. Obtener eventos sin restricción de edad que le gusten al usuario**

- **Método HTTP:** `GET`
- **URL:** `/api/events/no-age-restriction/:userId`
- **Descripción:** Devuelve eventos sin restricción de edad que coinciden con las preferencias del usuario.
- **Parámetros:**
  - `:userId` - ID del usuario.
- **Ejemplo de Solicitud:**

  ```
  GET http://localhost:3000/api/events/no-age-restriction/67228d1787fbdef3aa24cd19
  ```

### **6. Obtener eventos en una ciudad específica que le gusten al usuario**

- **Método HTTP:** `GET`
- **URL:** `/api/events/city/:city/:userId`
- **Descripción:** Devuelve eventos en la ciudad especificada que coinciden con las preferencias del usuario.
- **Parámetros:**
  - `:city` - Nombre de la ciudad.
  - `:userId` - ID del usuario.
- **Ejemplo de Solicitud:**

  ```
  GET http://localhost:3000/api/events/city/Santo%20Domingo/67228d1787fbdef3aa24cd19
  ```

### **7. Crear un nuevo usuario**

- **Método HTTP:** `POST`
- **URL:** `/api/users`
- **Descripción:** Crea un nuevo usuario en la base de datos.
- **Cuerpo de la Solicitud (JSON):**

  ```json
  {
    "name": "Luis Pérez",
    "email": "luis.perez@example.com",
    "preferences": ["deportes", "tecnología"]
  }
  ```

- **Ejemplo de Solicitud:**

  ```
  POST http://localhost:3000/api/users
  ```

### **8. Crear un nuevo evento**

- **Método HTTP:** `POST`
- **URL:** `/api/events`
- **Descripción:** Crea un nuevo evento en la base de datos.
- **Cuerpo de la Solicitud (JSON):**

  ```json
  {
    "name": "Conferencia de Tecnología",
    "description": "Explora las últimas tendencias en tecnología.",
    "category": "tecnología",
    "date": "2024-11-20T09:00:00.000Z",
    "location": {
      "city": "Santo Domingo",
      "address": "Centro de Convenciones"
    },
    "status": {
      "isPaid": true,
      "requiresAgeVerification": false
    }
  }
  ```

- **Ejemplo de Solicitud:**

  ```
  POST http://localhost:3000/api/events
  ```

### **9. Obtener información de un usuario específico**

- **Método HTTP:** `GET`
- **URL:** `/api/users/:userId`
- **Descripción:** Devuelve información del usuario especificado.
- **Parámetros:**
  - `:userId` - ID del usuario.
- **Ejemplo de Solicitud:**

  ```
  GET http://localhost:3000/api/users/67228d1787fbdef3aa24cd19
  ```

### **10. Obtener información de un evento específico**

- **Método HTTP:** `GET`
- **URL:** `/api/events/details/:eventId`
- **Descripción:** Devuelve información del evento especificado.
- **Parámetros:**
  - `:eventId` - ID del evento.
- **Ejemplo de Solicitud:**

  ```
  GET http://localhost:3000/api/events/details/60f7f1d4e8b9f33d8c9e5678
  ```

---

## **Descripción de las Funciones y Métodos**

### **Conexión a MongoDB**

En `server.js`, se establece la conexión a MongoDB utilizando Mongoose:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));
```

**Función:**

- `mongoose.connect(uri)`: Establece una conexión con la base de datos MongoDB usando la URI proporcionada.

### **Definición de Modelos**

Los modelos `User` y `Event` están definidos en archivos separados dentro de la carpeta `models/`. Se utilizan esquemas de Mongoose para definir la estructura de los documentos.

**Función:**

- `mongoose.model(nombre, esquema)`: Crea un modelo de Mongoose basado en el esquema proporcionado.

### **Implementación de Endpoints**

Los endpoints están definidos en `server.js` utilizando las rutas de Express. Cada endpoint maneja una solicitud HTTP y ejecuta una función asíncrona para interactuar con la base de datos.

**Estructura General de un Endpoint:**

```javascript
app.get('/ruta', async (req, res) => {
  try {
    // Lógica del endpoint
    res.json(resultado);
  } catch (error) {
    res.status(500).send(error);
  }
});
```

**Funciones Comunes:**

- `User.findById(userId)`: Busca un usuario por su ID.
- `Event.find(query)`: Busca eventos que coincidan con la consulta proporcionada.
- `Event.findOne(query)`: Encuentra un solo evento que coincida con la consulta.
- `new Model(data)`: Crea una nueva instancia de un modelo.
- `model.save()`: Guarda el documento en la base de datos.

**Ejemplo de Endpoint:**

```javascript
// Obtener eventos que le gusten al usuario
app.get('/api/events/:userId', async (req, res) => {
  try {
    const userId = req.params.userId.trim();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send('ID de usuario no válido');
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).send('Usuario no encontrado');

    const events = await Event.find({ category: { $in: user.preferences } });
    res.json(events);
  } catch (error) {
    res.status(500).send(error);
  }
});
```

**Descripción:**

- **Ruta:** `/api/events/:userId`
- **Método:** `GET`
- **Lógica:**
  1. Se obtiene el `userId` de los parámetros de la URL.
  2. Se valida que el `userId` sea un ObjectId válido.
  3. Se busca el usuario en la base de datos.
  4. Si el usuario existe, se buscan eventos cuya categoría esté en las preferencias del usuario.
  5. Se devuelve la lista de eventos encontrados.

---

## **Ejemplos de Consultas a la Base de Datos**

### **1. Encontrar eventos que le gusten al usuario "Ana Santos"**

```javascript
// Obtener las preferencias del usuario "Ana Santos"
const user = await User.findOne({ name: "Ana Santos" });

// Consultar eventos que coincidan con las categorías preferidas del usuario
const events = await Event.find({ category: { $in: user.preferences } });
```

### **2. Encontrar eventos gratuitos que le gusten al usuario**

```javascript
const events = await Event.find({
  category: { $in: user.preferences },
  $or: [
    { "status.isPaid": { $exists: false } },
    { "status.isPaid": false }
  ]
});
```

### **3. Encontrar eventos de pago que le gusten al usuario**

```javascript
const events = await Event.find({
  category: { $in: user.preferences },
  "status.isPaid": true
});
```

### **4. Encontrar eventos para mayores de edad que le gusten al usuario**

```javascript
const events = await Event.find({
  category: { $in: user.preferences },
  "status.requiresAgeVerification": true
});
```

### **5. Encontrar eventos sin restricción de edad que le gusten al usuario**

```javascript
const events = await Event.find({
  category: { $in: user.preferences },
  $or: [
    { "status.requiresAgeVerification": { $exists: false } },
    { "status.requiresAgeVerification": false }
  ]
});
```

### **6. Encontrar eventos en Santo Domingo que le gusten al usuario**

```javascript
const events = await Event.find({
  category: { $in: user.preferences },
  "location.city": "Santo Domingo"
});
```

Redis:

docker run -d -p 6379:6379 --name redis redis
