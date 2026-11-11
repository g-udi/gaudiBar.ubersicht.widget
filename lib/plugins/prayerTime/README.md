# prayertime

![prayer-widget](https://user-images.githubusercontent.com/550726/66969793-fe0a1880-f082-11e9-9e57-03937328c973.png)

> [!IMPORTANT]
> PHP is needed to run this widget. If you don't have it installed, you can install it by running `brew install php`.

| Refresh Frequency             | 60000                                                                   |
|-------------------------------|-------------------------------------------------------------------------|

The upcoming prayer is re-evaluated every minute. The prayer times themselves are computed (with PHP) once per day and location, then served from memory.

This widget shows:
 - The time for the upcoming prayer

This widget pop-over shows:
 - city and country for the current identified location
 - the prayer times for the current day in the identified location
 - the current (last) prayer time highlighted in green

> This widget makes use of the `geolocation.getCurrentPosition` function to get an accurate **current** location of the user. As a fallback you can adjust the `GEO_LOCATION` object in `index.jsx` (latitude, longitude, city and country; it defaults to London, UK)

## Configuration

You can adjust various setting in the `CONFIGURATIONS` map:

 1. `calcMethod`: Calculation method

    Possible values:

        0: Ithna Ashari
        1: University of Islamic Sciences, Karachi
        2: Islamic Society of North America (ISNA)
        3: Muslim World League (MWL)
        4: Umm al-Qura, Makkah
        5: Egyptian General Authority of Survey
        6: Custom Setting
        7: Institute of Geophysics, University of Tehran

 2. `asrMethod`: Juristic Methods / Asr Calculation Methods:

    Possible values:

        0: Shafii (standard)
        1: Hanafi

 3. `timezone`: the UTC offset in hours (set automatically from the system clock)
 4. `location`: the city and country (set automatically from the geo object)
 5. `hideSunset`: as Maghrib and Sunset times are the same, it is preferred to hide Sunset (default: `true`)
 6. `hideSunrise`: hide sunrise time (default: `true`)

Times are shown in 24-hour format.

> Note: if you need to set the fallback `GEO_LOCATION` by hand, you can read your latitude/longitude from any maps application. West longitudes are negative.
