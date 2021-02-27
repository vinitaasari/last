import axios from "axios";

function useCancelRequest() {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  return { token: source.token, cancel: source.cancel };
}

export default useCancelRequest;
