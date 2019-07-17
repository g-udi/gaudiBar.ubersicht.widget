
import { run, css } from "uebersicht"

export const refreshFrequency= 10000;

const gaudi_widget_time = css`background: #19cb00`

export const render = () => {
    return run(`date +\"%I:%M %p\"`).then((output) => {
        return (
            <div className={`gaudi-bar-section-widget ${gaudi_widget_time}`}>
                <span>{output}</span>
            </div>
        )
    })
}