import { useState, useEffect } from "react";
import "./App.css";

import clearIcon from "./assets/clear.jpg";
import cloudIcon from "./assets/cloudyyy.jpg";
import drizzleIcon from "./assets/drizzlee.jpg";
import humidityIcon from "./assets/humidity.jpg";
import rainIcon from "./assets/rainn.jpg";
import searchhIcon from "./assets/searchh.jpg";
import snowyIcon from "./assets/snowy.jpg";
import windyIcon from "./assets/windyy.jpg";

const WeatherDetails = ({ icon, temp, city, country, lat, long, humidity, wind, currentTime }) => {
  return (
    <div className="weather-details">
      <div className="image-container">
        <img src={icon} alt="Weather Icon" />
      </div>
      <div className="temp">{temp}℃</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">Latitude: </span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="long">Longitude: </span>
          <span>{long}</span>
        </div>
      </div>
      <div className="time-container">
        <div className="time">{currentTime}</div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="Humidity" className="icon" />
          <div className="data">
            <div className="humidity-percent">{humidity} %</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windyIcon} alt="Wind Speed" className="icon" />
          <div className="data">
            <div className="wind-percent">{wind} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  let api_key = `f3a8edd65e44692dff07be04d10a9ca2`;
  const [text, setText] = useState("Coimbatore");
  const [icon, setIcon] = useState(windyIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("Coimbatore");
  const [country, setCountry] = useState("IN");
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [wind, setWind] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const storedWeather = localStorage.getItem("weatherData");
    const storedCity = localStorage.getItem("lastSearchedCity");
    const storedTime = localStorage.getItem("currentTime");

    if (storedWeather) {
      const data = JSON.parse(storedWeather);
      setTemp(data.temp);
      setCity(data.city);
      setCountry(data.country);
      setLat(data.lat);
      setLong(data.long);
      setWind(data.wind);
      setHumidity(data.humidity);
      setIcon(data.icon);
    }

    if (storedCity) {
      setText(storedCity);
    }

    if (storedTime) {
      setCurrentTime(storedTime);
    }

    // Update the time every second
    const timeInterval = setInterval(() => {
      const date = new Date();
      const time = date.toLocaleString();
      setCurrentTime(time);
      localStorage.setItem("currentTime", time); // Save the updated time to localStorage
    }, 1000); // Update every 1 second

    // Cleanup the interval when the component unmounts
    return () => clearInterval(timeInterval);
  }, []);

  const search = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;
    try {
      let res = await fetch(url);
      let data = await res.json();
      if (res.ok) {
        const weatherData = {
          temp: Math.round(data.main.temp),
          city: data.name,
          country: data.sys.country,
          lat: data.coord.lat,
          long: data.coord.lon,
          wind: data.wind.speed,
          humidity: data.main.humidity,
          icon:
            data.weather[0].main === "Clear"
              ? clearIcon
              : data.weather[0].main === "Clouds"
              ? cloudIcon
              : data.weather[0].main === "Rain"
              ? rainIcon
              : data.weather[0].main === "Drizzle"
              ? drizzleIcon
              : data.weather[0].main === "Snow"
              ? snowyIcon
              : windyIcon,
        };
        setTemp(weatherData.temp);
        setCity(weatherData.city);
        setCountry(weatherData.country);
        setLat(weatherData.lat);
        setLong(weatherData.long);
        setWind(weatherData.wind);
        setHumidity(weatherData.humidity);
        setIcon(weatherData.icon);

        // Get current time based on coordinates
        const date = new Date();
        const time = date.toLocaleString();
        setCurrentTime(time);
        localStorage.setItem("currentTime", time); // Save the current time to localStorage

        setCityNotFound(false);
        localStorage.setItem("weatherData", JSON.stringify(weatherData));
        localStorage.setItem("lastSearchedCity", text);
      } else {
        setCityNotFound(true);
      }
    } catch (error) {
      setCityNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  return (
    <>
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            className="cityInput"
            placeholder="Search City"
            onChange={handleCity}
            value={text}
            onKeyDown={handleKeyDown}
          />
          <div className="search-icon" onClick={() => search()}>
            <img src={searchhIcon} alt="Search" />
          </div>
        </div>
        {cityNotFound && <p className="error">City not found. Please try again.</p>}
        <WeatherDetails
          icon={icon}
          temp={temp}
          city={city}
          country={country}
          lat={lat}
          long={long}
          humidity={humidity}
          wind={wind}
          currentTime={currentTime}
        />
        <p className="copyright">
          Designed by <span>NagulJ</span>
        </p>
      </div>
    </>
  );
}

export default App;
