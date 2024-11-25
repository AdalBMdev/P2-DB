// server.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Conexión a MongoDB
mongoose.connect('mongodb://admin:adminpassword@localhost:27017/eventRecommendationSystem')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Importar modelos
const User = require('./models/user');
const Event = require('./models/Event');

app.use(express.json());

// *** Implementación de Redis ***
const redis = require('redis');
const redisClient = redis.createClient();

redisClient.on('error', (err) => {
  console.error('Error de Redis:', err);
});

redisClient.connect()
  .then(() => console.log('Conectado a Redis'))
  .catch(err => console.error('Error al conectar a Redis:', err));

// Función para validar ObjectId (opcional)
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// 1. Obtener eventos que le gusten al usuario (con caché)
app.get('/api/events/:userId', async (req, res) => {
  try {
    const userId = req.params.userId.trim();

    if (!isValidObjectId(userId)) {
      return res.status(400).send('ID de usuario no válido');
    }

    // Verificar si los eventos están en la caché
    const cacheKey = `events:${userId}`;
    const cachedEvents = await redisClient.get(cacheKey);

    if (cachedEvents) {
      console.log('Obteniendo eventos desde la caché');
      return res.json(JSON.parse(cachedEvents));
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).send('Usuario no encontrado');

    const events = await Event.find({ category: { $in: user.preferences } });

    // Almacenar en la caché con expiración de 1 hora
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(events));

    res.json(events);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 2. Obtener eventos gratis que le gusten al usuario (con caché)
app.get('/api/events/free/:userId', async (req, res) => {
  try {
    const userId = req.params.userId.trim();

    if (!isValidObjectId(userId)) {
      return res.status(400).send('ID de usuario no válido');
    }

    const cacheKey = `eventsFree:${userId}`;
    const cachedEvents = await redisClient.get(cacheKey);

    if (cachedEvents) {
      console.log('Obteniendo eventos gratuitos desde la caché');
      return res.json(JSON.parse(cachedEvents));
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).send('Usuario no encontrado');

    const events = await Event.find({
      category: { $in: user.preferences },
      $or: [
        { 'status.isPaid': { $exists: false } },
        { 'status.isPaid': false }
      ]
    });

    // Almacenar en la caché
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(events));

    res.json(events);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 3. Obtener eventos de pago que le gusten al usuario (con caché)
app.get('/api/events/paid/:userId', async (req, res) => {
  try {
    const userId = req.params.userId.trim();

    if (!isValidObjectId(userId)) {
      return res.status(400).send('ID de usuario no válido');
    }

    const cacheKey = `eventsPaid:${userId}`;
    const cachedEvents = await redisClient.get(cacheKey);

    if (cachedEvents) {
      console.log('Obteniendo eventos de pago desde la caché');
      return res.json(JSON.parse(cachedEvents));
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).send('Usuario no encontrado');

    const events = await Event.find({
      category: { $in: user.preferences },
      'status.isPaid': true
    });

    // Almacenar en la caché
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(events));

    res.json(events);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 4. Obtener eventos para mayores de edad que le gusten al usuario (con caché)
app.get('/api/events/age-restricted/:userId', async (req, res) => {
  try {
    const userId = req.params.userId.trim();

    if (!isValidObjectId(userId)) {
      return res.status(400).send('ID de usuario no válido');
    }

    const cacheKey = `eventsAgeRestricted:${userId}`;
    const cachedEvents = await redisClient.get(cacheKey);

    if (cachedEvents) {
      console.log('Obteniendo eventos para mayores de edad desde la caché');
      return res.json(JSON.parse(cachedEvents));
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).send('Usuario no encontrado');

    const events = await Event.find({
      category: { $in: user.preferences },
      'status.requiresAgeVerification': true
    });

    // Almacenar en la caché
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(events));

    res.json(events);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 5. Obtener eventos sin restricción de edad que le gusten al usuario (con caché)
app.get('/api/events/no-age-restriction/:userId', async (req, res) => {
  try {
    const userId = req.params.userId.trim();

    if (!isValidObjectId(userId)) {
      return res.status(400).send('ID de usuario no válido');
    }

    const cacheKey = `eventsNoAgeRestriction:${userId}`;
    const cachedEvents = await redisClient.get(cacheKey);

    if (cachedEvents) {
      console.log('Obteniendo eventos sin restricción de edad desde la caché');
      return res.json(JSON.parse(cachedEvents));
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).send('Usuario no encontrado');

    const events = await Event.find({
      category: { $in: user.preferences },
      $or: [
        { 'status.requiresAgeVerification': { $exists: false } },
        { 'status.requiresAgeVerification': false }
      ]
    });

    // Almacenar en la caché
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(events));

    res.json(events);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 6. Obtener eventos en una ciudad específica que le gusten al usuario (con caché)
app.get('/api/events/city/:city/:userId', async (req, res) => {
  try {
    const city = req.params.city.trim();
    const userId = req.params.userId.trim();

    if (!isValidObjectId(userId)) {
      return res.status(400).send('ID de usuario no válido');
    }

    const cacheKey = `eventsCity:${city}:${userId}`;
    const cachedEvents = await redisClient.get(cacheKey);

    if (cachedEvents) {
      console.log('Obteniendo eventos en la ciudad desde la caché');
      return res.json(JSON.parse(cachedEvents));
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).send('Usuario no encontrado');

    const events = await Event.find({
      category: { $in: user.preferences },
      'location.city': city
    });

    // Almacenar en la caché
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(events));

    res.json(events);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
