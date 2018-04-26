(function() {
    'use strict';
  
    self.addEventListener('notificationclose', function(e) {
        console.log("close", e);
      var notification = e.notification;
      var primaryKey = notification.data.primaryKey;
  
      console.log('Closed notification: ' + primaryKey);
    });
  
    self.addEventListener('notificationclick', function(e) {
        console.log("click", e);
        alert("click");
        
      var notification = e.notification;
      notification.close();
      var primaryKey = notification.data.primaryKey;
      var action = e.action;
  
      if (action === 'close') {
        notification.close();
      } else {
        clients.openWindow('samples/page' + primaryKey + '.html');
        notification.close();
      }
  
      // TODO 5.3 - close all notifications when one is clicked
  
    });
  
    // TODO 3.1 - handle the push event
  
  })();