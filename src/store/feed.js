import { types, flow, onSnapshot, applySnapshot } from "mobx-state-tree";
import { api } from "../service/Api";
import * as NavigationService from "../service/Navigation";
import { message } from "../service/Message";

const FeedModel = types.model({
  FeedID: types.identifierNumber,
  URL: types.string,
  Video: false,
  Viewed: false,
  Date: types.maybeNull(types.string), //types.Date
  MatchCount: types.maybeNull(types.number),
  //Thumbnail: types.maybeNull(types.string),
  MemberName: types.maybeNull(types.string),
  MemberUniversityAbbr: types.maybeNull(types.string),
  MemberAvatarURL: types.maybeNull(types.string)
  //Ищу соседа
});

export const FeedStore = types
  .model("FeedStore", {
    FeedSettingsOpen: false, // В данный момент на экране ленты открыты настройки параметров ленты
    RestrictUniversity: false, // Выдавать в ленте студентов только из моего университета
    Gender: types.optional(types.string, "any"), // Выдавать в ленте анкеты только определенного пола (m/f/any)
    Feed: types.array(FeedModel),
    FeedIndex: types.optional(types.number, 0),
    MyFeedURL: types.maybeNull(types.string),
    MyFeedVideo: false,
    MyFeedDate: types.maybeNull(types.string) //types.Date
  })
  .views(self => ({
    get IndexPrevious() {
      let index = self.FeedIndex - 1;

      if (index < 0) {
        index = self.Feed.length - 1;
      }

      return index;
    },
    get IndexCurrent() {
      return self.FeedIndex;
    },
    get IndexNext() {
      let index = self.FeedIndex + 1;

      if (index > self.Feed.length - 1) {
        index = 0;
      }

      return index;
    },
    get FeedPrevious() {
      return self.Feed[self.IndexPrevious];
    },
    get FeedCurrent() {
      return self.Feed[self.IndexCurrent];
    },
    get FeedNext() {
      return self.Feed[self.IndexNext];
    }
  }))
  .actions(self => ({
    clear() {
      applySnapshot(self, {});
    },
    set(fieldName, value) {
      self[fieldName] = value;
    },
    toggle(fieldName) {
      self[fieldName] = !self[fieldName];
    },
    swipe(direction) {
      if (direction == "left") {
        self.FeedIndex = self.IndexPrevious;
      } else {
        self.FeedIndex = self.IndexNext;
      }
    },
    afterCreate() {
      onSnapshot(self, snapshot => console.log("snap", snapshot));
    },
    init() {
      self.InitFeed();
    },
    InitFeed: flow(function*() {
      try {
        const response = yield api.get("/feed");

        console.log(JSON.stringify(response.data));

        if (response.ok && response.data.status == true) {
          if (response.data.result.length > 0) {
            applySnapshot(self.Feed, response.data.result);
            NavigationService.navigate("Feed");
          } else {
            message(
              "Нет новых анкет",
              "Подождите, пока в ленте появятся анкеты",
              "info"
            );
          }
        }
      } catch (error) {
        console.log("error", JSON.stringify(error));
      }
    })
  }));
