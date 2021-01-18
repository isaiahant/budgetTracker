self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('budget-tracker-v1')
      .then(cache => {
        console.log('Opened cache')
        return cache.addAll([
          '/',
          '/index.html',
          '/styles.css',
          'index.js',
          '/icons/icon-192x192.png',
          '/icons/icon-512x512.png'
        ])
      })
  )
})

self.addEventListener('fetch', event => {
  fetch(event.request)
    .catch(err => {
      return caches.match(event.request)
        .then(res => {
          if (res) {
            reurn res
          } else if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match('/')
          }
        })
    })
})