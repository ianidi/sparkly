import { types, flow, onSnapshot, applySnapshot } from "mobx-state-tree";
import { api } from "../service/Api";
import * as NavigationService from "../service/NavigationService";
import { message } from "../service/Message";

const FeedModel = types.model({
  FeedID: types.identifierNumber,
  URL: types.string,
  Video: false,
  Viewed: false
  // Thumbnail: types.maybeNull(types.string),
});

export const FeedStore = types
  .model("FeedStore", {
    Feed: types.array(FeedModel),
    FeedIndex: types.optional(types.number, 0)
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
