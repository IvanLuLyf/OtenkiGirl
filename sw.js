self.addEventListener('install', function (event) {
    let languages = ['zh-cn', 'zh-tw', 'ja', 'en-us'];
    let languageCode = (navigator.language || 'zh-cn').toLocaleLowerCase();
    if (languages.indexOf(languageCode) === -1) languageCode = 'zh-cn';
    event.waitUntil(
        caches.open('v2').then(function (cache) {
            return cache.addAll([
                '/OtenkiGirl/',
                '/OtenkiGirl/index.html',
                '/OtenkiGirl/favicon.ico',
                '/OtenkiGirl/dialog.js',
                '/OtenkiGirl/lang/' + languageCode + '.json',
                '/OtenkiGirl/img/avatar.jpg',
                '/OtenkiGirl/img/header.jpg',
                '/OtenkiGirl/img/left.jpg',
                '/OtenkiGirl/img/top.jpg',
            ]);
        })
    );
});
self.addEventListener('fetch', function (event) {
    if (event.request.url.startsWith('https://kvdb.io/')) {
        return;
    }
    event.respondWith(caches.match(event.request).then(function (response) {
        if (response !== undefined) {
            return response;
        } else {
            return fetch(event.request).then(function (response) {
                let responseClone = response.clone();
                caches.open('v1').then(function (cache) {
                    cache.put(event.request, responseClone);
                });
                return response;
            }).catch(function () {
                return new Response('[]');
            });
        }
    }));
});
