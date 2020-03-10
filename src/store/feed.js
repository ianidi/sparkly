import { types, flow, onSnapshot, applySnapshot } from "mobx-state-tree";
import { api } from "../service/Api";
import * as NavigationService from "../service/Navigation";
import { message } from "../service/Message";

const FeedModel = types.model({
  FeedID: types.identifierNumber,
  URI: types.string,
  Video: false,
  Viewed: false,
  Fave: false,
  Date: types.maybeNull(types.string), //types.Date
  MatchCount: types.maybeNull(types.number),
  MemberID: types.maybeNull(types.number),
  RoommateSearch: false,
  //Thumbnail: types.maybeNull(types.string),
  MemberName: types.maybeNull(types.string),
  UniversityAbbr: types.maybeNull(types.string),
  AvatarURI: types.optional(types.string, "")
  //Ищу соседа
});

export const FeedStore = types
  .model("FeedStore", {
    FeedSettingsOpen: false, // В данный момент на экране ленты открыты настройки параметров ленты
    RestrictUniversity: false, // Выдавать в ленте студентов только из моего университета
    Gender: types.optional(types.string, "any"), // Выдавать в ленте анкеты только определенного пола (m/f/any)
    Feed: types.array(FeedModel),
    MyFeedURI: types.maybeNull(types.string),
    MyFeedVideo: false,
    MyFeedDate: types.maybeNull(types.string), //types.Date
    FeedIndexPrevious: types.optional(types.number, 0),
    FeedIndex: types.optional(types.number, 0),
    FeedIndexNext: types.optional(types.number, 0)
  })
  .views(self => ({
    get IndexPrevious() {
      let index = self.FeedIndex - 1;

      if (index < 0 || index > self.Feed.length - 1) {
        index = self.Feed.length - 1;
      }

      return index;
    },
    get IndexCurrent() {
      let index = self.FeedIndex;

      if (index < 0 || index > self.Feed.length - 1) {
        index = self.Feed.length - 1;
      }

      return index;
    },
    get IndexNext() {
      let index = self.FeedIndex + 1;

      if (index > self.Feed.length - 1) {
        index = 0;
      }

      return index;
    },
    get FeedPrevious() {
      return self.Feed[self.FeedIndexPrevious];
    },
    get FeedCurrent() {
      return self.Feed[self.IndexCurrent];
    },
    get FeedNext() {
      return self.Feed[self.FeedIndexNext];
    }
  }))
  .actions(self => ({
    setIndexes() {
      self.FeedIndexPrevious = self.IndexPrevious;
      self.FeedIndexNext = self.IndexNext;
    },
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
      //onSnapshot(self, snapshot => console.log("snap", snapshot));
    },
    init() {
      self.InitFeed();
    },
    InitFeed: flow(function*() {
      try {
        const response = yield api.get("/feed");

        console.log(JSON.stringify(response.data));

        if (response.ok && response.data.status == true) {
          if (response.data.result == null) {
            message(
              "Нет новых анкет",
              "Подождите, пока в ленте появятся анкеты",
              "info"
            );
          }
          if (response.data.result.length > 0) {
            applySnapshot(self.Feed, response.data.result);
            NavigationService.navigate("Feed");
          }
        }
      } catch (error) {
        console.log("error", JSON.stringify(error));
      }
    }),
    Report: flow(function*(reason, type) {
      try {
        const response = yield api.post("/report", {
          FeedID: self.FeedCurrent.FeedID, //SubjectID
          Reason: reason,
          Type: type
        });

        if (response.ok && response.data.status == true) {
          message(
            "Жалоба отправлена",
            "Ваша жалоба успешно отправлена",
            "success"
          );
          return true;
        }

        return false;
      } catch (error) {
        console.log("error", JSON.stringify(error));
        return false;
      }
    }),
    Fave: flow(function*() {
      try {
        const response = yield api.post("/feed/fave", {
          FeedID: self.FeedCurrent.FeedID,
          Fave: !self.FeedCurrent.Fave
        });
        console.log(JSON.stringify(response.data));

        if (response.ok && response.data.status == true) {
          self.FeedCurrent.Fave = !self.FeedCurrent.Fave;
          return true;
        }

        return false;
      } catch (error) {
        console.log("error", JSON.stringify(error));
        return false;
      }
    })
  }));
