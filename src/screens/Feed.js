import React from "react";
import { inject, observer } from "mobx-react";
import {
  Animated as RNAnimated,
  Easing as RNEasing,
  Dimensions,
  View,
  StyleSheet,
  TouchableOpacity,
  BackHandler
} from "react-native";
import {
  TapGestureHandler,
  PanGestureHandler,
  State
} from "react-native-gesture-handler";
import {
  getStatusBarHeight,
  getBottomSpace
} from "react-native-iphone-x-helper";
import Animated from "react-native-reanimated";
import { withModal } from "react-native-modalfy";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import LottieView from "lottie-react-native";
import images from "../constants/images";
import FeedCard from "../components/FeedCard";
import FeedCircles from "../components/FeedCircles";

function runSpring(clock, value, dest) {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0)
  };

  const config = {
    damping: 20,
    mass: 1,
    stiffness: 100,
    overshootClamping: false,
    restSpeedThreshold: 1,
    restDisplacementThreshold: 0.5,
    toValue: new Value(0)
  };

  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.velocity, 0),
      set(state.position, value),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position
  ];
}

const { width, height } = Dimensions.get("window");
const toRadians = angle => angle * (Math.PI / 180);
const rotatedWidth =
  width * Math.sin(toRadians(90 - 15)) + height * Math.sin(toRadians(15));
const {
  add,
  multiply,
  neq,
  spring,
  cond,
  eq,
  event,
  lessThan,
  greaterThan,
  and,
  call,
  set,
  clockRunning,
  startClock,
  stopClock,
  Clock,
  Value,
  concat,
  interpolate,
  Extrapolate
} = Animated;

@inject("feed")
@observer
class FeedScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      likeAnimationProgress: new RNAnimated.Value(0),
      likeAnimationVisible: false,
      tempLike: false
    };

    doubleTapRef = React.createRef();

    this.translationX = new Value(0);
    this.translationY = new Value(0);
    this.velocityX = new Value(0);
    this.offsetY = new Value(0);
    this.offsetX = new Value(0);
    this.gestureState = new Value(State.UNDETERMINED);
    this.onGestureEvent = event(
      [
        {
          nativeEvent: {
            translationX: this.translationX,
            translationY: this.translationY,
            velocityX: this.velocityX,
            state: this.gestureState
          }
        }
      ],
      { useNativeDriver: true }
    );
    this.init();
  }

  init = () => {
    const clockX = new Clock();
    const clockY = new Clock();
    const {
      translationX,
      translationY,
      velocityX,
      gestureState,
      offsetY,
      offsetX
    } = this;
    gestureState.setValue(State.UNDETERMINED);
    translationX.setValue(0);
    translationY.setValue(0);
    velocityX.setValue(0);
    offsetY.setValue(0);
    offsetX.setValue(0);

    const finalTranslateX = add(translationX, multiply(0.2, velocityX));
    const translationThreshold = width / 4;
    const snapPoint = cond(
      lessThan(finalTranslateX, -translationThreshold),
      -rotatedWidth,
      cond(greaterThan(finalTranslateX, translationThreshold), rotatedWidth, 0)
    );
    // TODO: handle case where the user drags the card again before the spring animation finished
    this.translateY = cond(
      eq(gestureState, State.END),
      [
        set(translationY, runSpring(clockY, translationY, 0)),
        set(offsetY, translationY),
        translationY
      ],
      cond(
        eq(gestureState, State.BEGAN),
        [stopClock(clockY), translationY],
        translationY
      )
    );
    this.translateX = cond(
      eq(gestureState, State.END),
      [
        set(translationX, runSpring(clockX, translationX, snapPoint)),
        set(offsetX, translationX),
        cond(and(eq(clockRunning(clockX), 0), neq(translationX, 0)), [
          call([translationX], this.swipped)
        ]),
        translationX
      ],
      cond(
        and(eq(gestureState, State.ACTIVE), clockRunning(clockX)),
        [stopClock(clockX), translationX],
        translationX
      )
    );
    /*this.translateX = cond(
      eq(gestureState, State.END),
      [
        set(translationX, runSpring(clockX, translationX, snapPoint)),
        set(offsetX, translationX),
        cond(and(eq(clockRunning(clockX), 0), neq(translationX, 0)), [
          call([translationX], this.swipped)
        ]),
        translationX
      ],
      cond(
        eq(gestureState, State.BEGAN),
        [stopClock(clockX), translationX],
        translationX
      )
    );*/
  };

  swipped = ([translationX]) => {
    if (translationX > 0) {
      this.props.feed.swipe("left");
    } else {
      this.props.feed.swipe("right");
    }

    this.init();
  };

  like = () => {
    this.playLikeAnimation();
  };

  likeByDoubleTap = event => {
    if (event.nativeEvent.state === State.ACTIVE) {
      this.like();
    }
  };

  playLikeAnimation = () => {
    this.setState({ tempLike: true });
    if (this.state.likeAnimationVisible) {
      return;
    }

    this.setState(s => ({
      ...s,
      likeAnimationProgress: new RNAnimated.Value(0),
      likeAnimationVisible: true
    }));

    RNAnimated.timing(this.state.likeAnimationProgress, {
      toValue: 1,
      duration: 2000,
      easing: RNEasing.linear
    }).start(() => this.setState(s => ({ ...s, likeAnimationVisible: false })));
  };

  componentDidMount = () => {
    //this.props.modal.openModal("FeedOnboarding");

    //Set FeedSettings closed
    this.props.feed.set("FeedSettingsOpen", false);

    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      return true;
    });
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  closePress = () => {
    this.props.navigation.goBack();
  };

  openFeedSettings = () => {
    this.props.feed.set("FeedSettingsOpen", true);
    this.props.modal.openModal("FeedSettings");
  };

  report = () => {
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = ["Пожаловаться на контент", "Отмена"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 2;

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex
      },
      buttonIndex => {
        // Do something here depending on the button index selected
      }
    );
  };

  render() {
    const { onGestureEvent, translateX, translateY } = this;
    const rotateZ = concat(
      interpolate(translateX, {
        inputRange: [-width / 2, width / 2],
        outputRange: [15, -15],
        extrapolate: Extrapolate.CLAMP
      }),
      "deg"
    );
    const swipeLeft = interpolate(translateX, {
      inputRange: [0, 1],
      outputRange: [0, 1]
    });
    const swipeRight = interpolate(translateX, {
      inputRange: [-1, 0],
      outputRange: [1, 0]
    });
    const style = {
      ...StyleSheet.absoluteFillObject,
      zIndex: 900,
      transform: [{ translateX }, { translateY }, { rotateZ }]
    };
    //, backgroundColor: "#fff"
    return (
      <View
        style={{
          flex: 1
        }}
      >
        <CloseContainer>
          <TouchableOpacity
            onPress={this.closePress}
            activeOpacity={0.9}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CloseImage source={images.Close} />
          </TouchableOpacity>
        </CloseContainer>

        {this.state.likeAnimationVisible && (
          <View
            style={{
              position: "absolute",
              zIndex: 10000,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center"
            }}
            pointerEvents={"none"}
          >
            <LottieView
              source={images.LottieLike}
              autoPlay
              style={{
                width: width * 0.7
              }}
              progress={this.state.likeAnimationProgress}
            />
          </View>
        )}

        <TouchableOpacity
          onPress={() => this.like()}
          activeOpacity={0.9}
          style={{
            position: "absolute",
            zIndex: 9999,
            bottom: getBottomSpace() + verticalScale(140),
            right: scale(29)
          }}
        >
          <LikeContainer
            style={{
              backgroundColor: this.state.tempLike ? "#f5cfd0" : "#fff"
            }}
          >
            <LikeImage source={images.Like} />
          </LikeContainer>
        </TouchableOpacity>

        {this.props.feed.FeedSettingsOpen == false && (
          <TouchableOpacity
            onPress={() => this.openFeedSettings()}
            activeOpacity={0.9}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
            style={{
              position: "absolute",
              zIndex: 9999,
              bottom: getBottomSpace() + verticalScale(40),
              alignSelf: "center"
            }}
          >
            <FilterContainer>
              <FeedCircles />
            </FilterContainer>
          </TouchableOpacity>
        )}

        <ReportContainer>
          <TouchableOpacity
            onPress={this.report}
            activeOpacity={0.9}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <FeedReportImage source={images.ReportDots} />
          </TouchableOpacity>
        </ReportContainer>

        <TapGestureHandler
          onHandlerStateChange={this.likeByDoubleTap}
          numberOfTaps={2}
        >
          <View
            style={{
              flex: 1,
              zIndex: 100
            }}
          >
            <FeedCard {...{ swipeLeft, swipeRight }} />
            <PanGestureHandler
              onHandlerStateChange={onGestureEvent}
              {...{ onGestureEvent }}
            >
              <Animated.View {...{ style }}>
                <FeedCard />
              </Animated.View>
            </PanGestureHandler>
          </View>
        </TapGestureHandler>
      </View>
    );
  }
}

export default withModal(connectActionSheet(FeedScreen));

const ReportContainer = styled.View`
  position: absolute;
  z-index: 2000;
  width: ${width - scale(40) + `px`};
  bottom: ${getBottomSpace() + verticalScale(40) + scale(11) + `px`};
  margin-left: ${scale(20) + `px`};
  margin-right: ${scale(20) + `px`};
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const FeedReportImage = styled.Image`
  width: ${scale(24) + `px`};
  height: ${scale(24) + `px`};
`;

const CloseContainer = styled.View`
  position: absolute;
  z-index: 2000;
  top: ${getStatusBarHeight() + verticalScale(20) + `px`};
  right: ${scale(20) + `px`};
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const CloseImage = styled.Image`
  width: ${scale(24) + `px`};
  height: ${scale(24) + `px`};
`;

const FilterContainer = styled.View`
  padding-top: ${scale(8) + `px`};
  padding-bottom: ${scale(8) + `px`};
  padding-left: ${scale(8) + `px`};
  padding-right: ${scale(8) + `px`};
  border-radius: 10px;
  background: #fff;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const LikeContainer = styled.View`
  padding-top: ${scale(8) + `px`};
  padding-bottom: ${scale(8) + `px`};
  padding-left: ${scale(8) + `px`};
  padding-right: ${scale(8) + `px`};
  border: ${scale(2) + `px solid #bc7071`};
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const LikeImage = styled.Image`
  width: ${scale(30) + `px`};
  height: ${scale(30) + `px`};
`;
