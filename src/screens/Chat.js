import React from "react";
import { inject, observer } from "mobx-react";
import { View, Button } from "react-native";
import { CometChat } from "@cometchat-pro/react-native-chat";
import { decode, encode } from "base-64";

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

this.DOMParser = require("xmldom").DOMParser;

@inject("main")
@inject("auth")
@observer
export default class LoginScreen extends React.Component {
  cometchatLogin() {
    let appID = "12853aafe8ab275";
    let appRegion = "eu";
    var appSettings = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(appRegion)
      .build();

    CometChat.init(appID, appSettings).then(
      () => {
        CometChat.getLoggedinUser().then(user => {
          console.log("get logged in user =>", user);
          if (user !== null) {
            this.props.navigation.navigate("Home");
          }
        });
        console.log("Initialization completed successfully");
      },
      error => {
        console.log("Initialization failed with error:", error);
      }
    );

    console.log("vffvdf");
    var authToken = "1_8fbfb58720afdcc38837bd30d1382201275152c2";
    try {
      CometChat.login(authToken).then(
        User => {
          // var userName = user.name;
          // console.log("Login Successful:", { userName });

          console.log("Login successfully:", { User });
          // User loged in successfully.
        },
        error => {
          console.log("Login failed with exception:", { error });
          // User login failed, check error and take appropriate action.
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <View>
        <Button onPress={() => this.cometchatLogin()} title={"fgdfd"} />
      </View>
    );
  }
}
