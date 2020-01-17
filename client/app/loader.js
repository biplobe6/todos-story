const staticUrl = STATIC_URL

export const faviconLoader = (path) => {
    const oldFavicon = document.querySelector('head link[rel="shortcut icon"]')
    const faviconFullPath = `${staticUrl}${path}`
    if(oldFavicon){
        oldFavicon.href = faviconFullPath
    } else {
        const newFavicon = document.createElement('link')
        newFavicon.rel = 'shortcut icon'
        newFavicon.type = 'image/x-icon'
        newFavicon.href = faviconFullPath
        document.head.appendChild(newFavicon)
    }
}

