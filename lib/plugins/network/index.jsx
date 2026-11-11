
import { css } from "uebersicht"
import * as Utils from '../../utils'

export const refreshFrequency = 30000;

const gaudi_widget_network = css`background: #173b53`

export const render = () => {

    const getNetworkStatus = ({ type, ssid, ssidRedacted, ip }) => {

        let output = '--', icon = 'fa-wifi';

        if (type === 'wifi') {
            // macOS may refuse to disclose the SSID; fall back to a generic label
            output = ssid || (ssidRedacted ? 'Wi-Fi' : '--');
        } else if (type === 'wired') {
            output = ip || '--';
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
                {getNetworkStatus(values)}
            </div>
        )
    }).catch(() => Utils.emptyWidget())
}
