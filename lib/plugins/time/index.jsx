
import { css } from "uebersicht"

export const refreshFrequency = 10000;

const gaudi_widget_time = css`background: #19cb00`

export const render = () => {
    return (
        <div className={`gaudi-bar-section-widget ${gaudi_widget_time}`}>
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
    )
}
