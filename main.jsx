const CONFIGURATION = require('./lib/configs');
const PLUGINS = require('./lib/plugins');

export const refreshFrequency= 1000;

let gaudiTimeTable = {};

export const command = (dispatch) => {

    Object.keys(CONFIGURATION).map(primaryBar => {
        Object.keys(CONFIGURATION[primaryBar]).map(secondaryBar => {
            CONFIGURATION[primaryBar][secondaryBar].map(plugin => {

                if (!gaudiTimeTable[plugin] || (new Date(gaudiTimeTable[plugin].getTime() + PLUGINS[plugin].refreshFrequency) <=  new Date())) {
                    PLUGINS[plugin].render().then(output => {
                        gaudiTimeTable[plugin] = new Date();
                        return dispatch({output, type: plugin})
                    }).catch(error => console.log(`🛑Something went wrong ❗: ${error}`))
                }

                if (!gaudiTimeTable[plugin]) gaudiTimeTable[plugin] = new Date();
            })
        })
    });
}

export const render = ({state}) => {

    const PRIMARY_BARS = ["top", "bottom"];
    const SECONDARY_BARS = ["left", "middle", "right"];
    
    try {
        return <div className="gaudi">

            <link rel="stylesheet" type="text/css" href="gaudiBar.widget/lib/fonts/css/fonts.css"></link>
            <link rel="stylesheet" type="text/css" href="/gaudiBar.widget/style.css" />

            {PRIMARY_BARS.map((primaryBar, index) => {
                return <div key={`bar-${primaryBar}-${index}`} className={`gaudi-bar__${primaryBar}`}>
                    {SECONDARY_BARS.map((secondaryBar) => {
                        return <div key={`bar-${primaryBar}-${secondaryBar}-${index}`}
                            className={`gaudi-bar-section gaudi-bar__${primaryBar}-${secondaryBar}`}>
                            {CONFIGURATION[primaryBar][secondaryBar].map((widget, index) => {
                                return !!widget ? <div className={`gaudi-bar-section-widget-container plugin-${widget}`} key={`widget-${index}`}>{state[widget]}</div> : null;
                            })}
                        </div>
                    })}
                </div>
            })}
        </div>
    } catch (error) {
        return <div> 🛑Something went wrong ❗<strong>{String(error)}</strong></div>
    }

}

export const updateState = (event, previousState) => {
    if (event.error) {
      console.error(event.error)
      return {...previousState, warning: `We got an error: ${event.error}`}
    }
    return !!event.type ? { state: {...previousState.state, [event.type]: event.output} } : event;

}