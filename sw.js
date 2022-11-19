const CATCH_VER = 'v17';
const IS_DEV = location.hostname === 'localhost';
const APP_NAME = 'OtenkiGirl';
const LANGUAGES = ['zh-cn', 'zh-tw', 'ja', 'en'];
const appLang = () => {
    const full = (navigator.language || 'zh-cn').toLowerCase().substring(0, 5);
    const short = full.substring(0, 2);
    if (LANGUAGES.includes(short)) return short;
    else if (LANGUAGES.includes(full)) return full;
    else return 'zh-cn';
}
self.addEventListener('install', (event) => {
    let baseDir = location.href.indexOf(`/${APP_NAME}/`) < 0 ? '/' : `/${APP_NAME}/`;
    const CACHE_FILES = [
        '',
        'index.html',
        'favicon.ico',
        'dialog.js',
        `lang/${appLang()}.json`,
        'img/avatar.jpg',
        'img/header.jpg',
        'img/left.jpg',
        'img/top.jpg',
    ].map(u => `${baseDir}${u}`)
    event.waitUntil(caches.open(CATCH_VER).then((cache) => cache.addAll(CACHE_FILES)));
});
self.addEventListener('activate', (event) => {
    event.waitUntil(caches.keys().then((names) => Promise.all(names.map((name) => {
        if (name !== CATCH_VER) {
            return caches.delete(name);
        }
    }))));
});
self.addEventListener('fetch', (event) => {
    if (!event.request.url.startsWith(location.origin) || IS_DEV) {
        return;
    }
    event.respondWith(caches.match(event.request).then((response) => {
        if (response !== undefined) {
            return response;
        }
        return fetch(event.request).then((response) => {
            const responseClone = response.clone();
            caches.open(CATCH_VER).then((cache) => {
                cache.put(event.request, responseClone);
            });
            return response;
        }).catch(() => new Response('[]'));
    }));
});
