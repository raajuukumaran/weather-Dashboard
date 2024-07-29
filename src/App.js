import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './App.css'; // Import your CSS for styling

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_KEY = 'a378e4002f8f58feb8bd4dcdcbbc3391'; // Replace with your actual API key

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('');
  const [chartData, setChartData] = useState(null);

  const fetchWeather = async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = response.data;

      // Process data for chart
      const days = data.list.filter(item => item.dt_txt.includes("12:00:00"));
      const labels = days.map(item => new Date(item.dt_txt).toLocaleDateString());
      const temperatures = days.map(item => item.main.temp);
      const windSpeeds = days.map(item => item.wind.speed);

      setWeatherData(data);
      setError(null);
      setChartData({
        labels,
        datasets: [
          {
            label: 'Temperature (°C)',
            data: temperatures,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
          {
            label: 'Wind Speed (m/s)',
            data: windSpeeds,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          }
        ]
      });
    } catch (error) {
      setWeatherData(null);
      setError('Error fetching weather data. Please try another city.');
      console.error('Error fetching weather data:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim() !== '') {
      fetchWeather(city);
      setCity('');
    }
  };

  const WeatherForm = () => (
    <div className="weather-form-container">
      <form onSubmit={handleSearch} className="weather-form">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          className="weather-input"
        />
        <button type="submit" className="weather-button">Search</button>
      </form>
    </div>
  );

  const WeatherCard = ({ data }) => {
    const { city, list } = data;
    const latestData = list[0];
    const temperature = latestData.main.temp;
    const weatherDescription = latestData.weather[0].description;
    const windSpeed = latestData.wind.speed;

    return (
      <div className="weather-card">
        <h2>{city.name}</h2>
        <p><strong>Temperature:</strong> {temperature}°C</p>
        <p><strong>Condition:</strong> {weatherDescription}</p>
        <p><strong>Wind Speed:</strong> {windSpeed} m/s</p>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Weather Dashboard</h1>
      <WeatherForm />
      {error && <p className="error-message">{error}</p>}
      {weatherData && (
        <>
          <WeatherCard data={weatherData} />
          {chartData && (
            <div className="chart-container">
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: `Weather Data for ${weatherData.city.name} Over the Week`,
                    },
                  },
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
