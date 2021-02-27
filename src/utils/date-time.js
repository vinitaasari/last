import { fromUnixTime, differenceInMilliseconds } from "date-fns";

export const getRemainingTime = (startTime) => {
  const time = fromUnixTime(startTime);
  const remainingTime = differenceInMilliseconds(time, new Date());
  return remainingTime;
};

export const scheduleTimeout = (func, timeoutTime = null) => {
  if (timeoutTime === null || !func) {
    return;
  }

  const id = setTimeout(() => {
    func();
  }, timeoutTime);

  return id;
};
