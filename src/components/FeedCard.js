import * as React from "react";
import { Image, StyleSheet, View } from "react-native";
import { inject, observer } from "mobx-react";
import { Video } from "expo-av";
//import Video from "react-native-video";
import Animated from "react-native-reanimated";
import { BASE_URL } from "../constants";

@inject("feed")
@observer
export default class FeedCard extends React.Component {
  static defaultProps = {
    swipeLeft: 0,
    swipeRight: 0
  };

  render() {
    const { swipeLeft, swipeRight } = this.props;

    return (
      <View style={StyleSheet.absoluteFill}>
        <Animated.View
          style={[StyleSheet.absoluteFill, { opacity: swipeLeft }]}
        >
          {!this.props.feed.FeedPrevious.Video ? (
            <Image
              source={{
                uri: BASE_URL + "/static/" + this.props.feed.FeedPrevious.URL
              }}
              style={styles.image}
            />
          ) : (
            <Image
              source={{
                uri:
                  BASE_URL + "/static/" + this.props.feed.FeedPrevious.Thumbnail
              }}
              style={styles.image}
            />
          )}
        </Animated.View>
        <Animated.View
          style={[StyleSheet.absoluteFill, { opacity: swipeRight }]}
        >
          {!this.props.feed.FeedNext.Video ? (
            <Image
              source={{
                uri: BASE_URL + "/static/" + this.props.feed.FeedNext.URL
              }}
              style={styles.image}
            />
          ) : (
            <Image
              source={{
                uri: BASE_URL + "/static/" + this.props.feed.FeedNext.Thumbnail
              }}
              style={styles.image}
            />
          )}
        </Animated.View>
        {!this.props.feed.FeedCurrent.Video &&
          swipeLeft == 0 &&
          swipeRight == 0 && (
            <Image
              source={{
                uri: BASE_URL + "/static/" + this.props.feed.FeedCurrent.URL
              }}
              style={styles.image}
            />
          )}
        {this.props.feed.FeedCurrent.Video &&
          swipeLeft == 0 &&
          swipeRight == 0 && (
            <Video
              source={{
                uri: BASE_URL + "/static/" + this.props.feed.FeedCurrent.URL
              }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="cover"
              shouldPlay
              isLooping
              style={styles.video}
            />
          )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    ...StyleSheet.absoluteFillObject,
    width: null,
    height: null
  },
  video: {
    ...StyleSheet.absoluteFillObject
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  footer: {
    flexDirection: "row"
  },
  name: {
    color: "white",
    fontSize: 32
  },
  like: {
    borderWidth: 4,
    borderRadius: 5,
    padding: 8,
    borderColor: "#6ee3b4"
  },
  likeLabel: {
    fontSize: 32,
    color: "#6ee3b4",
    fontWeight: "bold"
  },
  nope: {
    borderWidth: 4,
    borderRadius: 5,
    padding: 8,
    borderColor: "#ec5288"
  },
  nopeLabel: {
    fontSize: 32,
    color: "#ec5288",
    fontWeight: "bold"
  }
});
