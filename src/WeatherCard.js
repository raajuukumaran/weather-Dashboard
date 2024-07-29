import React from 'react';

function WeatherCard({ data }) {
  // Extracting relevant data
  const { name, main, weather, wind } = data;

  // Format temperature
  const temperature = main?.temp;
  const weatherDescription = weather?.[0]?.description;
  const windSpeed = wind?.speed;

  return (
    <div className="weather-card">
      <h2>{name}</h2>
      <p><strong>Temperature:</strong> {temperature}°C</p>
      <p><strong>Condition:</strong> {weatherDescription}</p>
      <p><strong>Wind Speed:</strong> {windSpeed} m/s</p>
    </div>
  );
}

export default WeatherCard;
