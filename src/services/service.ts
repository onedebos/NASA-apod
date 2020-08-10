import axios from "axios";

const apiKey: string | undefined = process.env.REACT_APP_API_KEY;
const baseURL: string = "https://api.nasa.gov/planetary/apod";

const getPictureData = async (startDate: string) => {
  const res = await axios.get(
    `${baseURL}?api_key=${apiKey}&start_date=${startDate}&end_date=${startDate}`
  );
  return res;
};

export default getPictureData;
