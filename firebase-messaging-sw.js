importScripts('https://www.gstatic.com/firebasejs/5.2.0//firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.2.0/firebase-messaging.js')

// // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDk6v6fSblQrd1nLw9QGsoGs-1UuzeYzPU",
    authDomain: "readandwritedata-27907.firebaseapp.com",
    databaseURL: "https://readandwritedata-27907.firebaseio.com",
    projectId: "readandwritedata-27907",
    storageBucket: "readandwritedata-27907.appspot.com",
    messagingSenderId: "526759719465"
  };
firebase.initializeApp(config);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  //console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  var notificationTitle = 'OLX APP';
  var notificationOptions = {
    body: payload.data.status,
    image: '/firebase-logo.png',
    icon: '/firebase-images.png'
   };

 return self.registration.showNotification(notificationTitle,notificationOptions);
});
// [END background_handler]
// console.log('... Service Worker File Running ...');

// // Listner for Push Notification
// self.addEventListener('push', function (event) {
//   console.log('Received a push message', event);

//   var notification = event.data.json().notification
//   console.log(notification)
//   var title = notification.title || 'Yay a message.';
//   var body = notification.body || 'We have received a push message.';
//   var icon = '/images/icon-192x192.png';
//   // var tag = 'simple-push-demo-notification-tag';

//   event.waitUntil(
//     self.registration.showNotification(title, {
//       body: body,
//       icon: icon,
//       // tag: tag
//     })
//   );

// });
