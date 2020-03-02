import { persist } from "mst-persist";
import AsyncStorage from "@react-native-community/async-storage";
import { MemberStore } from "./member";
import { MainStore } from "./main";
import { FeedStore } from "./feed";

const member = MemberStore.create();
const main = MainStore.create();
const feed = FeedStore.create();

persist("@memberStoreKey", member, {
  storage: AsyncStorage,
  jsonify: true
}); //.then(() => console.log("memberStore has been hydrated"));

persist("@mainStoreKey", main, {
  storage: AsyncStorage,
  jsonify: true
});

persist("@feedStoreKey", feed, {
  storage: AsyncStorage,
  jsonify: true
});

export const store = {
  member,
  main,
  feed
};

window.MobxStore = store;
