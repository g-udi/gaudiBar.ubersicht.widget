
import { run, css } from "uebersicht"

export const refreshFrequency= 10000;

const gaudi_widget_battery = css`background: #06F`

export const render = () => {

    /* @function getBatteryStatus
     * @description get the status of the battery with a charge percentage and an indication of on AC power/charging or not
     * @parameter <String> battery the battery capacity
     * @parameter <String> state the charging source indication
     */
    const getBatteryStatus = (battery, state) => {

        const batteryPercentage = parseInt(battery);

        let batteryIcon, batteryColor;

        if (batteryPercentage >= 90) {
            batteryIcon = 'fa-battery-full';
        } else if ((batteryPercentage >= 50) && (batteryPercentage < 90)) {
            batteryIcon = 'fa-battery-three-quarters'
        } else if ((batteryPercentage < 50) && (batteryPercentage >= 25)) {
            batteryIcon = 'fa-battery-half'
            batteryColor = 'orange'
        } else if ((batteryPercentage < 25) && (batteryPercentage >= 10)) {
            batteryIcon = 'fa-battery-quarter'
            batteryColor = 'yellow'
        } else if (batteryPercentage < 10) {
            batteryIcon = 'fa-battery-empty'
            batteryColor = 'red'
        }

        return (
            <div className={`gaudi-bar-section-widget ${gaudi_widget_battery} gaudi-${batteryColor}`}>
                {
                    state.includes('AC') ? (<span className={`fas fa-plug gaudi-icon`}></span>) : null
                }
                <span className={`fas ${batteryIcon} gaudi-icon`}></span>
                <span>{batteryPercentage}%</span>
            </div>
        )
      }

    return run(`bash gaudiBar.widget/lib/plugins/battery/battery`).then((output) => {

        const values = JSON.parse(output);
        
        return (<div>{getBatteryStatus(values.percentage, values.source)}</div>)

    })
}