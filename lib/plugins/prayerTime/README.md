# prayertime

![prayer-widget](https://user-images.githubusercontent.com/550726/66969793-fe0a1880-f082-11e9-9e57-03937328c973.png)

> [!IMPORTANT]  
> PHP is needed to run this widget. If you don't have it installed, you can install it by running `brew install php`
> Make sure to edit the `prayerTime.php` file to use the correct path for the `php` binary.
> ``

| Refresh Frequency             | 10000                                                                   |
|-------------------------------|-------------------------------------------------------------------------|

This widget shows:
 - The time for the upcoming prayer

This widget pop-over shows:
 - city and country for the current identified location
 - the prayer times for the current day in the identified location
 - the current (last) prayer time highlighted in green

> This widget makes use of the `geolocation.getCurrentPosition` function to get an accurate **current** location of the user. As a fallback you can adjust the `GEO_LOCATION` object

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
        3. latitude  : Latitude
        4. longitude : Longitude
        5. timezone  : Timezone
 3. `timezone`: the current location timezone
 4. `location`: the city and country (set automatically from the geo object)
 5. `hoursformat12`: if false, times shows in 24Hour format, otherwise in 12Hour format (without AM/PM)
 6. `hideSunset`: as Mugrib and Sunset times are same, It is preffered to hide Sunset
 7. `hideSunrise`: hide sunrise time (default: `true`)


> Note: You can find your latitude/longitude [here](http://freegeoip.net/) or from google map or so.