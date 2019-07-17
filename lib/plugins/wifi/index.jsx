
import { run, css } from "uebersicht"

export const refreshFrequency= 10000;

const gaudi_widget_wifi = css`background: #173b53`

export const render = () => {

    const getWifiStatus = (status, netName, netIP) => {

        let output = '--', icon = 'fa-wifi';

        if (status === "Wi-Fi") {
            output = netName;
        } else if ((status === 'USB 10/100/1000 LAN') || (status === 'Apple USB Ethernet Adapter')) {
            output = netIP;
            icon = 'fa-ethernet'
        }
        return (
            <span>
                <span className={`fas ${icon} gaudi-icon gaudi-color-grey`}></span>
                <span>{output}</span>
            </span>
        )
    }

    return run(`bash gaudiBar.widget/lib/plugins/wifi/wifi`).then((output) => {

        const values = output.split('@');
        return (
            <div className={`gaudi-bar-section-widget ${gaudi_widget_wifi}`}>
                {getWifiStatus(values[0].replace(/^\s+|\s+$/g, ""), values[1], values[2])}
            </div>
        )
    })
}
