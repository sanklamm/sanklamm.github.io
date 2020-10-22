// Make sure SW are supported
// serve on localhost or via https!

if ("serviceWorker" in navigator) {
  console.log("Service Worker Supported");
  window.addEventListener("load", () => {
    navigator.serviceWorker
      // .register("../sw_cached_pages.js")
      .register("../sw_cached_site.js")
      .then((reg) => console.log("SW: Registered"))
      .catch((err) => console.log(`SW: Error: ${err}`));
  });
}
let isSubscribed = false;
let swRegistration = null;

const notifyButton = document.querySelector(".js-notify-btn");
const pushButton = document.querySelector(".js-push-btn");

if (!("Notification" in window)) {
  console.log("This browser does not support notifications");
}

Notification.requestPermission((status) => {
  console.log("Notification permission status: ", status);
});

function displayNotification() {
  if (Notification.permission == "granted") {
    navigator.serviceWorker.getRegistration().then((reg) => {
      const options = {
        body: "First Notification!",
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
      reg.showNotification("Hello World", options);
    });
  }
}

notifyButton.addEventListener("click", () => {
  displayNotification();
});

function initializeUI() {
  // TODO 3.3b - add a click event listener to the "Enable Push" button
  // and get the subscription object
}

// TODO 4.2a - add VAPID public key

function subscribeUser() {
  // TODO 3.4 - subscribe to the push service
}

function unsubscribeUser() {
  // TODO 3.5 - unsubscribe from the push service
}

function updateSubscriptionOnServer(subscription) {
  // Here's where you would send the subscription to the application server

  const subscriptionJson = document.querySelector(".js-subscription-json");
  const endpointURL = document.querySelector(".js-endpoint-url");
  const subAndEndpoint = document.querySelector(".js-sub-endpoint");

  if (subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    endpointURL.textContent = subscription.endpoint;
    subAndEndpoint.style.display = "block";
  } else {
    subAndEndpoint.style.display = "none";
  }
}

function updateBtn() {
  if (Notification.permission === "denied") {
    pushButton.textContent = "Push Messaging Blocked";
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  }

  if (isSubscribed) {
    pushButton.textContent = "Disable Push Messaging";
  } else {
    pushButton.textContent = "Enable Push Messaging";
  }

  pushButton.disabled = false;
}

function urlB64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
