
import { css } from "uebersicht"
import * as Utils from '../../utils'

export const refreshFrequency = 600000;

const gaudi_widget_weather = css`background: #3c5674`

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

  const endpoint = 'https://api.weatherapi.com/v1/current.json';
  const legacySecret = 'lib/plugins/weather/keys.secret.js';
  const command = `secret_file="$GAUDI_BAR_WIDGET_DIR/${legacySecret}"; api_key="\${GAUDI_WEATHER_API_KEY:-}"; city="\${GAUDI_WEATHER_CITY:-london}"; if [ -z "$api_key" ] && [ -f "$secret_file" ]; then api_key=$(sed -n "s/.*apiKey:[[:space:]]*['\\\"]\\([^'\\\"]*\\).*/\\1/p" "$secret_file" | head -n 1); fi; if [ -z "$api_key" ]; then printf ''; else curl -fsSL --get --data-urlencode "q=$city" --data-urlencode "key=$api_key" ${Utils.shellQuote(endpoint)} || true; fi`;

  return Utils.runWithLocalEnv(command).then((output) => {
    try {
      
      if (!output) return Utils.emptyWidget();
      const weather = Utils.parseJson(output);

      if (weather && weather.current) {
  
        return (
          <div className={`gaudi-bar-section-widget ${gaudi_widget_weather}`}>
            <link rel="stylesheet" type="text/css" href={Utils.widgetPath('lib/plugins/weather/style.css')}></link>
            {
              <span>
                <span className={`gaudi-icon fa fas ${WEATHER_ICONS[weather.current.condition.text] || 'fa-cloud'}`}></span>
                <span className='temp'>
                  <span className='hi'>{Math.round(weather.current.temp_c)}°</span>
                </span>
              </span>
            }
          </div>
        );
      } else return Utils.emptyWidget();
    } catch (error) {
      console.error("[ERROR] Making Weather API Request", error);
      return Utils.emptyWidget();
    }
  }).catch(() => Utils.emptyWidget())

}
