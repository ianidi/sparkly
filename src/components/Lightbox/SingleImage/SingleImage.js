import React, { PureComponent } from "react";
import {
  View,
  Animated,
  TouchableOpacity,
  PanResponder,
  Image,
  ScrollView,
  Modal,
  StyleSheet,
  Dimensions
} from "react-native";
import SwipeableViews from "react-swipeable-views-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import PropTypes from "prop-types";
import ImageCustom from "../ImageCustom";
import images from "../../../constants/images";

const ANIM_CONFIG = { duration: 200 };
const { width, height } = Dimensions.get("window");

export default class SingleImage extends PureComponent {
  static propTypes = {
    uri: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    uri: "https://avatars2.githubusercontent.com/u/31804215?s=40&v=4"
  };

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      origin: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      },
      target: {
        x: 0,
        y: 0,
        opacity: 1
      },
      fullscreen: false,
      animating: false,
      panning: false,
      selectedImageHidden: false,
      slidesDown: false
    };
    this.openAnim = new Animated.Value(0);
    this.pan = new Animated.Value(0);

    this.carouselItems = {};

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => !this.state.animating,
      onStartShouldSetPanResponderCapture: () => !this.state.animating,
      onMoveShouldSetPanResponder: () => !this.state.animating,
      onMoveShouldSetPanResponderCapture: () => !this.state.animating,
      onPanResponderTerminationRequest: () => true,
      onPanResponderMove: (evt, gestureState) => {
        this.pan.setValue(gestureState.dy);

        if (Math.abs(gestureState.dy) > 15 && !this.state.panning) {
          this.pan.setValue(0);
          this.setState({ panning: true });
        }
      },
      onPanResponderRelease: this.handlePanEnd,
      onPanResponderTerminate: this.handlePanEnd
    });
  }

  animateOpenAnimToValue = (toValue, onComplete) =>
    Animated.timing(this.openAnim, {
      ...ANIM_CONFIG,
      toValue
    }).start(() => {
      this.setState({ animating: false });
      if (onComplete) {
        onComplete();
      }
    });
  open = index => () => {
    const activeComponent = this.carouselItems[index].carouselItems[index];
    activeComponent.measure((rx, ry, width, height, x, y) => {
      this.setState(
        {
          fullscreen: true,
          animating: true,
          origin: { x, y, width, height },
          target: { x: 0, y: 0, opacity: 1 },
          index: index - 1
        },
        () => {
          this.animateOpenAnimToValue(1);
        }
      );
    });
  };

  close = () => {
    this.setState({ animating: true });
    this.carouselItems[this.state.index + 1].carouselItems[
      this.state.index + 1
    ].measure((rx, ry, width, height, x, y) => {
      this.setState({
        origin: { x, y, width, height },
        slidesDown: x + width < 0 || x > width
      });

      this.animateOpenAnimToValue(0, () => {
        this.setState({
          fullscreen: false,
          selectedImageHidden: false,
          slidesDown: false
        });
      });
    });
  };
  handlePanEnd = (evt, gestureState) => {
    if (Math.abs(gestureState.dy) > 50) {
      this.setState({
        panning: false,
        target: {
          x: gestureState.dx,
          y: gestureState.dy,
          opacity: 1 - Math.abs(gestureState.dy / height)
        }
      });
      this.close();
    } else {
      Animated.timing(this.pan, {
        toValue: 0,
        ...ANIM_CONFIG
      }).start(() => this.setState({ panning: false }));
    }
  };

  getFullscreenOpacity = () => {
    const { panning, target } = this.state;

    return {
      opacity: panning
        ? this.pan.interpolate({
            inputRange: [-height, 0, height],
            outputRange: [0, 1, 0]
          })
        : this.openAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, target.opacity]
          })
    };
  };
  captureCarouselItem = (ref, idx) => {
    this.carouselItems[idx] = ref;
  };
  handleModalShow = () => {
    const { animating, selectedImageHidden } = this.state;

    if (!selectedImageHidden && animating) {
      this.setState({ selectedImageHidden: true });
    }
  };
  getSwipeableStyle = () => {
    const { fullscreen, origin, slidesDown, target } = this.state;

    if (!fullscreen) {
      return { flex: 1 };
    }

    const inputRange = [0, 1];

    return !slidesDown
      ? {
          left: this.openAnim.interpolate({
            inputRange,
            outputRange: [origin.x, target.x]
          }),
          top: this.openAnim.interpolate({
            inputRange,
            outputRange: [origin.y, target.y]
          }),
          width: this.openAnim.interpolate({
            inputRange,
            outputRange: [origin.width, width]
          }),
          height: this.openAnim.interpolate({
            inputRange,
            outputRange: [origin.height, height]
          })
        }
      : {
          left: 0,
          right: 0,
          height,
          top: this.openAnim.interpolate({
            inputRange,
            outputRange: [height, target.y]
          })
        };
  };

  renderDefaultHeader = () => (
    <CloseContainer>
      <TouchableOpacity
        onPress={this.close}
        activeOpacity={0.9}
        hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CloseImage source={images.Close} />
      </TouchableOpacity>
    </CloseContainer>
  );

  renderFullscreenContent = url => () => {
    const { panning } = this.state;
    const containerStyle = [
      this.getSwipeableStyle(),
      panning && { top: this.pan }
    ];
    return (
      <Animated.View style={containerStyle} k>
        <ScrollView
          ref={ref => {
            if (ref) {
              ref.scrollResponderHandleStartShouldSetResponder = () => true;
            }
          }}
          contentContainerStyle={{ flex: 1 }}
          maximumZoomScale={2}
          alwaysBounceVertical={false}
        >
          <Image
            source={{ uri: url }}
            style={[{ flex: 1 }, { resizeMode: "contain" }]}
            {...this.panResponder.panHandlers}
          />
        </ScrollView>
      </Animated.View>
    );
  };
  renderFullscreen = () => {
    const { animating, panning, fullscreen } = this.state;
    const opacity = this.getFullscreenOpacity();
    const { uri } = this.props;
    return (
      <Modal
        transparent
        visible={fullscreen}
        onShow={this.handleModalShow}
        onRequestClose={this.close}
      >
        <Animated.View
          style={[
            {
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "black"
            },
            opacity
          ]}
        />
        <SwipeableViews
          disabled={animating || panning}
          index={this.state.index}
          onChangeIndex={index => {
            this.setState({
              index
            });
          }}
        >
          {this.renderFullscreenContent(uri)()}
        </SwipeableViews>
        <Animated.View
          style={[
            opacity,
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0
            }
          ]}
        >
          {this.renderDefaultHeader()}
        </Animated.View>
      </Modal>
    );
  };

  render() {
    const { fullscreen, selectedImageHidden, index } = this.state;
    const { uri, style } = this.props;
    const getOpacity = () => ({
      opacity: selectedImageHidden ? 0 : 1
    });
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={this.open(1)}
          style={{ zIndex: 10000 }}
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <View style={index + 1 === 1 ? getOpacity() : null}>
            <ImageCustom
              url={uri}
              style={[
                {
                  resizeMode: "cover",
                  height: "100%",
                  width: "100%"
                },
                style
              ]}
              ref={ref => this.captureCarouselItem(ref, index + 1)}
              index={index + 1}
            />
          </View>
        </TouchableOpacity>
        {fullscreen && this.renderFullscreen()}
      </>
    );
  }
}

const CloseContainer = styled.View`
  margin-top: ${getStatusBarHeight() + verticalScale(20) + `px`};
  margin-right: ${scale(20) + `px`};
  align-self: flex-end;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const CloseImage = styled.Image`
  width: ${scale(24) + `px`};
  height: ${scale(24) + `px`};
`;
