# A Chrome Extension that does the scrolling for you without the need to touch your mouse.

## Bookmark:

### Save the links to your bookmarks (Drag to your bookmark bar)

##### _Recommendation: Make a folder with start & stop bookmark_

[Start Auto TikTok Scroller][1]
[1]javascript:(function() {const script = document.createElement('script'); script.id = 'auto-scroll-bookmarklet'; script.src = 'https://tyson3101.github.io/Auto-TikTok-Scroller/bookmarklet/bookmarklet.js'; document.body.appendChild(script)})()
[Stop TikTok Scroller][2]
[2]javascript:(function() {const script = document.querySelector('script#auto-scroll-bookmarklet'); script.remove()})()

Click on the bookmark when wanting to activate it on TikTok

![Image](./img/ScreenshotGoogleExtensionTikTok.png)

#### Whenever a TikTok ends, the extension will automatically scroll to the next one for you. Great for doing homework and watching TikTok at the same time without the need to switch tabs! Just be sure to not tell your teachers.

##### If you have any suggestions or experience problems, post an issue on the GitHub page: [https://github.com/Tyson3101/Auto-TikTok-Scroller](https://github.com/Tyson3101/Auto-TikTok-Scroller)
