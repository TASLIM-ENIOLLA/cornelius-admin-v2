const CryptoJs = require("crypto-js");

const base64Url = {
  encode: function (string: string) {
    return btoa(string).replace(/\+/g, '_').replace(/\//g, '-').replace(/=+$/g, '');
  },
  decode: function (string: string) {
    return atob(string.replace(/\_/g, '+').replace(/\-/g, '/'));
  }
}

const SECRET: string | undefined = process.env.JWT_SECRET;
const HEADER: { timestamp: number } =  { timestamp: new Date().getTime() }

export function sign(payload: string): string {
  if(typeof payload !== "string") {
    throw new Error("Payload has to be a string.");
  }

  const base64Header: string = base64Url.encode(JSON.stringify(HEADER));
  const base64Payload: string = base64Url.encode(payload);
  const base64Signature: string = base64Url.encode(CryptoJs.HmacSHA256(
    `${base64Header}.${base64Payload}`,
    SECRET
  ).toString())

  return `${base64Header}.${base64Payload}.${base64Signature}`;
}

export function verify(jwt: string): string | null {
  const [ header, payload, signature ]: string[] = jwt.split(".");

  if([ header, payload, signature ].some((chunk) => chunk === undefined)) {
    throw new Error("Invalid JWT provided.");
  }

  const base64Signature: string = base64Url.encode(CryptoJs.HmacSHA256(
    `${header}.${payload}`,
    SECRET
  ).toString());

  if(base64Signature === signature) {
    return base64Url.decode(payload);
  }

  return null;
}