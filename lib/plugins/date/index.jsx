
import { css } from "uebersicht"

export const refreshFrequency = 60000;

const gaudi_widget_date = css`background: #141414`

export const render = () => {
    return (
        <div className={`gaudi-bar-section-widget ${gaudi_widget_date}`}>
            <span>{new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: '2-digit' })}</span>
        </div>
    )
}
