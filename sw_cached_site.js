const cacheName = "v2";

// Call Install Event
self.addEventListener("install", (e) => {
  console.log("SW: Installed");
});

// Call Activate Event
self.addEventListener("activate", (e) => {
  console.log("SW: Activated");
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            console.log("SW: Clearing Old Cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Call Fetch Event
self.addEventListener("fetch", (e) => {
  console.log("SW: Fetching");
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // make clone of response
        const resClone = res.clone();
        // open cache
        caches.open(cacheName).then((cache) => {
          // add response to cache
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch((err) => caches.match(e.request).then((res) => res))
  );
});

// Call Push Event
self.addEventListener("push", (event) => {
  const options = {
    body: "This notification was generated from a push!",
    icon: "images/notification-flat.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "Go to the site",
        icon: "images/checkmark.png",
      },
      {
        action: "close",
        title: "Close the notification",
        icon: "images/xmark.png",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification("Push Notification", options)
  );
});

// Call Notification Events
self.addEventListener("notificationclose", (event) => {
  const notification = event.notification;
  const primaryKey = notification.data.primaryKey;

  console.log("Closed notification: " + primaryKey);
});

self.addEventListener("notificationclick", (event) => {
  const notification = event.notification;
  const primaryKey = notification.data.primaryKey;
  const action = event.action;

  if (action === "close") {
    notification.close();
  } else {
    clients.openWindow("samples/page" + primaryKey + ".html");
    notification.close();
  }
});
