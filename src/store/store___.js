
  .views(self => ({
    get isAuth() {
      if (self.authToken.length > 0) {
        return true;
      } else {
        return false;
      }
      return self.authToken;
    }
  }))
  .actions(self => ({
    setupAuth: flow(function*() {
      yield self.getAuthToken();
      yield self.getUserInfo();
    }),
    getAuthToken: flow(function*() {
      try {
        const token = yield AsyncStorage.getItem(TOKEN_KEY);
        console.log("Storage", token);

        if (token !== null) {
          self.authToken = token;
        } else {
          console.log("Not logged in");
          //NavigationService.navigate('Main');
        }
      } catch (error) {
        console.log("error", error);
      }
    }),
    saveToken: flow(function*(token) {
      try {
        console.log("saveToken");
        yield AsyncStorage.setItem(TOKEN_KEY, token);
      } catch (error) {
        console.log("error", error);
      }
    }) /*
    login: flow(function*(providerToken, provider) {
      try {
        const res = yield customersApi
          .post({
            token: providerToken,
            provider,
          })
          .json();

        if (res.token) {
          self.authToken = res.token;
          yield self.saveToken(res.token);
          yield self.getUserInfo();
        }
      } catch (error) {
        console.log('error', error);
      }
    }),*/,
    setUserInfo: flow(function*(info) {
      self.info = info;
    }),
    setSkipAuth: flow(function*(value) {
      self.skipAuth = value;
    }),
    clearUserInfo: flow(function*() {
      console.log("cleared user info");
      destroy(self.info);
    }),
    getUserInfo: flow(function*() {
      try {
        if (self.authToken) {
          /*const res = yield customersApi
            .url('/me')
            .headers({Authorization: `Bearer ${self.authToken}`})
            .get()
            .json();

          self.info = res;*/
          //NavigationService.navigate('Main');
        }
      } catch (error) {
        console.log("error", error);
      }
    })
  })




//response.data.result.forEach((item, index) => {
//  self.addFeed(item);
//});
/*
applySnapshot(self, {
        ...self,
        Feed: [feed, ...self.Feed]
      });
      */

/*
      if (typeof self.Previous == "undefined") {
        return { FeedID: 1, URL: "2.jpg", Video: false };
      }

      return self.Previous;*/
/*if (self.Feed.length >= 3) {
        self.Previous = self.Feed[0].FeedID;
        self.Current = self.Feed[1].FeedID;
        self.Next = self.Feed[2].FeedID;
      }*/

/*

    addFeed(item) {
      try {
        const entry = self.Feed.find(el => el.FeedID === item.FeedID);

        if (!entry) {
          self.Feed.push(item);
        }
      } catch (error) {
        console.log("error1", JSON.stringify(error));
      }
    },
    */

/*
    get ProfilePrevious() {
      let index = self.FeedIndex - 1;

      if (index < 0) {
        index = self.Feed.length;
      }

      self.Feed[index].FeedID;
    },
    get ProfileCurrent() {
      self.Feed[self.FeedIndex].FeedID;
    },
    get ProfileNext() {
      let index = self.FeedIndex + 1;

      if (index > self.Feed.length) {
        index = 0;
      }

      self.Feed[index].FeedID;
    }*/

//Previous: types.safeReference(FeedModel),
