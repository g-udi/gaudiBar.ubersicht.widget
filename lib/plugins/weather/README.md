# weather

![weather-widget](https://user-images.githubusercontent.com/550726/67053847-7da6ee80-f13a-11e9-9d16-bd7bd6e180c8.png)

| Refresh Frequency             | 10000                                                                   |
|-------------------------------|-------------------------------------------------------------------------|

This widget shows:

 - High/Low temperature in the current location
 - Icon that corresponds to the current weather conditions (rain, snow, fog, cloudy, wind, clear, mostly clear, partly cloudy, clear night, party cloudy night and unkown)

> This widget makes use of the `geolocation.getCurrentPosition` function to get an accurate **current** location of the user. As a fallback you can adjust the `GEO_LOCATION` object

## Requirements

In order for the data to be fetched correctly from the API, you need to create a file called `keys.secret.js` inside the weather widget folder that will contain the [WeatherAPI](https://weatherapi.com) API key. The file should look like:

```js
module.exports = {
    apiKey: '<API_KEY>'
}
```

## Customization

This widget uses [Font Awesome](https://fontawesome.com/) to display the icons for each secion defined in the `WEATHER_ICONS` map:

```js
const MAPPINGS = {
    icons: {
        "Sunny": "fa-sun",
        "Partly cloudy": "fa-cloud-sun",
        "Cloudy": "fa-cloud",
        "Overcast": "fa-cloud",
        "Mist": "fa-smog",
        ....
    }
}
```