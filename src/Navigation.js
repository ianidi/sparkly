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
import Onboarding from "./screens/Onboarding";
import Auth from "./screens/Auth/Auth";
import AuthSMSCode from "./screens/Auth/SMSCode";
import NameGender from "./screens/Auth/NameGender";
import Intro from "./screens/Auth/Intro";
import University from "./screens/Auth/University";
import Faculty from "./screens/Auth/Faculty";
import Feed from "./screens/Feed";
import FeedMy from "./screens/FeedMy";
import Camera from "./screens/Camera";
import Home from "./screens/Home";
import Profile from "./screens/Profile";
import Settings from "./screens/Settings";
import Dialogs from "./screens/Dialogs";
import Chat from "./screens/Chat";
import Interests from "./screens/Interests";
//import Dialogs from "./chat/screens/Dialogs";
//import Chat from "./chat/screens/Chat";
//import Dialogs from "./chat/screens/auth/index.js";

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
            {this.props.main.OnboadringComplete == false && (
              <Stack.Screen
                name="Onboarding"
                component={Onboarding}
                options={{
                  headerTitle: null,
                  headerShown: false
                }}
              />
            )}
            <Stack.Screen
              name="Auth"
              component={Auth}
              options={{
                headerTitle: null,
                headerShown: false
              }}
            />
            <Stack.Screen
              name="AuthSMSCode"
              component={AuthSMSCode}
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
                  component={NameGender}
                  options={{
                    headerTitle: null,
                    headerShown: false
                  }}
                />
                <Stack.Screen
                  name="University"
                  component={University}
                  options={{
                    headerTitle: null,
                    headerShown: false
                  }}
                />
                <Stack.Screen
                  name="Faculty"
                  component={Faculty}
                  options={{
                    headerTitle: null,
                    headerShown: false
                  }}
                />
                <Stack.Screen
                  name="Intro"
                  component={Intro}
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
                  component={Home}
                  options={{
                    headerTitle: null,
                    headerShown: false
                  }}
                />
                <Stack.Screen
                  name="Profile"
                  component={Profile}
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
                  component={Settings}
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
                  component={Camera}
                  options={{
                    headerTitle: null,
                    headerShown: false,
                    ...TransitionPresets.FadeFromBottomAndroid
                  }}
                />
                <Stack.Screen
                  name="Chat"
                  component={Chat}
                  options={{
                    headerTitle: null,
                    headerShown: false,
                    ...TransitionPresets.FadeFromBottomAndroid
                  }}
                />
                <Stack.Screen
                  name="Interests"
                  component={Interests}
                  options={{
                    headerTitle: null,
                    headerShown: false,
                    ...TransitionPresets.FadeFromBottomAndroid
                  }}
                />
                <Stack.Screen
                  name="Dialogs"
                  component={Dialogs}
                  options={{
                    headerTitle: null,
                    headerShown: false,
                    ...TransitionPresets.FadeFromBottomAndroid
                  }}
                />
                <Stack.Screen
                  name="Feed"
                  component={Feed}
                  options={{
                    headerTitle: null,
                    headerShown: false,
                    ...TransitionPresets.FadeFromBottomAndroid
                  }}
                />
                <Stack.Screen
                  name="FeedMy"
                  component={FeedMy}
                  options={{
                    headerTitle: null,
                    headerShown: false,
                    ...TransitionPresets.FadeFromBottomAndroid
                  }}
                />
                <Stack.Screen
                  name="EditNameGender"
                  component={NameGender}
                  options={{
                    headerTitle: null,
                    headerShown: false,
                    ...TransitionPresets.FadeFromBottomAndroid
                  }}
                />
                <Stack.Screen
                  name="EditUniversity"
                  component={University}
                  options={{
                    headerTitle: null,
                    headerShown: false,
                    ...TransitionPresets.FadeFromBottomAndroid
                  }}
                />
                <Stack.Screen
                  name="EditFaculty"
                  component={Faculty}
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
