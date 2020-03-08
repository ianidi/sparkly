import AsyncStorage from "@react-native-community/async-storage";
import { create } from "apisauce";
import { BASE_URL } from "../constants";
import { message } from "./Message";

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
    if (typeof response?.headers?.authorization !== "undefined") {
      await AsyncStorage.setItem("@Api:token", response.headers.authorization);
    }

    if (!response.ok) {
      if (response.problem == "TIMEOUT_ERROR") {
        message("Ошибка", "Проверьте ваше интернет-соединение");
      }
    }
  } catch (err) {
    console.log(JSON.stringify(err));
  }
});
