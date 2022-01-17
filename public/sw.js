/* eslint-disable */

// 'use strict';

// (function () {
//     var landingUrl = "https://timesofindia.indiatimes.com/",
//         defaultIcon = "https://static.toiimg.com/photo/64095869.cms",
//         defaulTitle = "Timesofindia.com",
//         dataAPI = isMobile() ? "https://toibnews.timesofindia.indiatimes.com/TOIBNews/toinotification_toiweb.htm":"https://toibnews.timesofindia.indiatimes.com/TOIBNews/toinotification_toiweb.htm";

//     self.addEventListener('install', function(event) {
//         self.skipWaiting();
//     });

//     self.addEventListener('activate', function(event) {
//     });

//     self.addEventListener('push', function(event) {
//         event.waitUntil(
//             fetch(dataAPI).then(function(response) {
//                 if (response.status !== 200) {
//                     console.log('Looks like there was a problem. Status Code: ' + response.status);
//                     throw new Error();
//                 }

//                 // Examine the text in the response
//                 return response.json().then(function(data) {
//                     var title = (data.title.length) ? data.title : defaulTitle;
//                     var message = data.message;
//                     var icon = (data.icon) ? data.icon: defaultIcon;
//                     var notificationTag = 'toinews-notification-'+ data.date; //data.tag;
//                     var redirecturl = data.path.length ? ap(data.path) : ap(landingUrl);
//                     return self.registration.showNotification(title, {
//                         body: message,
//                         icon: icon,
//                         tag: notificationTag,
//                         vibrate: [300, 100, 400], // Vibrate 300ms, pause 100ms, then vibrate 400ms
//                         data: redirecturl
//                     });
//                 });
//             }).catch(function(err) {
//                 console.error('Unable to retrieve data', err);
//                 var title = 'An error occurred';
//                 var message = 'We were unable to get the information for this push message';
//                 var icon = 'https://timesofindia.indiatimes.com/thumb/49889661/error.jpg';
//                 var notificationTag = 'notification-error';
//             })
//         );
//     });

//     self.addEventListener('notificationclick', function(event) {
//         event.notification.close();

//         event.waitUntil(clients.matchAll({
//             type: "window"
//         }).then(function(clientList) {
//             for (var i = 0; i < clientList.length; i++) {
//                 var client = clientList[i];
//                 if (client.url == '/' && 'focus' in client)
//                     return client.focus();
//             }
//             if (clients.openWindow) {
//                 landingUrl = event.notification.data;
//                 return clients.openWindow(landingUrl);
//             }
//         }));
//     });

//     function getBrowser(){
//         if(/Chrome/i.test(navigator.userAgent)){
//             return 'chrome';
//         }
//         else if(/firefox/i.test(navigator.userAgent)){
//             return 'mozilla';
//         }
//         return '';
//     }

//     function isMobile(){
//         return (function(a) {
//             return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4));
//         })(navigator.userAgent || navigator.vendor || window.opera);
//     }

//     function ap(u){
//         var p ="utm_source=browser_notification&utm_medium="+getBrowser()+"&utm_campaign=TOI_browsernotification",
//             pre = (u.indexOf('?')!=-1) ? '&' : '?';
//         return (u + pre + p);
//     }

// }());
'use strict';
importScripts('https://static.growthrx.in/js/v2/push-sw.js');
