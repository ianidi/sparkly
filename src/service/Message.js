import { scale, verticalScale } from "react-native-size-matters";
import { showMessage } from "react-native-flash-message";

export function message(title, message, type = "error") {
  let color = "#ed5f74";

  if (type == "success") {
    color = "#24b47e";
  }

  if (type == "info") {
    color = "#000";
  }

  showMessage({
    message: title,
    description: message,
    type: "default",
    titleStyle: {
      fontSize: scale(15)
    },
    textStyle: {
      fontSize: scale(13)
    },
    backgroundColor: color,
    duration: 4000
  });
}
