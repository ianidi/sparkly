import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import * as Progress from "react-native-progress";
import AnimatedEllipsis from "react-native-animated-ellipsis";
import PropTypes from "prop-types";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    marginTop: 100,
    marginBottom: 10
  },
  itemAlignStart: {
    flexDirection: "row"
  },
  itemAlignEnd: {
    marginLeft: "auto"
  },
  progressText: {
    paddingTop: 3,
    color: "#fff",
    paddingLeft: 10
  },
  progressContainer: {
    color: "#fff",
    paddingLeft: width * 0.05,
    paddingRight: width * 0.05,
    position: "absolute",
    zIndex: 2
  }
});

const CapaUploadProgress = props => {
  const { uploadProgress } = props;

  return (
    <View style={styles.progressContainer}>
      <View style={styles.container}>
        <View style={styles.itemAlignEnd}>
          <AnimatedEllipsis
            style={{
              color: "#fff",
              fontSize: 30,
              letterSpacing: 0,
              marginTop: -15
            }}
          />
        </View>
      </View>
      <Progress.Bar
        unfilledColor="#000"
        borderRadius={0}
        borderWidth={0}
        height={1}
        color="white"
        progress={uploadProgress}
        width={width * 0.9}
      />
    </View>
  );
};

CapaUploadProgress.propTypes = {
  uploadProgress: PropTypes.number.isRequired
};

export default CapaUploadProgress;
