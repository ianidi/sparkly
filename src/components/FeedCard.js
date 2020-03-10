import * as React from "react";
import { Image, StyleSheet, View, Dimensions } from "react-native";
import { inject, observer } from "mobx-react";
import styled from "styled-components/native";
import { Video } from "expo-av";
//import Video from "react-native-video";
import { scale, verticalScale } from "react-native-size-matters";
import Animated from "react-native-reanimated";
import { BASE_URL } from "../constants";
import images from "../constants/images";
import FeedCardTop from "./FeedCardTop";
import FastImage from "react-native-fast-image";

const { width, height } = Dimensions.get("window");

@inject("feed")
@observer
export default class FeedCard extends React.Component {
  static defaultProps = {
    swipeLeft: 0,
    swipeRight: 0
  };

  render() {
    const { swipeLeft, swipeRight, main } = this.props;

    return (
      <View style={StyleSheet.absoluteFill}>
        {main ? (
          <Animated.View style={[StyleSheet.absoluteFill]}>
            <FeedCardTop data={this.props.feed.FeedCurrent} />

            {!this.props.feed.FeedCurrent.Video &&
              swipeLeft == 0 &&
              swipeRight == 0 && (
                <FastImage
                  source={{
                    uri: this.props.feed.FeedCurrent.URI
                  }}
                  style={styles.image}
                  onLoadEnd={this.props.onLoad}
                />
              )}
            {this.props.feed.FeedCurrent.Video &&
              swipeLeft == 0 &&
              swipeRight == 0 && (
                <Video
                  source={{
                    uri: this.props.feed.FeedCurrent.URI
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
          </Animated.View>
        ) : (
          <>
            <Animated.View
              style={[StyleSheet.absoluteFill, { opacity: swipeLeft }]}
            >
              <FeedCardTop data={this.props.feed.FeedPrevious} />
              {!this.props.feed.FeedPrevious.Video ? (
                <FastImage
                  source={{
                    uri: this.props.feed.FeedPrevious.URI
                  }}
                  style={styles.image}
                />
              ) : (
                <FastImage
                  source={{
                    uri: this.props.feed.FeedPrevious.Thumbnail
                  }}
                  style={styles.image}
                />
              )}
            </Animated.View>

            <Animated.View
              style={[StyleSheet.absoluteFill, { opacity: swipeRight }]}
            >
              <FeedCardTop data={this.props.feed.FeedNext} />
              {!this.props.feed.FeedNext.Video ? (
                <FastImage
                  source={{
                    uri: this.props.feed.FeedNext.URI
                  }}
                  style={styles.image}
                />
              ) : (
                <FastImage
                  source={{
                    uri: this.props.feed.FeedNext.Thumbnail
                  }}
                  style={styles.image}
                />
              )}
            </Animated.View>
          </>
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
