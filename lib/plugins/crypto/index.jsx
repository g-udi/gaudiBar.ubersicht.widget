
import { run, css } from "uebersicht"

const SECRETS = require('./keys.secret');

export const refreshFrequency= 1000000;

const gaudi_widget_crypto = css`background: #34495e`

const COINS = require('./coins');

export const render = () => {

    return run().then(async() => {

        try {

            const output = await fetch(`http://127.0.0.1:41417/https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${COINS.primary.concat(COINS.secondary).concat().toString()}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CMC_PRO_API_KEY': SECRETS.apiKey
                },
            });

            const coins = await output.json();
            
            const roundPrice = (amount, precision) => {
                let _precision = Math.pow(10, precision);
                return Math.round(amount * _precision) / _precision
            }

            return (
                <div className={`gaudi-bar-section-widget gaudi-widget-crypto ${gaudi_widget_crypto}`}>
                <link rel="stylesheet" type="text/css" href="gaudiBar.widget/lib/plugins/crypto/fonts/crypto.css"></link>
                <link rel="stylesheet" type="text/css" href="gaudiBar.widget/lib/plugins/crypto/style.css"></link>
                    {
                        COINS.primary.map((__coin, index) => {
                            return (
                                <span key={index} className="gaudi-bar-section-widget-section">
                                    <span className={`cf cf-${__coin.toLowerCase()}`}></span>
                                    <span className={coins.data[__coin.toUpperCase()].quote[COINS.currency].percent_change_1h > 0 ? 'gaudi-crypto-green' : 'gaudi-crypto-red'}> ${roundPrice(coins.data[__coin.toUpperCase()].quote[COINS.currency].price, 4)} </span>
                                </span>
                            )
                        })
                    }
                    <span className={`gaudi_widget_details ${gaudi_widget_crypto}`}>
                        {
                            COINS.secondary.map((__coin, index) => {
                                return (
                                    <span key={index} className={`gaudi_widget_detail`}>
                                        <span className={`gaudi-icon cf cf-${__coin.toLowerCase()}`}></span>
                                        <span className={coins.data[__coin.toUpperCase()].quote[COINS.currency].percent_change_1h > 0 ? 'gaudi-crypto-green' : 'gaudi-crypto-red'}>${roundPrice(coins.data[__coin.toUpperCase()].quote[COINS.currency].price, 4)} </span>
                                    </span>
                                )
                            })
                        }
                    </span>
                </div>
            );
        } catch (error) {
            console.log("[ERROR] Making CoinTracker API Request", error);
        }
    })
}