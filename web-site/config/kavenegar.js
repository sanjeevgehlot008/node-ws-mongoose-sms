var Kavenegar = require('kavenegar');
var api = Kavenegar.KavenegarApi({
    apikey: process.env.KAVENEGAR_API_KEY
});

module.exports = api;