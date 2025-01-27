import dayjs from "dayjs";

const convertEpochToDate = (epoch) => dayjs(epoch * 1000);
export default convertEpochToDate;