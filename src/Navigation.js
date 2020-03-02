import React from "react";
import { inject, observer } from "mobx-react";
import {
  createStackNavigator,
  TransitionSpecs,
  TransitionPresets,
  CardStyleInterpolators
} from "@react-navigation/stack";
import { scale, verticalScale } from "react-native-size-matters";

import Header from "./components/Header";
import OnboardingScreen from "./screens/Onboarding";
import AuthScreen from "./screens/Auth/Auth";
import AuthSMSCodeScreen from "./screens/Auth/SMSCode";
import AuthNameGenderScreen from "./screens/Auth/NameGender";
import IntroScreen from "./screens/Auth/Intro";
import UniversityScreen from "./screens/Auth/University";
import FacultyScreen from "./screens/Auth/Faculty";
import FeedScreen from "./screens/Feed";
import CameraScreen from "./screens/Camera";
import HomeScreen from "./screens/Home";
import ProfileScreen from "./screens/Profile";
import SettingsScreen from "./screens/Settings";
import MessagesScreen from "./screens/Messages";
import ChatScreen from "./screens/Chat";
import InterestsScreen from "./screens/Interests";

const Stack = createStackNavigator();

@inject("main")
@inject("member")
@observer
export default class Navigation extends React.Component {
  render() {
    return (
      <Stack.Navigator
        //initialRouteName="Onboarding"
        mode="modal"
        screenOptions={{
          gestureEnabled: false,
          //gestureDirection: "horizontal",
          transitionSpec: {
            open: TransitionSpecs.TransitionIOSSpec,
            close: TransitionSpecs.TransitionIOSSpec
          },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          header: ({ scene, previous, navigation }) => {
            const { options } = scene.descriptor;
            const title =
              options.headerTitle !== undefined
                ? options.headerTitle
                : options.title !== undefined
                ? options.title
                : scene.route.name;

            if (options.headerShown == false) {
              return null;
            }
            return <Header title={title} previous={previous} />;
          },
          headerStyle: {
            height: verticalScale(65)
          }
        }}
      >
        {this.props.member.status == false ? (
          <>
            {this.props.main.onboadringComplete == false && (
              <Stack.Screen
                name="Onboarding"
                component={OnboardingScreen}
                options={{
                  headerTitle: null,
                  headerShown: false
                }}
              />
            )}
            <Stack.Screen
              name="Auth"
              component={AuthScreen}
              options={{
                headerTitle: null,
                headerShown: false
              }}
            />
            <Stack.Screen
              name="AuthSMSCode"
              component={AuthSMSCodeScreen}
              options={{
                headerTitle: null,
                headerShown: false
              }}
            />
          </>
        ) : (
          <>
            {this.props.member.SignupComplete == false &&
            this.props.member.demoMode == false ? (
              <>
                <Stack.Screen
                  name="NameGender"
                  component={AuthNameGenderScreen}
                  options={{
                    headerTitle: null,
                    headerShown: false
                  }}
                />
                <Stack.Screen
                  name="University"
                  component={UniversityScreen}
                  options={{
                    headerTitle: null,
                    headerShown: false
                  }}
                />
                <Stack.Screen
                  name="Faculty"
                  component={FacultyScreen}
                  options={{
                    headerTitle: null,
                    headerShown: false
                  }}
                />
                <Stack.Screen
                  name="Intro"
                  component={IntroScreen}
                  options={{
                    headerTitle: null,
                    headerShown: false
                  }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{
                    headerTitle: null,
                    headerShown: false
                  }}
                />
                <Stack.Screen
                  name="Profile"
                  component={ProfileScreen}
                  options={{
                    headerTitle: null,
                    headerShown: false,
                    cardOverlayEnabled: true,
                    ...TransitionPresets.ModalPresentationIOS
                  }}
                  mode="modal"
                />
                <Stack.Screen
                  name="Settings"
                  component={SettingsScreen}
                  options={{
                    headerTitle: null,
                    headerShown: false,
                    cardOverlayEnabled: true,
                    ...TransitionPresets.ModalPresentationIOS
                  }}
                  mode="modal"
                />
                <Stack.Screen
                  name="Camera"
                  component={CameraScreen}
                  options={{
                    headerTitle: null,
                    headerShown: false,
                    ...TransitionPresets.FadeFromBottomAndroid
                  }}
                />
                <Stack.Screen
                  name="Messages"
                  component={MessagesScreen}
                  options={{
                    headerTitle: null,
                    headerShown: false,
                    ...TransitionPresets.FadeFromBottomAndroid
                  }}
                />
                <Stack.Screen
                  name="Chat"
                  component={ChatScreen}
                  options={{
                    headerTitle: null,
                    headerShown: false,
                    ...TransitionPresets.FadeFromBottomAndroid
                  }}
                />
                <Stack.Screen
                  name="Interests"
                  component={InterestsScreen}
                  options={{
                    headerTitle: null,
                    headerShown: false,
                    ...TransitionPresets.FadeFromBottomAndroid
                  }}
                />
                <Stack.Screen
                  name="Feed"
                  component={FeedScreen}
                  options={{
                    headerTitle: null,
                    headerShown: false,
                    ...TransitionPresets.FadeFromBottomAndroid
                  }}
                />
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    );
  }
}
