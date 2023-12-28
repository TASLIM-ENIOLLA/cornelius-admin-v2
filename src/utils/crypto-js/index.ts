const CryptoJS = require("crypto-js");

const SECRET_KEY = process.env.JWT_SECRET;

export function encrypt(rawDataString: string) {
	return CryptoJS.AES.encrypt(rawDataString, SECRET_KEY).toString();
}

export function decrypt(encryptedDataString: string) {
	return CryptoJS.AES.decrypt(encryptedDataString, SECRET_KEY).toString(CryptoJS.enc.Utf8);
}