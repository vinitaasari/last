import axios from "axios";
import jwt from "jsonwebtoken";

import { encryptor, decryptor } from "./encryption-decryption";

// get api base path obj and api domain
import { apiDomain, apiBasePath } from "../utils/api-groups";
import { USER_EMAIL, USER_TOKEN, USER_ID } from "../constants";

// get user email
function getUserEmail() {
  return window.localStorage.getItem(USER_EMAIL);
}

// get user token
function getUserToken() {
  return window.localStorage.getItem(USER_TOKEN);
}

function getUserId() {
  return window.localStorage.getItem(USER_ID);
}

// sign jwt token
const signJwtToken = (body, shouldUseDefaultToken) => {
  // const { id, secret } = JSON.parse(getUserDetails());

  const key = shouldUseDefaultToken
    ? process.env.REACT_APP_LOGIN_TOKEN
    : getUserToken();

  const header = {
    alg: "HS256",
    typ: "JWT",
    channel: "web",
    user_id: getUserId(),
  };

  if (shouldUseDefaultToken) {
    delete header.user_id;
  }

  return jwt.sign({ params: body }, key, {
    header,
  });
};

const myInstance = axios.create();

export function apiClient(
  method,
  basePathName,
  endPoint,
  {
    body,
    shouldUseDefaultToken = false,
    enableLogging = false,
    cancelToken = "",
    ...customConfig
  } = {}
) {
  // grab the base path
  const basePath = apiBasePath[basePathName];
  // const { id, secret, email } = JSON.parse(getUserDetails());
  // console.log(id, secret, email);
  // get the token
  const userToken = shouldUseDefaultToken
    ? process.env.REACT_APP_LOGIN_TOKEN
    : getUserToken();

  // alert(shouldUseDefaultToken)
  // encrypt the request
  const createBuffer = (apiBody) => {
    const encodeBuffer = Buffer.from(JSON.stringify(apiBody));
    return encodeBuffer + "";
  };

  // generate SHA2
  const generateSHA2 = (encodeBuffer) => {
    return encryptor(userToken, encodeBuffer);
  };

  // get buffer and signature
  const buffer = createBuffer(body);
  const signature = generateSHA2(buffer);
  const signedJwtToken = signJwtToken(body, shouldUseDefaultToken);
  // set the headers for request
  const headers = {
    "content-type": "application/json",
    channel: "web",
    // signature,
    Authorization: `Bearer ${signedJwtToken}`,
  };

  // if the api client is being called after login then also inclue the email in header
  if (!shouldUseDefaultToken) {
    const userEmail = getUserEmail();

    if (userEmail) {
      headers.email = userEmail;
    }
  }

  // api payload log
  if (enableLogging) {
    console.group("API Body & SHA2");
    console.log(body);
    console.log(signature);
    console.groupEnd("API Body & SHA2");
  }

  // create axios config
  const config = {
    // request method
    method,
    // base URL
    baseURL: apiDomain,
    // request url
    url: `${process.env.REACT_APP_ENVIRONMENT_TYPE}_${basePath}/${endPoint}`,
    // customconfig
    ...customConfig,
    // headers
    headers: {
      ...headers,
      ...customConfig.headers,
    },
    responseType: "json", // default
    // timeout
    timeout: customConfig.timeout ? customConfig.timeout : 0,
    cancelToken,
  };

  // append the encrypted api body
  config.data = {
    params: signature,
  };

  // return promise
  return myInstance(config)
    .then((response) => {
      // api response log
      if (enableLogging) {
        console.group("API Response");
        console.log(response);
        console.groupEnd("API Response");
      }
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data

      const { data } = response;
      // if(url.)
      if (data.content) {
        const password = shouldUseDefaultToken
          ? process.env.REACT_APP_LOGIN_TOKEN
          : getUserToken();

        try {
          const encryptedRes = jwt.decode(data.content);
          // debugger
          const decryptedData = decryptor(password, encryptedRes.params);
          const parsedObj = JSON.parse(decryptedData);

          // api response log
          if (enableLogging) {
            console.group("API Decrypted Response");
            console.log(parsedObj);
            console.groupEnd("API Decrypted Response");
          }

          // check if there are no errors

          const { error, code, content } = parsedObj;

          // check for errors and status code
          if (
            !error &&
            code >= 200 &&
            code < 300 &&
            content &&
            content.data !== null
          ) {
            return parsedObj;
          } else {
            return Promise.reject({ code: code, message: error.message });
          }
        } catch (err) {
          return Promise.reject({
            code: 403,
            message: "Invalid token",
          });
        }
      } else if (data.content === null && data.code && data.error) {
        return Promise.reject({ ...data.error });
      }
    })
    .catch((error) => {
      // check for errorHandle config
      if (
        error.config &&
        error.config.hasOwnProperty("errorHandle") &&
        error.config.errorHandle === false
      ) {
        return Promise.reject(error);
      }

      // error log
      if (enableLogging) {
        console.group("API Error");
        console.error(error);
        console.groupEnd("API Error");
      }

      let err = error;

      if (error.response && error.response.status) {
        // err = JSON.stringify();
        err = {
          code: error.response.status,
          message: error.message,
          userMessage: error.userMessage || "",
        };
      } else if (!error.response) {
        err = {
          code: 500,
          message: error.message,
          userMessage: error.userMessage || "",
        };
        // err = JSON.stringify({
        //   code: 500,
        //   message: error.message,
        // });
      }

      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      return Promise.reject(err);
    });
}
