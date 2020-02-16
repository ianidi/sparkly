import { StyleSheet, Dimensions } from "react-native";
import React from "react";
import {
  ScrollView,
  Animated,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StatusBar,
  Image,
  ViewPropTypes
} from "react-native";
import PropTypes from "prop-types";
import Styles from "./styles";
import { scale, verticalScale } from "react-native-size-matters";
import styled from "styled-components/native";
import images from "../../constants/images";

const windowWidth = Dimensions.get("window").width;

export default class OnboardingAnimate extends React.Component {
  state = {
    isLastScene: false
  };

  // Scene being displayed, change everytime user navigate (swipe/click) to new scene
  _currentScene = 0;

  // Animated value
  _translateXValue = new Animated.Value(0);
  _currentX = 0;

  UNSAFE_componentWillMount() {
    this._translateXValue.addListener(({ value }) => {
      // Keep track of transition X value, used to difine swipe direction
      this._currentX = value;
    });
  }

  // When user is swiping, animate x cordinate accordingly
  _handlePanResponderMove = Animated.event([
    null,
    { dx: this._translateXValue }
  ]);

  // Handler when user stop swiping action
  _handlePanResponderEnd = handler => {
    let previousX = this._currentScene * windowWidth,
      dx = this._currentX - previousX;

    // Define swipe direction, then animate toward the nearest view and setOffset
    let { minValueSwipeAccepted } = this.props;
    if (dx > minValueSwipeAccepted) {
      // Swiped left, go to next scene
      this._nextScene();
    } else if (dx < -1 * minValueSwipeAccepted) {
      // Swiped right, go to previous scene
      this._prevScene();
    } else {
      // Not swipe strong enough, recenter scene
      this._recenterScene();
    }
  };

  _recenterScene = () => {
    this._animateScene(this._currentScene * windowWidth);
  };

  _prevScene = () => {
    if (this._currentScene > 0) {
      this._animateToSceneNo(this._currentScene - 1);
    } else {
      this._recenterScene();
    }
  };

  /**
   * Animate to next scene
   */
  _nextScene = () => {
    let lastScene = this.props.scenes.length - 1;
    if (this._currentScene < lastScene) {
      // Animate to next scene and update currentScene index
      this._animateToSceneNo(this._currentScene + 1);
    } else if (this._currentScene == lastScene) {
      // Process to main application, or any callback after the last scene
      this.props.onCompleted();
    } else {
      // Recenter scene in any other case, might never happend
      this._recenterScene();
    }
  };

  /**
   * Navigate to a given scene number
   *
   * @memberof OnboardingAnimate
   */
  _animateToSceneNo = sceneNo => {
    if (this._currentScene != sceneNo) {
      let toPosition = sceneNo * windowWidth;
      this._currentScene = sceneNo;
      this._animateScene(toPosition);
      this._updateState();
    }
  };

  // Check current scene and update isLastScene state
  _updateState = () => {
    let { _currentScene } = this;
    if (_currentScene == this.props.scenes.length - 1) {
      this.setState({ isLastScene: true });
    } else if (this.state.isLastScene) {
      this.setState({ isLastScene: false });
    }
  };

  _animateScene = toValue => {
    if (toValue < this.props.scenes.length * windowWidth) {
      this._scrollView.scrollTo({ x: toValue });
    }
  };

  /**
   * Get background colors from each scene, create then return an animated background style
   */
  _getTransitionBackground = () => {
    let { scenes } = this.props,
      inputRange = [],
      outputRange = [],
      i;

    for (i = 0; i < scenes.length; i++) {
      inputRange.push(i * windowWidth);
      outputRange.push(scenes[i].backgroundColor);
    }

    return {
      backgroundColor: this._translateXValue.interpolate({
        inputRange,
        outputRange,
        extrapolate: "clamp"
      })
    };
  };

  _renderIndicator = (p, index) => {
    let { activeColor, inactiveColor } = this.props,
      startPosition = index * windowWidth,
      animatedIndicatorBackground = {
        backgroundColor: this._translateXValue.interpolate({
          inputRange: [
            startPosition - windowWidth / 2,
            startPosition,
            startPosition + windowWidth / 2
          ],
          outputRange: [inactiveColor, activeColor, inactiveColor],
          extrapolate: "clamp"
        })
      };

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this._animateToSceneNo(index);
        }}
        key={`obs_pageindicator-${index}`}
      >
        <View style={Styles.activePageIndicator}>
          <Animated.View
            style={[Styles.indicator, animatedIndicatorBackground]}
          ></Animated.View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  /**
   * Render actionable page
   * (page that is not included within on boarding scenes)
   */
  _renderActionablePage = () => {
    let { actionableScene, sceneContainerStyle } = this.props;

    if (actionableScene) {
      return (
        <View style={sceneContainerStyle} collapsable={false}>
          {React.createElement(actionableScene)}
        </View>
      );
    }
  };

  _renderScene = (scene, index) => {
    let { sceneContainerStyle } = this.props,
      animatedValue = this._translateXValue.interpolate({
        inputRange: [index * windowWidth, (index + 1) * windowWidth],
        outputRange: [0, windowWidth]
      });

    return (
      <View
        key={`onboarding_scene_${index}`}
        style={sceneContainerStyle}
        collapsable={false}
      >
        {React.createElement(scene.component, { animatedValue })}
      </View>
    );
  };

  render() {
    let {
        scenes,
        enableBackgroundColorTransition,
        actionableScene,
        activeColor,
        hideStatusBar,
        navigateButtonTitle,
        navigateButtonCompletedTitle,
        buttonActionableTitle
      } = this.props,
      containerStyle = [Styles.container],
      sceneLength = scenes.length + (actionableScene ? 1 : 0);

    if (enableBackgroundColorTransition) {
      containerStyle.push(this._getTransitionBackground());
    }

    return (
      <Animated.View style={containerStyle}>
        <ScrollView
          useScrollView={true}
          ref={ref => (this._scrollView = ref)}
          style={{ flex: 1 }}
          horizontal={true}
          vertical={false}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={14}
          onScroll={Animated.event([
            {
              nativeEvent: { contentOffset: { x: this._translateXValue } }
            }
          ])}
          onScrollEndDrag={this._handlePanResponderEnd}
        >
          <View
            style={[
              Styles.animatedContainer,
              {
                width: windowWidth * scenes.length
              }
            ]}
          >
            {scenes.map(this._renderScene)}
            {this._renderActionablePage()}
          </View>
        </ScrollView>

        {/* Navigation Area */}
        <View style={[Styles.controllerWrapper]}>
          {/* Slider active scene indicator */}
          <View style={Styles.activePageIndicatorWrapper}>
            {scenes.map(this._renderIndicator)}
          </View>
          {/* END: Slider active scene indicator */}

          {/* Text button for actionable scene */}
          {!actionableScene ? null : (
            <TouchableWithoutFeedback
              onPress={() => {
                this._animateToSceneNo(sceneLength - 1);
              }}
            >
              <View style={{ padding: 10, marginBottom: 5 }}>
                <Text style={[Styles.btnText, { color: activeColor }]}>
                  {buttonActionableTitle}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          )}
          {/* END: Text button for actionable scene */}

          {/* Navigate to next page button 
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this._nextScene()}
          >
            <View
              style={[
                Styles.btnPositive,
                {
                  width: windowWidth - scale(32),
                  flexDirection: "row",
                  alignItems: "center"
                }
              ]}
            >
              <View
                style={{
                  width: windowWidth - scale(133),
                  height: verticalScale(90),
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text style={Styles.btnPositiveText}>
                  {this.state.isLastScene
                    ? navigateButtonCompletedTitle
                    : navigateButtonTitle}
                </Text>
              </View>
              <View
                style={{
                  width: scale(1),
                  height: verticalScale(90),
                  backgroundColor: "#525A71"
                }}
              />
              <View
                style={{
                  width: scale(100),
                  height: verticalScale(90),
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {this.state.isLastScene ? (
                  <Image
                    source={images.ButtonStar}
                    style={{ width: scale(40), height: scale(40) }}
                  />
                ) : (
                  <Image
                    source={images.ButtonArrowRight}
                    style={{ width: scale(51), height: scale(11) }}
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>*/}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this._nextScene()}
          >
            <View
              style={[
                Styles.btnPositive,
                {
                  width: windowWidth - scale(32),
                  height: verticalScale(90),
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center"
                }
              ]}
            >
              <Text style={Styles.btnPositiveText}>
                {this.state.isLastScene
                  ? navigateButtonCompletedTitle
                  : navigateButtonTitle}
              </Text>
              <View
                style={{
                  position: "absolute",
                  zIndex: -1,
                  width: scale(50),
                  height: scale(50),
                  borderRadius: 100,
                  backgroundColor: "#F5CFD0"
                }}
              />
            </View>
          </TouchableOpacity>

          {/* END: Navigate to next page button */}
        </View>
        {/* END: Navigation Area */}

        <StatusBar hidden={hideStatusBar} />
      </Animated.View>
    );
  }
}

OnboardingAnimate.propTypes = {
  // Mininum acceptable value for allowing navigate to next or previous scene
  minValueSwipeAccepted: PropTypes.number,

  // Color when indicator is showing active state
  activeColor: PropTypes.string,

  // Color when indicator is showing inactive state
  inactiveColor: PropTypes.string,

  // Style of each scene container
  sceneContainerStyle: ViewPropTypes.style,

  // Hide statusbar
  hideStatusBar: PropTypes.bool,

  // Text title of the navigate to next scene button
  navigateButtonTitle: PropTypes.string,

  // Text title of the link to navigate to the actionable scene
  buttonActionableTitle: PropTypes.string,

  // Callback when click on 'Completed' butotn in the last scene
  onCompleted: PropTypes.func.isRequired
};

OnboardingAnimate.defaultProps = {
  minValueSwipeAccepted: 60,
  activeColor: "#2077E2",
  inactiveColor: "rgba(0, 0, 0, 0.2)",
  sceneContainerStyle: Styles.sceneContainer,
  hideStatusBar: true,
  navigateButtonTitle: "продолжить",
  navigateButtonCompletedTitle: "начать",
  buttonActionableTitle: "Skip to Get Started"
};
