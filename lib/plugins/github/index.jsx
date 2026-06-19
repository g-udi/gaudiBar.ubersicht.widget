
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

async function fetchAllNotifications() {
    let allNotifications = [];
    let page = 1;
    let hasMore = true;
    const maxPages = 10;
    const legacySecret = 'lib/plugins/github/keys.secret.js';
    const tokenCommand = `secret_file="$GAUDI_BAR_WIDGET_DIR/${legacySecret}"; token="\${GAUDI_GITHUB_TOKEN:-}"; if [ -z "$token" ] && [ -f "$secret_file" ]; then token=$(sed -n "s/.*apiKey:[[:space:]]*['\\\"]\\([^'\\\"]*\\).*/\\1/p" "$secret_file" | head -n 1); fi; printf "%s" "$token"`;
    const hasToken = Utils.cleanupOutput(await Utils.runWithLocalEnv(tokenCommand)) !== '';

    if (!hasToken) return null;
    
    while (hasMore && page <= maxPages) {
        const url = `https://api.github.com/notifications?participating=true&page=${page}&per_page=50`;
        const command = `secret_file="$GAUDI_BAR_WIDGET_DIR/${legacySecret}"; token="\${GAUDI_GITHUB_TOKEN:-}"; if [ -z "$token" ] && [ -f "$secret_file" ]; then token=$(sed -n "s/.*apiKey:[[:space:]]*['\\\"]\\([^'\\\"]*\\).*/\\1/p" "$secret_file" | head -n 1); fi; if [ -z "$token" ]; then printf '[]'; else curl -fsSL -H "Authorization: Bearer $token" -H "Accept: application/vnd.github+json" ${Utils.shellQuote(url)} || printf '[]'; fi`;
        const output = await Utils.runWithLocalEnv(command);
        const pageData = Utils.parseJson(output) || [];
        
        if (Array.isArray(pageData) && pageData.length > 0) {
            allNotifications = allNotifications.concat(pageData);
            page++;
        } else {
            hasMore = false;
        }
    }
    
    return allNotifications;
}
