import AsyncStorage from "@react-native-community/async-storage";
import { create } from "apisauce";
import { BASE_URL } from "../constants";

export const api = create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});

api.addAsyncRequestTransform(request => async () => {
  const token = await AsyncStorage.getItem("@Api:token");

  if (token) request.headers["Authorization"] = `Bearer ${token}`;
});

api.addAsyncResponseTransform(response => async () => {
  try {
    if (typeof response.headers.authorization !== "undefined") {
      await AsyncStorage.setItem("@Api:token", response.headers.authorization);
    }
  } catch (err) {
    console.log(JSON.stringify(err));
  }
});

export const apiUpload = create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "multipart/form-data"
  }
});

apiUpload.addAsyncRequestTransform(request => async () => {
  const token = await AsyncStorage.getItem("@Api:token");

  if (token) request.headers["Authorization"] = `Bearer ${token}`;
  //request.headers["Content-Type"] = `multipart/form-data`;
});

apiUpload.addAsyncResponseTransform(response => async () => {
  try {
    if (typeof response.headers.authorization !== "undefined") {
      await AsyncStorage.setItem("@Api:token", response.headers.authorization);
    }
  } catch (err) {
    console.log(JSON.stringify(err));
  }
});
