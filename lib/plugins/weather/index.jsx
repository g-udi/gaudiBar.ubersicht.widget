
import { run, css } from "uebersicht"

export const refreshFrequency= 100000;

const gaudi_widget_weather = css`background: #3c5674`

const SECRETS = require('./keys.secret');
const EXCLUDES  = "minutely,hourly,alerts,flags";
let GEO_LOCATION = {
    latitude: 51.5074,
    longitude: 0.1278
}
const MAPPINGS = {
    icons: {
        "rain"                :"fa-cloud-showers-heavy",
        "snow"                :"fa-snowflake",
        "fog"                 :"fa-smog",
        "cloudy"              :"fa-cloud",
        "wind"                :"fa-wind",
        "clear-day"           :"fa-sun",
        "mostly-clear-day"    :"fa-cloud-sun",
        "partly-cloudy-day"   :"fa-cloud-sun-rain",
        "clear-night"         :"fa-moon",
        "partly-cloudy-night" :"fa-cloud-moon",
        "unknown"             :"fa-temperature-high"
    }
}

export const render = () => {

    geolocation.getCurrentPosition((weather)=> {
      GEO_LOCATION = {
        latitude: weather.position.coords.latitude,
        longitude: weather.position.coords.longitude
      }
    });

    const getIcon = (data) => {
        if (!data) { return MAPPINGS.icons['unknown']; }
        if (data.icon.indexOf('cloudy') > -1) {
          if (data.cloudCover < 0.25) {
            return MAPPINGS.icons["clear-day"];
          } else if (data.cloudCover < 0.5) {
            return MAPPINGS.icons["mostly-clear-day"];
          } else if (data.cloudCover < 0.75) {
            return MAPPINGS.icons["partly-cloudy-day"];
          } else {
            return MAPPINGS.icons["cloudy"];
          }
        } else {
          return MAPPINGS.icons[data.icon];
        }
    }

    const WEATHER_URL = `https://api.forecast.io/forecast/${SECRETS.apiKey}/${GEO_LOCATION.latitude},${GEO_LOCATION.longitude}?units=auto&exclude=${EXCLUDES}`;

    return run(`curl -s ${WEATHER_URL}`).then((output) => {
        try {
            const today = JSON.parse(output).daily.data[0]
            return (
                <div className={`gaudi-bar-section-widget ${gaudi_widget_weather}`}>
                    <span className='today'>
                        <span className={`gaudi-icon fa fas ${getIcon(today)}`}></span>
                        <span className='temp'>
                            <span className='hi'>{Math.round(today.temperatureMax)}°</span>
                            <span>/ </span>
                            <span className='lo'>{Math.round(today.temperatureMin)}°</span>
                        </span>
                    </span>
                </div>
            );
        } catch(error) {
            console.log("[ERROR] Making Weather API Request", error);
        }
    })

}