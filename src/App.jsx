/* eslint-disable react/prop-types */
import "./App.css";
import { useEffect, useState } from "react";

const WEATHER_API_KEY = "bbb9a91803db45208a590155240506";
const WEATHER_API_URL = (days = 4, query = "Lviv") =>
  `http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${query}&days=${days}&aqi=no&alerts=no`;

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DEFAULT_CITY = "Lviv";

function App() {
  const [city, setCity] = useState(null);

  const [status, setStatus] = useState("IDLE");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeatherByCity = async (q) => {
    setData(null);
    setError(null);
    setStatus("IDLE");

    if (!q) {
      alert("Будь ласка, введіть правильно місто");
      return;
    }
    setStatus("LOADING");

    try {
      const response = await fetch(WEATHER_API_URL(4, q));

      if (response.ok) {
        const json = await response.json();
        setData(json);
        setStatus("SUCCESS");
        return;
      }

      throw new Error(
        "Не знайдено. Будь ласка, переконайтеся, що ви правильно ввели назву Міста",
      );
    } catch (e) {
      setError(e?.message || "Місто не знайдено");
      setStatus("ERROR");
    }
  };

  useEffect(() => {
    fetchWeatherByCity(DEFAULT_CITY);
  }, []);

  const renderStatus = () => {
    if (status === "LOADING") {
      return <div>loading...</div>;
    }

    if (status === "ERROR") {
      return <div>{error}</div>;
    }

    if (status !== "SUCCESS") {
      return <div>no data</div>;
    }

    const { location, forecast } = data;
    const { country, name, tz_id, localtime, lat, lon } = location;
    const { forecastday } = forecast;
    const days = forecastday.length;

    const readableLocalTime = new Date(localtime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div className="list">
        <div className="location block">
          <h3>Location:</h3>
          <div className="details">
            <SpaceBetweenTwoValues left="Місто" right={country} />
            <SpaceBetweenTwoValues left="Пошук за містом" right={name} />
            <SpaceBetweenTwoValues left="Таймзона" right={tz_id} />
            <SpaceBetweenTwoValues left="Місто" right={country} />
            <SpaceBetweenTwoValues
              left="Локальний час"
              right={readableLocalTime}
            />
            <SpaceBetweenTwoValues left="Місто" right={lat} />
            <SpaceBetweenTwoValues left="Місто" right={lon} />
          </div>
        </div>

        <div className="block">
          <h3>
            Погода на {days} {days <= 1 ? " день" : " дні"}
          </h3>
          <div className="row">
            {forecastday.map(({ day }, i) => (
              <WeatherDay
                avgtemp_c={day.avgtemp_c}
                condition={day.condition}
                date={day.date}
                maxtemp_c={day.maxtemp_c}
                maxwind_kph={day.maxwind_kph}
                mintemp_c={day.mintemp_c}
                key={i}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="wrapper">
      <div className="search-form">
        <div className="search-wrapper">
          <label htmlFor="search-by-city">Пошук за містом</label>
          <input
            id="search-by-city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <button
          disabled={!city || status === "LOADING"}
          onClick={() => fetchWeatherByCity(city)}
        >
          {status === "LOADING" ? "Загрузка" : "Знайти"}
        </button>
      </div>
      {renderStatus()}
    </div>
  );
}

// eslint-disable-next-line react/prop-types
const SpaceBetweenTwoValues = ({ left, right }) => {
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        gap: "32px",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <div>{left}</div>
      <b>{right}</b>
    </div>
  );
};

const WeatherDay = ({
  date,
  condition,
  maxtemp_c,
  maxwind_kph,
  mintemp_c,
  avgtemp_c,
}) => {
  const { text } = condition;

  return (
    <div className="location block">
      {date && (
        <h3>
          {WEEKDAYS[new Date(date).getDay()] + " " + new Date(date).getDate()}
        </h3>
      )}
      <div className="details">
        <SpaceBetweenTwoValues left="Погода" right={text} />
        <SpaceBetweenTwoValues
          left="Максимальна температура(c)"
          right={maxtemp_c}
        />
        <SpaceBetweenTwoValues
          left="Мінімальна температура(c)"
          right={mintemp_c}
        />
        <SpaceBetweenTwoValues
          left="Максимальна швидкість вітру(км/год)"
          right={maxwind_kph}
        />
        <SpaceBetweenTwoValues
          left="Середня температура(с)"
          right={avgtemp_c}
        />
      </div>
    </div>
  );
};

export default App;
