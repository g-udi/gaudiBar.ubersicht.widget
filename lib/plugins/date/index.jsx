
import { run, css } from "uebersicht"

export const refreshFrequency= 10000;

const gaudi_widget_date = css`background: #141414`

export const render = () => {
    return run(`date +\"%a, %b %d\"`).then((output) => {
        return (
            <div className={`gaudi-bar-section-widget ${gaudi_widget_date}`}>
                <span>{output}</span>
            </div>
        )
    })
}