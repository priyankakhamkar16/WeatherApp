import React, { useState } from 'react';
import axios from 'axios';
import '../styles/weather.css';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/weather/${city}`);
      setWeatherData(response.data);
      console.log('Weather Data:', response.data); // Debug log
      setIsAnimated(true);
      setError(null);
    } catch (error) {
      console.error('Error fetching weather:', error.response?.data || error.message);
      setError('Error fetching weather data');
    }
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[date.getDay()];
  };

  return (
    <div className="weather-container">
      <h1 className="app-title">Want to check the weather in your city?</h1>
      <div className="input-container">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          className="city-input"
        />
        <button onClick={fetchWeather} className="get-weather-button">Get Weather</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {weatherData ? (
        <>
          <div className="weather-info">
            <div className="today-weather">
              <h2 className="location">
                Weather in {weatherData.current?.location?.name || 'Unknown'}
              </h2>
              <p className={`temperature ${isAnimated ? 'fade-in' : ''}`}>
                {weatherData.current?.current?.temp_c || 'N/A'}°C
              </p>
              <p className={`condition ${isAnimated ? 'fade-in' : ''}`}>
                {weatherData.current?.current?.condition?.text || 'N/A'}
              </p>
            </div>
          </div>

          <h3 className="forecast-title">Next Few Days Forecast</h3>
          {Array.isArray(weatherData.forecast) && weatherData.forecast.length > 0 ? (
            <ul className="forecast-list-horizontal">
              {weatherData.forecast.map((day) => (
                <li key={day.date} className="forecast-item-horizontal">
                  <strong>{getDayName(day.date)}</strong>: {day.day.avgtemp_c}°C
                  <br />
                  {day.day.condition.text}
                </li>
              ))}
            </ul>
          ) : (
            <p>No forecast data available.</p>
          )}
        </>
      ) : (
        <p className="placeholder-text">Please enter a city to get the weather information.</p>
      )}
    </div>
  );
};

export default Weather;
