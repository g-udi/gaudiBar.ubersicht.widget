
import { css } from "uebersicht"

// Refreshed when the minute changes (see `refreshOnMinute` in main.jsx), so the
// clock never lags; the interval is only the nominal period.
export const refreshFrequency = 60000;
export const refreshOnMinute = true;

const gaudi_widget_time = css`background: #19cb00`

export const render = () => {
    return (
        <div className={`gaudi-bar-section-widget ${gaudi_widget_time}`}>
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
    )
}
