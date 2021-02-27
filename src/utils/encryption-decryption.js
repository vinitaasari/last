import aesjs from "aes-js"
/**
 * [ this is clonned fn from aes-ecb package to fulfill encryption requirement ]
 * @param {sring} keyString encryption key
 * @param {json} input data you want to encrypt
 * @param {string} pref -
 * @param {string} s -
 */
export function encryptor(keyString, input, pref, s) {
  try {
    const key = keyString.trim()
    const value = input.trim()
    const keyBuffer = aesjs.utils.utf8.toBytes(key)
    const inputBuffer = aesjs.padding.pkcs7.pad(aesjs.utils.utf8.toBytes(value))
    /* eslint new-cap: "off" */
    const escEcb = new aesjs.ModeOfOperation.ecb(keyBuffer)
    const encryptedBytes = escEcb.encrypt(inputBuffer)
    const encryptedData = Buffer.from(encryptedBytes).toString("base64")
    if ((pref, s)) {
      const tPref = pref.trim()
      const tS = s.trim()
      return `${tPref}${tS}${encryptedData}`
    }
    return encryptedData
  } catch (error) {
    const errorMessage = {
      message: "Something went wrong while encrypting data: ",
      error: true,
      code: "401",
    }
    throw errorMessage
  }
}
/**
 * [ this is clonned fn from aes-ecb package to fulfill decryption requirement ]
 * @param {sring} keyString decryotion key
 * @param {json} input data you want to decrypt
 * @param {string} s -
 */
export function decryptor(keyString, input, s) {
  try {
    const key = keyString.trim()
    let data
    if (s) {
      const _s = s.trim()
      data = input.split(_s)[1].trim()
    } else {
      data = input.trim()
    }
    /* eslint new-cap: "off" */
    const keyBuffer = aesjs.utils.utf8.toBytes(key)
    const escEcb = new aesjs.ModeOfOperation.ecb(keyBuffer)
    const buf = Buffer.from(data, "base64")
    let decryptedBytes = escEcb.decrypt(buf)
    decryptedBytes = aesjs.padding.pkcs7.strip(decryptedBytes)
    const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes)
    return decryptedText
  } catch (error) {

    const errorMessage = {
      message: "Something went wrong while decrypting data",
      error: true,
      code: "401",
    }
    throw errorMessage
  }
}
