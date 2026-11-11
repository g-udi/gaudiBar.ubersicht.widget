
import { css } from "uebersicht"
import * as Utils from '../../utils'

export const refreshFrequency = 600000;

const gaudi_widget_weather = css`background: #3c5674`

// WeatherAPI condition codes (https://www.weatherapi.com/docs/weather_conditions.json).
// Codes are stable across languages; `night` is used when `is_day` is 0.
const WEATHER_ICONS = {
  1000: { day: "fa-sun", night: "fa-moon" },                // Sunny / Clear
  1003: { day: "fa-cloud-sun", night: "fa-cloud-moon" },    // Partly cloudy
  1006: { day: "fa-cloud" },                                // Cloudy
  1009: { day: "fa-cloud" },                                // Overcast
  1030: { day: "fa-smog" },                                 // Mist
  1063: { day: "fa-cloud-rain" },                           // Patchy rain possible
  1066: { day: "fa-snowflake" },                            // Patchy snow possible
  1069: { day: "fa-cloud-meatball" },                       // Patchy sleet possible
  1072: { day: "fa-icicles" },                              // Patchy freezing drizzle possible
  1087: { day: "fa-bolt" },                                 // Thundery outbreaks possible
  1114: { day: "fa-wind" },                                 // Blowing snow
  1117: { day: "fa-snowflake" },                            // Blizzard
  1135: { day: "fa-smog" },                                 // Fog
  1147: { day: "fa-smog" },                                 // Freezing fog
  1150: { day: "fa-cloud-rain" },                           // Patchy light drizzle
  1153: { day: "fa-cloud-rain" },                           // Light drizzle
  1168: { day: "fa-icicles" },                              // Freezing drizzle
  1171: { day: "fa-icicles" },                              // Heavy freezing drizzle
  1180: { day: "fa-cloud-rain" },                           // Patchy light rain
  1183: { day: "fa-cloud-rain" },                           // Light rain
  1186: { day: "fa-cloud-showers-heavy" },                  // Moderate rain at times
  1189: { day: "fa-cloud-showers-heavy" },                  // Moderate rain
  1192: { day: "fa-cloud-showers-heavy" },                  // Heavy rain at times
  1195: { day: "fa-cloud-showers-heavy" },                  // Heavy rain
  1198: { day: "fa-icicles" },                              // Light freezing rain
  1201: { day: "fa-icicles" },                              // Moderate or heavy freezing rain
  1204: { day: "fa-cloud-meatball" },                       // Light sleet
  1207: { day: "fa-cloud-meatball" },                       // Moderate or heavy sleet
  1210: { day: "fa-snowflake" },                            // Patchy light snow
  1213: { day: "fa-snowflake" },                            // Light snow
  1216: { day: "fa-snowflake" },                            // Patchy moderate snow
  1219: { day: "fa-snowflake" },                            // Moderate snow
  1222: { day: "fa-snowflake" },                            // Patchy heavy snow
  1225: { day: "fa-snowflake" },                            // Heavy snow
  1237: { day: "fa-icicles" },                              // Ice pellets
  1240: { day: "fa-cloud-rain" },                           // Light rain shower
  1243: { day: "fa-cloud-showers-heavy" },                  // Moderate or heavy rain shower
  1246: { day: "fa-cloud-showers-heavy" },                  // Torrential rain shower
  1249: { day: "fa-cloud-meatball" },                       // Light sleet showers
  1252: { day: "fa-cloud-meatball" },                       // Moderate or heavy sleet showers
  1255: { day: "fa-snowflake" },                            // Light snow showers
  1258: { day: "fa-snowflake" },                            // Moderate or heavy snow showers
  1261: { day: "fa-icicles" },                              // Light showers of ice pellets
  1264: { day: "fa-icicles" },                              // Moderate or heavy showers of ice pellets
  1273: { day: "fa-bolt" },                                 // Patchy light rain with thunder
  1276: { day: "fa-bolt" },                                 // Moderate or heavy rain with thunder
  1279: { day: "fa-bolt" },                                 // Patchy light snow with thunder
  1282: { day: "fa-bolt" }                                  // Moderate or heavy snow with thunder
};

const DEFAULT_WEATHER_ICON = "fa-cloud";

const getWeatherIcon = (current) => {
  const icons = WEATHER_ICONS[(current.condition || {}).code];
  if (!icons) return DEFAULT_WEATHER_ICON;

  return (current.is_day === 0 && icons.night) || icons.day;
};

export const render = () => {

  const endpoint = 'https://api.weatherapi.com/v1/current.json';
  // The key is fed to curl on stdin so it never appears in the process list
  const command = `${Utils.readSecret('GAUDI_WEATHER_API_KEY', 'lib/plugins/weather/keys.secret.js')}; city="\${GAUDI_WEATHER_CITY:-london}"; if [ -n "$secret" ]; then ${Utils.curlSecretConfig('data-urlencode', 'key=')} | curl -fsSL --get --data-urlencode "q=$city" --config - ${Utils.shellQuote(endpoint)} || true; fi`;

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
                <span className={`gaudi-icon fa fas ${getWeatherIcon(weather.current)}`}></span>
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
