import React from "react";
import { inject, observer } from "mobx-react";
import SafeAreaView from "react-native-safe-area-view";
import Onboarding from "../components/Onboarding";
import Screen1 from "../components/Onboarding/Screen1";
import Screen2 from "../components/Onboarding/Screen2";
import Screen3 from "../components/Onboarding/Screen3";

@inject("main")
@inject("member")
@observer
export default class OnboardingScreen extends React.PureComponent {
  complete = () => {
    this.props.main.set("onboadringComplete", true);
    this.props.navigation.navigate("Auth");
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <Onboarding
          scenes={scenes}
          enableBackgroundColorTransition={true}
          activeColor="#9499A7"
          inactiveColor="#F0F0F0"
          onCompleted={this.complete}
        />
      </SafeAreaView>
    );
  }
}

const scenes = [
  {
    component: Screen1,
    backgroundColor: "#fff"
  },
  {
    component: Screen2,
    backgroundColor: "#fff"
  },
  {
    component: Screen3,
    backgroundColor: "#fff"
  }
];
