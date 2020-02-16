import * as React from "react";
import { Easing, Dimensions } from "react-native";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./service/NavigationService";
import { ModalProvider, createModalStack } from "react-native-modalfy";
import FlashMessage from "react-native-flash-message";
import { Provider } from "mobx-react";
import { store } from "./store";
import Navigation from "./Navigation";
import ModalMenu from "./components/ModalMenu";

enableScreens();

const { width, height } = Dimensions.get("screen");

const modalOptions = {
  transitionOptions: animatedValue => ({
    opacity: animatedValue.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, 1, 2]
    }),
    transform: [
      {
        translateX: animatedValue.interpolate({
          inputRange: [0, 1, 25],
          outputRange: [width / 2, 0, 25]
        })
      },
      {
        scale: animatedValue.interpolate({
          inputRange: [1, 1, 1],
          outputRange: [1, 1, 1]
        })
      }
    ]
  }),
  animateInConfig: {
    easing: Easing.bezier(0.42, -0.03, 0.27, 0.95),
    duration: 450
  },
  animateOutConfig: {
    easing: Easing.bezier(0.42, -0.03, 0.27, 0.95),
    duration: 200
  }
};

const ModalStack = createModalStack({ Menu: ModalMenu }, modalOptions);

export default function App() {
  return (
    <Provider {...store}>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <ModalProvider stack={ModalStack}>
            <Navigation />
            <FlashMessage />
          </ModalProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
