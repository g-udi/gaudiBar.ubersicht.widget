
import { run, css } from "uebersicht"

export const refreshFrequency = 100000;

const gaudi_widget_weather = css`background: #3c5674`

const SECRETS = require('./keys.secret');

const WEATHER_ICONS = {
  "Sunny": "fa-sun",
  "Partly cloudy": "fa-cloud-sun",
  "Cloudy": "fa-cloud",
  "Overcast": "fa-cloud",
  "Mist": "fa-smog",
  "Patchy rain possible": "fa-cloud-rain",
  "Patchy snow possible": "fa-snowflake",
  "Patchy sleet possible": "fa-cloud-meatball",
  "Patchy freezing drizzle possible": "fa-icicles",
  "Thundery outbreaks possible": "fa-bolt",
  "Blowing snow": "fa-wind",
  "Blizzard": "fa-snowflake",
  "Fog": "fa-smog",
  "Freezing fog": "fa-smog",
  "Patchy light drizzle": "fa-cloud-rain",
  "Light drizzle": "fa-cloud-rain",
  "Freezing drizzle": "fa-icicles",
  "Heavy freezing drizzle": "fa-icicles",
  "Patchy light rain": "fa-cloud-rain",
  "Light rain": "fa-cloud-rain",
  "Moderate rain at times": "fa-cloud-showers-heavy",
  "Moderate rain": "fa-cloud-showers-heavy",
  "Heavy rain at times": "fa-cloud-showers-heavy",
  "Heavy rain": "fa-cloud-showers-heavy",
  "Light freezing rain": "fa-icicles",
  "Moderate or heavy freezing rain": "fa-icicles",
  "Light sleet": "fa-cloud-meatball",
  "Moderate or heavy sleet": "fa-cloud-meatball",
  "Patchy light snow": "fa-snowflake",
  "Light snow": "fa-snowflake",
  "Patchy moderate snow": "fa-snowflake",
  "Moderate snow": "fa-snowflake",
  "Patchy heavy snow": "fa-snowflake",
  "Heavy snow": "fa-snowflake",
  "Ice pellets": "fa-icicles",
  "Light rain shower": "fa-cloud-rain",
  "Moderate or heavy rain shower": "fa-cloud-showers-heavy",
  "Torrential rain shower": "fa-cloud-showers-heavy",
  "Light sleet showers": "fa-cloud-meatball",
  "Moderate or heavy sleet showers": "fa-cloud-meatball",
  "Light snow showers": "fa-snowflake",
  "Moderate or heavy snow showers": "fa-snowflake",
  "Light showers of ice pellets": "fa-icicles",
  "Moderate or heavy showers of ice pellets": "fa-icicles",
  "Patchy light rain with thunder": "fa-bolt",
  "Moderate or heavy rain with thunder": "fa-bolt",
  "Patchy light snow with thunder": "fa-bolt",
  "Moderate or heavy snow with thunder": "fa-bolt"
};


export const render = () => {

  const CITY = "london";

  return run(`curl -s 'http://api.weatherapi.com/v1/current.json?q=${CITY}&key=${SECRETS.apiKey}'`).then((output) => {
    try {
      
      const weather = JSON.parse(output);

      if (weather) {
  
        return (
          <div className={`gaudi-bar-section-widget ${gaudi_widget_weather}`}>
            <link rel="stylesheet" type="text/css" href="gaudiBar.widget/lib/plugins/weather/style.css"></link>
            {
              <span>
                <span className={`gaudi-icon fa fas ${WEATHER_ICONS[weather.current.condition.text]}`}></span>
                <span className='temp'>
                  <span className='hi'>{Math.round(weather.current.temp_c)}°</span>
                </span>
              </span>
            }
          </div>
        );
      } else return null;
    } catch (error) {
      console.log("[ERROR] Making Weather API Request", error);
    }
  })

}