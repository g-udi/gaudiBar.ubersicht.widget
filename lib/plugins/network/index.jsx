
import { css } from "uebersicht"
import * as Utils from '../../utils'

export const refreshFrequency = 30000;

const gaudi_widget_network = css`background: #173b53`

export const render = () => {

    const getNetworkStatus = (status, netName, netIP) => {

        let output = '--', icon = 'fa-wifi';

        if (status === "Wi-Fi") {
            output = netName || '--';
        } else if ((status === 'USB 10/100/1000 LAN') || (status === 'Apple USB Ethernet Adapter')) {
            output = netIP || '--';
            icon = 'fa-ethernet'
        }
        return (
            <span>
                <span className={`fas ${icon} gaudi-icon gaudi-color-grey`}></span>
                <span>{output}</span>
            </span>
        )
    }

    return Utils.runWithLocalEnv(`bash "$GAUDI_BAR_WIDGET_DIR/lib/plugins/network/network"`).then((output) => {

        const values = Utils.parseJson(output);
        if (!values) return Utils.emptyWidget();
        
        return (
            <div className={`gaudi-bar-section-widget ${gaudi_widget_network}`}>
                {getNetworkStatus(String(values.service || '').trim(), values.ssid, values.ip)}
            </div>
        )
    }).catch(() => Utils.emptyWidget())
}
