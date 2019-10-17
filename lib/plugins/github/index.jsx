
import { run, css } from "uebersicht"

export const refreshFrequency= 1000000;

const SECRETS = require('./keys.secret');

const gaudi_widget_github = css`background: transparent`

export const render = () => {

    return run(`curl -s --user ${SECRETS.user}:${SECRETS.apiKey} -s https://api.github.com/notifications?participating=true`).then((output) => {

    try {

        let data = JSON.parse(output);
        let totalNotifications = 0;

        const GITHUB_NOTIFICATIONS = {
            comment: {
                count: 0,
                icon: "broadcast"
            },
            mention: {
                count: 0,
                icon: "mention"
            },
            team_mention: {
                count: 0,
                icon: "gist-secret"
            },
            assign: {
                count: 0,
                icon: "git-branch"
            },
            review_requested: {
                count: 0,
                icon: "eye"
            },
            security_alert: {
                count: 0,
                icon: "stop"
            }
        };

        for (let reason of Array.from((Array.from(data).map((notification) => notification.reason)))) {
            if (GITHUB_NOTIFICATIONS[reason]) {
                GITHUB_NOTIFICATIONS[reason].count++;
                totalNotifications++;
            }
        }
        
        return totalNotifications > 0 ? (
            <div className={`gaudi-bar-section-widget gaudi-widget-github ${gaudi_widget_github}`}>
                <link rel="stylesheet" type="text/css" href="gaudiBar.widget/lib/plugins/github/style.css"></link>
                <link rel="stylesheet" type="text/css" href="gaudiBar.widget/lib/plugins/github/fonts/octicons.css"></link>
                <span className='fab fa-github gaudi-icon'></span>
                <span>Github</span>
                <span className="github_notifications_count" >[{totalNotifications}]</span>
                <span className='github_notifications_details'>
                    {
                        Object.keys(GITHUB_NOTIFICATIONS).map((key, index) => {

                            {
                                return GITHUB_NOTIFICATIONS[key].count !== 0 ?
                                (
                                    <span key={index} className="gaudi_github_notification">
                                        <span className={`octicon octicon-${GITHUB_NOTIFICATIONS[key].icon}`}></span>
                                        <span>{`${key.split('_').map(k => {return k.charAt(0).toUpperCase() + k.slice(1)}).join(' ')} : ${GITHUB_NOTIFICATIONS[key].count}`}</span>
                                    </span>
                                ) : null
                            }
                        })
                    }
                </span>
            </div>
        ) : null

        } catch (exception) {
            console.log(exception)
            return null;
        }
    })

}