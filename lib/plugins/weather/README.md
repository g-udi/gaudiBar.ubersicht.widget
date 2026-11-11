# weather

![weather-widget](https://user-images.githubusercontent.com/550726/67053847-7da6ee80-f13a-11e9-9d16-bd7bd6e180c8.png)

| Refresh Frequency             | 600000                                                                  |
|-------------------------------|-------------------------------------------------------------------------|

This widget shows:

 - The current temperature (°C) for the configured city
 - An icon that corresponds to the current weather conditions, with night variants for clear and partly cloudy skies

The data comes from the [WeatherAPI](https://www.weatherapi.com/) `current.json` endpoint.

## Requirements

Set these variables in the widget `.env` file. See the root `.env.example`.

| Variable | Description |
|----------|-------------|
| `GAUDI_WEATHER_API_KEY` | Your WeatherAPI key. Without it the widget stays hidden. |
| `GAUDI_WEATHER_CITY` | Anything WeatherAPI accepts as a location: a city name, a postcode or `lat,lon`. Defaults to `london`. |

## Customization

This widget uses [Font Awesome](https://fontawesome.com/) to display the icons defined in the `WEATHER_ICONS` map of `index.jsx`. The map is keyed on the WeatherAPI [condition code](https://www.weatherapi.com/docs/weather_conditions.json); `night` is used when the API reports `is_day: 0`, and unknown codes fall back to `fa-cloud`:

```js
const WEATHER_ICONS = {
  1000: { day: "fa-sun", night: "fa-moon" },                // Sunny / Clear
  1003: { day: "fa-cloud-sun", night: "fa-cloud-moon" },    // Partly cloudy
  1006: { day: "fa-cloud" },                                // Cloudy
  ....
};
```
