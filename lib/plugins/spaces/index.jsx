
import { run, css } from "uebersicht"

export const refreshFrequency= 10000;

const gaudi_widget_spaces = css`background: #867C85`

export const render = () => {
    return run(`bash gaudiBar.widget/lib/plugins/spaces/spaces`).then((output) => {
        return (
            <div className={`gaudi-bar-section-widget ${gaudi_widget_spaces}`}>
                <span>{output}</span>
            </div>
        )
    })
}