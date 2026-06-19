
import { css } from "uebersicht"
import * as Utils from '../../utils'

export const refreshFrequency = 60000;

const gaudi_widget_prayerTime = css`background: #389cc1`

let GEO_LOCATION = {
    latitude: 51.5074,
    longitude: 0.1278,
    city: 'London',
    country: 'UK'
}

/*
    COMMAND PARAMETER DETAILS
    ---------------------------
    1. calcMethod : Calculation method
        => Possible values:
            0: Ithna Ashari
        1: University of Islamic Sciences, Karachi
        2: Islamic Society of North America (ISNA)
        3: Muslim World League (MWL)
        4: Umm al-Qura, Makkah
        5: Egyptian General Authority of Survey
        6: Custom Setting
        7: Institute of Geophysics, University of Tehran

    2. asrMethod : Juristic Methods / Asr Calculation Methods
        => Possible values:
            0: Shafii (standard)
        1: Hanafi
        3. latitude  : Latitude
        4. longitude : Longitude
        5. timezone  : Timezone
    Note: You can find your latitude/longitude visiting http://freegeoip.net/ or from google map or so.
*/
export const render = () => {
    
    const CONFIGURATIONS = {
        calcMethod: '2',
        asrMethod: '1',
        timezone: String(-new Date().getTimezoneOffset() / 60),
        location: `${GEO_LOCATION.city}, ${GEO_LOCATION.country}`,
        // # If false, times shows in 24Hour format, otherwise in 12Hour format (without AM/PM)
        hourFormat12: true,
        // As Mugrib and Sunset times are same, It is preffered to hide Sunset column
        hideSunset: true,
        hideSunrise: true
    }

    if (typeof geolocation !== 'undefined' && geolocation.getCurrentPosition) {
        geolocation.getCurrentPosition((location)=> {
            GEO_LOCATION = {
              latitude: location.position.coords.latitude,
              longitude: location.position.coords.longitude,
              city: (location.address && location.address.city) || GEO_LOCATION.city,
              country: (location.address && location.address.country) || GEO_LOCATION.country
            }
        });
    }

    const command = `if command -v php >/dev/null 2>&1; then php -f "$GAUDI_BAR_WIDGET_DIR/lib/plugins/prayerTime/prayerTime.php" calc_method=${CONFIGURATIONS.calcMethod} asr_method=${CONFIGURATIONS.asrMethod} lat=${GEO_LOCATION.latitude} lon=${GEO_LOCATION.longitude} tz=${CONFIGURATIONS.timezone}; fi`;

    return Utils.runWithLocalEnv(command).then((output) => {
        if (!output) return Utils.emptyWidget();

        let i;

        const lines = output.split(/\n/);
        if (!lines[0] || !lines[1]) return Utils.emptyWidget();

        const names = lines[0].split(",");
        const times = lines[1].split(",");

        if (!names.length || !times.length) return Utils.emptyWidget();

        const hideTime = (time) => {
            names.splice(time, 1);
            times.splice(time, 1);
        }

        if (CONFIGURATIONS.hideSunset) hideTime(4);
        if (CONFIGURATIONS.hideSunrise) hideTime(1);

        let currentPrayerIndex = times.length - 1, nextPrayerIndex = 0;

        let time = new Date();
        let now = new Date();
        for (i = 0; i < times.length; i++) {
            const _time = times[i];
            const timeComp = _time.split(":");
            time.setHours(timeComp[0], timeComp[1]);
            if (time.getTime() < now.getTime()) {
                currentPrayerIndex = i;
                nextPrayerIndex = (currentPrayerIndex + 1) >= times.length ? 0 : currentPrayerIndex + 1
            } else break;
        }

        return (
            <div className={`gaudi-bar-section-widget gaudi-widget-prayerTime ${gaudi_widget_prayerTime}`}>
                <link rel="stylesheet" type="text/css" href={Utils.widgetPath('lib/plugins/prayerTime/style.css')}></link>
                <span className="gaudi-icon far fa-clock"></span>
                <span>{names[nextPrayerIndex]} {times[nextPrayerIndex]}</span>
                <span className={`gaudi_widget_details ${gaudi_widget_prayerTime}`}>
                    <span className="gaudi_widget_detail"><i className="gaudi-icon fas fa-location-arrow"></i>{CONFIGURATIONS.location}</span>
                    {
                        times.map((time, index) => {
                            return (
                                <span key={index} className={`gaudi_widget_detail ${index === currentPrayerIndex ? 'gaudi_prayer_time-current' : ''}`}>
                                    <span>{names[index]}: {times[index]}</span>
                                </span>
                            )
                        })
                    }
                </span>
            </div>
        )
    }).catch(() => Utils.emptyWidget())


}
