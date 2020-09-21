class string {
    constructor() {
        this.crypto = require('crypto');
        this.moment = require('moment');
        this.setting = require('dotenv').config({ path: '../.env' });
        this.setting = this.setting.parsed;
        this.AES_METHOD = 'aes-256-cbc';
        this.crypto.SHA256 = function(text) {
            var hash = this.createHash('sha256');
            hash.update(text);
            return hash.digest('hex');
        }
    }
    encrypt(text) {
        text = text.toString();
        let iv = Buffer.from(this.crypto.SHA256(this.setting.encryption_iv));
        let cipher = this.crypto.createCipheriv(this.AES_METHOD, Buffer.from(this.crypto.SHA256(this.setting.encryption_key)).slice(0, 32), iv.slice(0, 16));
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return encrypted.toString('hex');
    }
    get_hash(text) {
        return this.crypto.SHA256(text);
    }
    get_token(url, id, email) {
        var token = this.setting.base_url + url + "/" + encodeURIComponent(this.encrypt(id)) + "/" + encodeURIComponent(this.get_hash(email, 'hex'))
        return token;
    }
    pad_str(str) {
        str = str.toString();
        var pad = "0000"
        var ans = pad.substring(0, pad.length - str.length) + str
        return ans;
    }
    decrypt(text) {
        let textParts = text;
        let iv = Buffer.from(this.crypto.SHA256(this.setting.encryption_iv));
        let encryptedText = Buffer.from(textParts, 'hex');
        let decipher = this.crypto.createDecipheriv(this.AES_METHOD, Buffer.from(this.crypto.SHA256(this.setting.encryption_key)).slice(0, 32), iv.slice(0, 16));
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
    randomString(length, type = "") {
        let chars = type == "otp" ? '0123456789' : '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }
    get_username(string, id) {
        return string = string.replace(/[^A-Za-z]+/ig, "-") + "-" + id;
    }
    formar_date(timestamp) {
        return this.moment(parseInt(timestamp)).format("ddd, MMM Do YYYY");
    }
}
module.exports = string;