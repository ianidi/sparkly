import "react-native-gesture-handler";
import { AppRegistry, YellowBox } from "react-native";
import App from "./src/App";
import { name as appName } from "./app.json";

YellowBox.ignoreWarnings([
  "Warning: componentWillMount is deprecated",
  "Warning: componentWillReceiveProps",
  "Module RCTImageLoader"
]);

AppRegistry.registerComponent(appName, () => App);
