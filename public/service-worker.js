self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('budget-tracker-v1')
      .then(cache => {
        console.log('Opened cache')
        return cache.addAll([
          '/',
          '/db.js',
          '/index.html',
          '/index.js',
          '/manifest.json',
          '/styles.css',
          '/icons/icon-192x192.png',
          '/icons/icon-512x512.png'
        ])
      })
  )
})

self.addEventListener('fetch', event => {
  if (event.request.url.includes('/api/')){
    event.respondWith(
    caches.open('data-cache-v1').then(cache=>{
      return fetch(event.request)
      .then(response => {
        if (response.status === 200) {
          cache.put(event.request.url, response.clone())
        }
        return response
      })
        .catch(err => cache.match(event.request))
    }) .catch(err => console.log(err))
    ) 
    return 
  }
  event.respondWith(

    fetch(event.request).catch(err => {
      return caches.match(event.request).then(res => {
        if (res) {
          return res
        } else if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/')
        }
      })
    })
    )
})

