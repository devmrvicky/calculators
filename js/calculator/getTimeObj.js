// get time obj
export const getTimeObj = () => {
  let obj = {};
  const time = new Date();
  const monthsList = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  obj.time = `${
    time.getHours() > 12 ? time.getHours() - 12 : time.getHours()
  } : ${time.getMinutes()} ${time.getHours >= 12 ? "am" : "pm"}`;
  obj.date = `${time.getDate()} ${
    monthsList[time.getMonth()]
  }, ${time.getFullYear()}`;
  return obj;
};
