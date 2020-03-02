import { StyleSheet, Dimensions } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

const Colors = {
    activeColor: "#9499A7",
    inactiveColor: "rgba(0, 0, 0, 0.2)"
  },
  { width } = Dimensions.get("window"),
  Styles = {
    //
    container: {
      flex: 1
    },

    //
    animatedContainer: {
      display: "flex",
      flexDirection: "row",
      flex: 1
    },

    // Scene Container
    sceneContainer: {
      flex: 1,
      paddingBottom: 100
    },

    // Navigation Buttons
    controllerWrapper: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: width,
      paddingBottom: verticalScale(20),
      alignItems: "center",
      justifyContent: "flex-start"
    },
    activePageIndicatorWrapper: {
      display: "flex",
      flexDirection: "row",
      marginBottom: verticalScale(34)
    },
    activePageIndicator: {
      padding: 5
    },
    indicator: {
      width: scale(10),
      height: scale(10),
      borderRadius: 4,
      backgroundColor: "#F0F0F0"
    },
    indicatorActive: {
      backgroundColor: "#9499A7"
    },
    btnText: {
      fontSize: 13,
      fontWeight: "600",
      color: Colors.activeColor
    },
    btnTextHiddden: {
      color: "transparent"
    },
    btnPositive: {
      backgroundColor: "#fff",
      paddingTop: scale(25),
      paddingBottom: scale(25),
      display: "flex",
      alignItems: "center",
      borderWidth: scale(1),
      borderStyle: "solid",
      borderColor: "#525A71"
    },
    btnPositiveText: {
      fontSize: scale(16),
      lineHeight: scale(16),
      fontFamily: "IBMPlexMono",
      color: "#3B435A"
    }
  };

export default StyleSheet.create(Styles);
export { Colors };
