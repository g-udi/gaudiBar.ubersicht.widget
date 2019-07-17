
import { run, css } from "uebersicht"

export const refreshFrequency= 1000000;

const gaudi_widget_todoist = css`background: transparent`
const todoist_notifications_count = css`
    margin: 0 5px;
    font-size: 8px;
    color: #cc0403
`

const SECRETS = require('./keys.secret');

export const render = (geo) => {

    return run(`curl -s GET https://beta.todoist.com/API/v8/tasks?filter=overdue -H "Authorization: Bearer ${SECRETS.apiKey}"`).then((output) => {
        return output.length ? (
            <div className={`gaudi-bar-section-widget ${gaudi_widget_todoist}`}>
                <span className='today'>
                    <span className={`gaudi-icon far fa-check-square`}></span>
                    <span>Todoist</span>
                    <span className={todoist_notifications_count}>[{JSON.parse(output).length}]</span>
                </span>
            </div>
        ) : null;
    })

}