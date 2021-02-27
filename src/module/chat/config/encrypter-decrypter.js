import { USER_TOKEN } from "../../../constants";
import { encryptor, decryptor } from "../../../utils/encryption-decryption";
import _ from 'lodash'

function getUserToken() {
    // return window.localStorage.getItem(USER_TOKEN);
    return "MX1JwfH3CsKmAIYFbunRyWaGe7vJlODK";
}

const isEncryptionEnabled=()=>{
    const isEncryptionEnabled= window.localStorage.getItem('is_encryption_enabled')
   
    console.log("isEncryptionEnabled: ",isEncryptionEnabled)
    if (_.isUndefined(isEncryptionEnabled) || Number(isEncryptionEnabled)===0)
        return 0
    else
        return isEncryptionEnabled;
}

const encryptMessage =(data) => {
    console.log("ENCODEED BUFFER DATA: ", getUserToken())
    console.log("ENCODEED isEncryptionEnabled: ", isEncryptionEnabled())
    const isEnabled=isEncryptionEnabled();
   
    if (isEnabled) {
        return encryptor(getUserToken(), data);
    } else
        return data
};

const decryptMesg =(encrptString) => {
    console.log("DECOIDED BUFFER DATA: ", getUserToken())
    console.log("DECOIDED isEncryptionEnabled: ", isEncryptionEnabled())
    const isEnabled=isEncryptionEnabled();
   
    if (isEnabled) {
        return decryptor(getUserToken(), encrptString)
    } else
        return encrptString
}

export { encryptMessage, decryptMesg }