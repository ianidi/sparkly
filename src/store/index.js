import { persist } from "mst-persist";
import AsyncStorage from "@react-native-community/async-storage";
import { AuthStore } from "./auth";
import { MainStore } from "./main";
import { FeedStore } from "./feed";

const auth = AuthStore.create();
const main = MainStore.create();
const feed = FeedStore.create();

persist("@authStoreKey", auth, {
  storage: AsyncStorage,
  jsonify: true
}); //.then(() => console.log("authStore has been hydrated"));

persist("@mainStoreKey", main, {
  storage: AsyncStorage,
  jsonify: true
});

persist("@feedStoreKey", feed, {
  storage: AsyncStorage,
  jsonify: true
});

export const store = {
  auth,
  main,
  feed
};

window.MobxStore = store;
