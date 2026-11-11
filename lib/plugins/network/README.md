# network

![network-wwidget](https://user-images.githubusercontent.com/550726/67054712-5bfb3680-f13d-11e9-8d81-6c48b396a643.png)

| Refresh Frequency             | 30000                                                                   |
|-------------------------------|-------------------------------------------------------------------------|

This widget shows:
 - Icon to indicate whether the active connection is wired or Wi-Fi
 - The SSID of the Wi-Fi network if available, otherwise `Wi-Fi`
 - The IP address for a wired connection

The active connection is the first active service in the macOS service order. It is classified by the interface type reported by `ifconfig` (`Wi-Fi` or anything else, which is treated as wired), so any Ethernet, USB or Thunderbolt adapter works whatever its name.

The SSID is read from `ipconfig getsummary <device>`, with `networksetup -getairportnetwork` and `system_profiler SPAirPortDataType` as fallbacks for older macOS releases.

> [!NOTE]
> Recent macOS releases only disclose the SSID to apps with Location Services access and answer `<redacted>` to everything else. In that case the widget shows `Wi-Fi` instead of the network name.
