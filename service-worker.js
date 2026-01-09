// Service Worker for WhatsDP PWA
const CACHE_NAME = 'whatsdp-v2.0.0';
const APP_SHELL_CACHE = 'whatsdp-app-shell-v1';
const DATA_CACHE = 'whatsdp-data-v1';

// Assets to cache immediately on install
const APP_SHELL_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Install event - cache app shell
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(APP_SHELL_CACHE)
        .then((cache) => {
          console.log('[Service Worker] Caching app shell');
          return cache.addAll(APP_SHELL_ASSETS);
        }),
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (cacheName !== APP_SHELL_CACHE && 
              cacheName !== DATA_CACHE && 
              cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - advanced caching strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Handle API requests (network first)
  if (url.pathname.includes('api') || 
      url.hostname.includes('eliteprotech') ||
      url.hostname.includes('whatsapp') ||
      url.hostname.includes('wa.me') ||
      url.hostname.includes('ipify') ||
      url.hostname.includes('ipapi')) {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }
  
  // Handle app shell (cache first)
  if (APP_SHELL_ASSETS.some(asset => url.pathname.endsWith(asset))) {
    event.respondWith(cacheFirstStrategy(event.request));
    return;
  }
  
  // Default: network first with cache fallback
  event.respondWith(networkFirstStrategy(event.request));
});

// Cache First Strategy
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(APP_SHELL_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return offline page for HTML requests
    if (request.headers.get('accept').includes('text/html')) {
      return caches.match('/index.html');
    }
    throw error;
  }
}

// Network First Strategy
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DATA_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // For HTML requests, return app shell
    if (request.headers.get('accept').includes('text/html')) {
      return caches.match('/index.html');
    }
    
    throw error;
  }
}

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-fetch-requests') {
    event.waitUntil(syncFetchRequests());
  }
});

async function syncFetchRequests() {
  console.log('[Service Worker] Syncing fetch requests...');
  // Implement background sync logic here
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update from WhatsDP!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-72x72.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('WhatsDP', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handler for updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_IMAGES') {
    event.waitUntil(cacheImages(event.data.urls));
  }
});

async function cacheImages(urls) {
  const cache = await caches.open(DATA_CACHE);
  await Promise.all(
    urls.map(async (url) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
        }
      } catch (error) {
        console.log('Failed to cache image:', url);
      }
    })
  );
}
