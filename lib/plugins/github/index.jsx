
import { css } from "uebersicht"
import * as Utils from '../../utils'

export const refreshFrequency = 300000;

const gaudi_widget_github = css`background: #7f8c8d`

export const render = () => {
    
    return fetchAllNotifications().then((data) => {
        
        try {
            
            if (!Array.isArray(data)) return Utils.emptyWidget();

            let totalNotifications = 0;
            
            const GITHUB_NOTIFICATIONS = {
                comment: { count: 0, icon: "broadcast" },
                mention: { count: 0, icon: "mention" },
                team_mention: { count: 0, icon: "gist-secret" },
                assign: { count: 0, icon: "git-branch" },
                review_requested: { count: 0, icon: "eye" },
                security_alert: { count: 0, icon: "gist-secret" }
            };
            
            for (let notification of data) {
                if (GITHUB_NOTIFICATIONS[notification.reason]) {
                    GITHUB_NOTIFICATIONS[notification.reason].count++;
                    totalNotifications++;
                }
            }
            
            return (
                <div className={`gaudi-bar-section-widget gaudi-widget-github ${gaudi_widget_github}`}>
                <link rel="stylesheet" type="text/css" href={Utils.widgetPath('lib/plugins/github/style.css')}></link>
                <link rel="stylesheet" type="text/css" href={Utils.widgetPath('lib/plugins/github/fonts/octicons.css')}></link>
                <span className='fab fa-github gaudi-icon'></span>
                <span>Github</span>
                <span className="github_notifications_count">
                <span className='fa fa-bell gaudi-icon' style={{color: "#19cb00"}}></span>
                {totalNotifications}
                </span>
                
                {
                    totalNotifications > 0 ?
                    (
                        <span className={`gaudi_widget_details ${gaudi_widget_github}`}>
                        {
                            Object.keys(GITHUB_NOTIFICATIONS).map((key, index) => {
                                
                                {
                                    return GITHUB_NOTIFICATIONS[key].count !== 0 ?
                                    (
                                        <span key={index} className="gaudi_widget_detail">
                                        <span className={`octicon octicon-${GITHUB_NOTIFICATIONS[key].icon}`}></span>
                                        <span>{`${key.split('_').map(k => {return k.charAt(0).toUpperCase() + k.slice(1)}).join(' ')} : ${GITHUB_NOTIFICATIONS[key].count}`}</span>
                                        </span>
                                    ) : null
                                }
                            })
                        }
                        </span>
                    ) : null
                }
                </div>
            )
            
            
        } catch (exception) {
            console.error(exception)
            return null;
        }
    }).catch(() => Utils.emptyWidget())
}

const PER_PAGE = 50;
const MAX_PAGES = 10;
const NO_TOKEN = 'no-token';

async function fetchAllNotifications() {
    let allNotifications = [];

    for (let page = 1; page <= MAX_PAGES; page++) {
        const url = `https://api.github.com/notifications?participating=true&page=${page}&per_page=${PER_PAGE}`;
        // The token is fed to curl on stdin so it never appears in the process list
        const command = `${Utils.readSecret('GAUDI_GITHUB_TOKEN', 'lib/plugins/github/keys.secret.js')}; if [ -z "$secret" ]; then printf '${NO_TOKEN}'; else ${Utils.curlSecretConfig('header', 'Authorization: Bearer ')} | curl -fsSL --config - -H "Accept: application/vnd.github+json" ${Utils.shellQuote(url)} || printf '[]'; fi`;
        const output = await Utils.runWithLocalEnv(command);

        // Not configured: hide the widget instead of showing zero notifications
        if (Utils.cleanupOutput(output) === NO_TOKEN) return null;

        const pageData = Utils.parseJson(output);
        if (!Array.isArray(pageData)) break;

        allNotifications = allNotifications.concat(pageData);

        // A short page is the last one, no need to ask for another
        if (pageData.length < PER_PAGE) break;
    }

    return allNotifications;
}
