/* public/uv/uv.config.js */
self.__uv$config = {
    prefix: '/service/',
    bare: 'https://bare.benroast.biz/', // You can host your own bare server or use a public one
    encodeUrl: JavaScriptObfuscator.encodeReverse, // Simple reverse string encoding
    decodeUrl: JavaScriptObfuscator.decodeReverse,
    handler: '/uv/uv.handler.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: '/uv/uv.sw.js',
};

// Simple encoding helper
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
