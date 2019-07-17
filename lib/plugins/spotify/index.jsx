import { run, css } from "uebersicht"

export const refreshFrequency= 100;

const gaudi_widget_spotify = css`color: #19cb00`

export const render = () => {

    return run(`bash gaudiBar.widget/lib/plugins/spotify/spotify`).then((output) => {


        const values = output.split('@');

        let artist = values[0].replace(/^\s+|\s+$/g, "");
        let song = values[1].replace(/^\s+|\s+$/g, "");
        let status = values[4].replace(/^\s+|\s+$/g, "");
        let elapsed = values[2];
        let total = values[3];

        if (artist.length >= 14) {
          artist = artist.substring(0,13);
          artist = artist.replace(/^\s+|\s+$/g, "");
          song = song + "…";
        }

        if (song.length >= 14) {
          song = song.substring(0,13);
          song = song.replace(/^\s+|\s+$/g, "");
          song = song + "…";
        }

        const elaspedValues = elapsed.split(':');
        const elaspedSeconds = (60 * parseInt(elaspedValues[0])) + parseInt(elaspedValues);

        const totalValues = total.split(':');
        const totalSeconds = (60 * parseInt(totalValues[0])) + parseInt(totalValues);

        elapsed = elaspedSeconds / totalSeconds;


        const ACTIONS = {
            pause : () => {
                return run(`/usr/local/bin/spotify pause`);
            },
            play : () => {
                return run(`/usr/local/bin/spotify play`);
            },
            prev : () => {
                return run(`/usr/local/bin/spotify prev`);
            },
            next : () => {
                return run(`/usr/local/bin/spotify next`);
            }
        }

        return (
            <div className="gaudi-bar-section-widget ">
                <span className={`gaudi-icon fab fa-spotify ${gaudi_widget_spotify}`}></span>
                <span className='gaudi-content__spaced'>{artist} - {song}</span>
                <div>
                    <span className='gaudi-icon fas fa-step-backward prev' onClick={ACTIONS.prev}></span>
                    {
                        status === "playing." ? (<span onClick={ACTIONS.pause} className='gaudi-icon fas fa-pause pause'></span>) : (<span className='gaudi-icon fas fa-play play' onClick={ACTIONS.play}></span>)
                    }
                    <span className='gaudi-icon fas fa-step-forward prnextev' onClick={ACTIONS.next}></span>
                </div>
            </div>
        )
    })
}
