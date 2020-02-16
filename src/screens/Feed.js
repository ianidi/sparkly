import React from "react";
import { inject, observer } from "mobx-react";
import {
  Dimensions,
  View,
  StyleSheet,
  TouchableOpacity,
  BackHandler
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { Feather as Icon } from "@expo/vector-icons";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import FeedCard from "../components/FeedCard";

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
export default class FeedScreen extends React.Component {
  constructor(props) {
    super(props);

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

  componentDidMount = () => {
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

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.cards}>
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
        <View style={styles.footer}>
          <View />
          <TouchableOpacity
            onPress={this.closePress}
            activeOpacity={0.9}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <Icon name="x" size={40} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbfaff"
  },
  header: {
    position: "absolute",
    top: 0,
    width: width,
    zIndex: 1000,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16
  },
  cards: {
    flex: 1,
    zIndex: 100
  },
  footer: {
    position: "absolute",
    top: 0,
    width: width,
    zIndex: 1000,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16
  }
});
