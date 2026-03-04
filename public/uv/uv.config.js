/* public/uv/uv.config.js */
self.__uv$config = {
    prefix: '/service/',
    bare: '/bare/', // Points to the route we created in server.js
    encodeUrl: JavaScriptObfuscator.encodeReverse,
    decodeUrl: JavaScriptObfuscator.decodeReverse,
    handler: '/uv/uv.handler.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: '/uv/uv.sw.js',
};

const JavaScriptObfuscator = {
    encodeReverse(str) {
        if (!str) return str;
        return encodeURIComponent(str.split('').reverse().join(''));
    },
    decodeReverse(str) {
        if (!str) return str;
        return decodeURIComponent(str).split('').reverse().join('');
    }
};
