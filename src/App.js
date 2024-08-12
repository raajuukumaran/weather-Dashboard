// App.js
import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import './App.css'; // Import your CSS for styling

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_KEY = 'a378e4002f8f58feb8bd4dcdcbbc3391'; // Replace with your actual API key
const AUTOCOMPLETE_URL = 'http://api.openweathermap.org/data/2.5/find'; // URL for city autocomplete

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('');
  const [chartData, setChartData] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const fetchWeather = async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );
      const data = response.data;

      // Process data for chart
      const days = data.list.filter(item => item.dt_txt.includes("12:00:00"));
      const labels = days.map(item => new Date(item.dt_txt).toLocaleDateString());
      const temperatures = days.map(item => item.main.temp);
      const windSpeeds = days.map(item => item.wind.speed);
      const humidities = days.map(item => item.main.humidity);

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
          },
          {
            label: 'Humidity (%)',
            data: humidities,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      setWeatherData(null);
      setError('Error fetching weather data. Please try another city.');
      console.error('Error fetching weather data:', error);
    }
  };

  const fetchCitySuggestions = async (value) => {
    try {
      const response = await axios.get(
        `${AUTOCOMPLETE_URL}?q=${encodeURIComponent(value)}&appid=${API_KEY}`
      );
      const cities = response.data.list;
      setSuggestions(cities.map(city => ({
        id: city.id,
        name: `${city.name}, ${city.sys.country}`,
      })));
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
    }
  };

  const handleSearch = (event, value) => {
    event.preventDefault();
    if (value.trim() !== '') {
      fetchWeather(value);
      setCity('');
    }
  };

  return (
    <div className="App">
      <h1>Weather Dashboard</h1>
      <div className="weather-form-container">
        <form onSubmit={(event) => handleSearch(event, city)} className="weather-form">
          <Autocomplete
            freeSolo
            options={suggestions.map((option) => option.name)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Enter city"
                variant="outlined"
                onChange={(e) => fetchCitySuggestions(e.target.value)}
              />
            )}
            onChange={(event, newValue) => {
              setCity(newValue);
              if (newValue) {
                fetchWeather(newValue);
                setSuggestions([]);
              }
            }}
          />
        
        </form>
      </div>
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

const WeatherCard = ({ data }) => {
  const { city, list } = data;
  const latestData = list[0];
  const temperature = latestData.main.temp;
  const weatherDescription = latestData.weather[0].description;
  const windSpeed = latestData.wind.speed;
  const humidity = latestData.main.humidity;
  const fullAddress = `${city.name}, ${city.country}`; // Adjust based on available address details

  return (
    <div className="weather-card">
      <h2>{fullAddress}</h2>
      <p><strong>Temperature:</strong> {temperature}°C</p>
      <p><strong>Condition:</strong> {weatherDescription}</p>
      <p><strong>Wind Speed:</strong> {windSpeed} m/s</p>
      <p><strong>Humidity:</strong> {humidity}%</p>
    </div>
  );
};

export default App;
