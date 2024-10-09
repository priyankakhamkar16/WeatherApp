const express = require('express');
const axios = require('axios');
const History = require('../models/History');
const router = express.Router();

// Get current and forecast weather data
router.get('/weather/:city', async (req, res) => {
  const city = req.params.city;
  
  try {
    // Fetch current weather data
    const currentWeather = await axios.get('https://weatherapi-com.p.rapidapi.com/current.json', {
      params: { q: city },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
      }
    });

    // Log current weather data
    console.log('Current Weather Response:', currentWeather.data);
    
    // Fetch 10 days forecast
    const forecastWeather = await axios.get('https://weatherapi-com.p.rapidapi.com/forecast.json', {
      params: { q: city, days: 10 },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
      }
    });

    // Log forecast weather data
    console.log('Forecast Weather Response:', forecastWeather.data);

    // Save search history in MongoDB
    const history = new History({ city });
    await history.save();

    // Respond with current and forecast data
    res.json({
      current: currentWeather.data,
      forecast: forecastWeather.data.forecast.forecastday,
    });
  } catch (error) {
    console.error('Error fetching weather data:', error.message || error.response?.data);
    res.status(error.response?.status || 500).json({ error: error.message || 'Server error' });
  }
});

// Get search history
router.get('/history', async (req, res) => {
  try {
    const history = await History.find().sort({ date: -1 });
    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
