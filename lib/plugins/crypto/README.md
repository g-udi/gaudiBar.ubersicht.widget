# crypto

![crypto-widget](https://user-images.githubusercontent.com/550726/66969792-fd718200-f082-11e9-886a-7a7d75b49784.png)

| Refresh Frequency             | 1000000                                                                   |
|-------------------------------|-----------------------------------------------------------------------

This widget shows:
 - The status of primary coins you track directly on the desktop
 - The icon of the crypto currecny fetched from [CryptoFont](https://cryptofont.com/) that is loaded in the widget.
 - A color code (green (increase) / red (decrease)) that indicates that change in price for the last 1 hour

This widget pop-over shows:
 - The status of the secondary coins on click

The widget make use of the [CoinMarketCap](https://coinmarketcap.com/) API `https://api.coinmarketcap.com/v1/ticker/`.

## Configuration

The set of primary and secondary coins is configured via the `coins.js` file where you include the coin code as show below:

```js
module.exports =  {
    primary: ["btc", "xrp"],
    secondary: ["doge", "eth", "dash", "strat", "steem"]
};
```



