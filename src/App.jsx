import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      if (position.coords.latitude && position.coords.longitude) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      }
    });
  }, [lat, long]);

  useEffect(() => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${process.env.REACT_APP_API_KEY}`;
    if (lat && long) {
      axios.get(url).then((response) => {
        if (response.status === 200) {
          setData(response.data);
        }
      });
    }
  }, [lat, long]);


  const searchLocation = (event) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${process.env.REACT_APP_API_KEY}`;
    if (event.key === "Enter") {
      axios.get(url).then((response) => {
        setData(response.data);
        setHistoryList((list) => [...list, data]);
      });
      setLocation("");
    }
  };

  const searchLocationByName = (name) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${name}&units=metric&appid=${process.env.REACT_APP_API_KEY}`;

    axios.get(url).then((response) => {
      setData(response.data);
      setHistoryList((list) => [...list, data]);
    });

    setLocation("");
  };


  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyUp={searchLocation}
          placeholder="Enter Location"
          type="text"
        />
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            {data.main ? <h1>{data.main.temp.toFixed()}°C</h1> : null}
          </div>
          <div className="description">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
          <div className="top">Search History</div>
          {historyList &&
            historyList
              .map((search, index) => (
                <div key={index}>
                  <li>
                    <button onClick={() => searchLocationByName(search.name)}>
                      {search.name}
                    </button>
                  </li>
                </div>
              ))
              .reverse()
              .slice(0, 5)}
        </div>

        {data.main !== undefined && (
          <div className="bottom">
            <div className="feels">
              {data.main ? (
                <p className="bold">{data.main.feels_like.toFixed()}°C</p>
              ) : null}

              <p>Feels Like</p>
            </div>
            <div className="humidity">
              {data.main ? <p className="bold">{data.main.humidity}%</p> : null}
              <p>Humidity</p>
            </div>
            <div className="wind">
              {data.main ? (
                <p className="bold">{data.wind.speed.toFixed()} KMH</p>
              ) : null}
              <p>Wind</p>
            </div>
          </div>
        )}
      </div>
      <div></div>
    </div>
  );
}

export default App;
