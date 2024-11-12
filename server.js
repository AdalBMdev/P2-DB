const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://admin:adminpassword@localhost:27017/eventRecommendationSystem')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

const User = require('./models/user');
const Event = require('./models/Event');

app.use(express.json());

// 1. Obtener eventos que le gusten al usuario
app.get('/api/events/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('Usuario no encontrado');

    const events = await Event.find({ category: { $in: user.preferences } });
    res.json(events);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 2. Obtener eventos gratis que le gusten al usuario
app.get('/api/events/free/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('Usuario no encontrado');

    const events = await Event.find({
      category: { $in: user.preferences },
      $or: [
        { 'status.isPaid': { $exists: false } },
        { 'status.isPaid': false }
      ]
    });
    res.json(events);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 3. Obtener eventos de pago que le gusten al usuario
app.get('/api/events/paid/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('Usuario no encontrado');

    const events = await Event.find({
      category: { $in: user.preferences },
      'status.isPaid': true
    });
    res.json(events);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 4. Obtener eventos para mayores de edad que le gusten al usuario
app.get('/api/events/age-restricted/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('Usuario no encontrado');

    const events = await Event.find({
      category: { $in: user.preferences },
      'status.requiresAgeVerification': true
    });
    res.json(events);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 5. Obtener eventos sin restricción de edad que le gusten al usuario
app.get('/api/events/no-age-restriction/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('Usuario no encontrado');

    const events = await Event.find({
      category: { $in: user.preferences },
      $or: [
        { 'status.requiresAgeVerification': { $exists: false } },
        { 'status.requiresAgeVerification': false }
      ]
    });
    res.json(events);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 6. Obtener eventos en una ciudad específica que le gusten al usuario
app.get('/api/events/city/:city/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('Usuario no encontrado');

    const events = await Event.find({
      category: { $in: user.preferences },
      'location.city': req.params.city
    });
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
