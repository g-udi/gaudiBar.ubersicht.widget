# stats

![stats-widget](https://user-images.githubusercontent.com/550726/67034406-8504d280-f10f-11e9-9771-8e90aaae5c75.gif)

| Refresh Frequency             | 5000                                                                    |
|-------------------------------|-------------------------------------------------------------------------|

This widget shows:
 - Network upload and download traffic
 - Current memory and CPU percentage
 - Current free HDD space in GB

How the figures are computed:
 - **CPU**: the sum of per-process CPU usage, normalized by the system CPU core count.
 - **Memory**: app memory + wired + compressed memory as a share of physical memory, from `vm_stat`. This is the "Memory Used" figure of Activity Monitor and cannot exceed 100%.
 - **Network**: the byte counters of the physical (`en*`) interfaces from `netstat -ib`. The widget keeps the previous reading and shows the difference as a rate, so the first refresh after a (re)load shows `0.0KB/s` and nothing blocks to take a sample.
 - **HDD**: free space on `/` from `df`.
