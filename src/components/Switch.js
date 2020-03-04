import React from "react";
import { View, TouchableOpacity, Animated } from "react-native";
import { scale } from "react-native-size-matters";

export default class Switch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value,
      offsetOff: 0,
      offsetOn: 0,
      translateX: new Animated.Value(0)
    };
  }

  initialSlide = offset => {
    let { translateX } = this.state;

    Animated.timing(translateX, {
      toValue: offset,
      duration: 1
    }).start();
  };

  toggle = () => {
    let { value, translateX, offsetOff, offsetOn } = this.state;

    let offset = offsetOn;

    if (value) {
      offset = offsetOff;
    }

    this.setState({ value: !value });
    this.props.onChange(!value);

    Animated.spring(translateX, {
      toValue: offset,
      duration: 100
    }).start();
  };

  render() {
    let { translateX } = this.state;

    const color = translateX.interpolate({
      inputRange: [1, 30],
      outputRange: ["rgb(255, 255, 255)", this.props.colorActive]
    });

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{
          width: scale(70)
        }}
        onPress={this.toggle}
      >
        <View
          style={{
            flexDirection: "row",
            position: "relative",
            backgroundColor: "#F2F2F2",
            padding: scale(2),
            borderRadius: 100,
            borderWidth: scale(1),
            borderColor: "#D9D9D9"
          }}
        >
          <Animated.View
            style={{
              position: "absolute",
              width: scale(36),
              height: scale(36),
              top: scale(2),
              left: scale(2),
              boxShadow: "0px 1px 8px rgba(0, 0, 0, 0.12)",
              borderRadius: 100,
              borderWidth: scale(1),
              borderColor: "#D9D9D9",
              backgroundColor: color,
              transform: [
                {
                  translateX
                }
              ]
            }}
          />

          <View
            style={{
              width: scale(33),
              height: scale(36)
            }}
            onLayout={event => {
              let offset = event.nativeEvent.layout.x - scale(2);
              this.setState({
                offsetOff: offset
              });
              if (this.props.value == false) {
                this.initialSlide(offset);
              }
            }}
          />

          <View
            style={{
              width: scale(33),
              height: scale(36)
            }}
            onLayout={event => {
              let offset = event.nativeEvent.layout.x - scale(8);
              this.setState({
                offsetOn: offset
              });
              if (this.props.value == true) {
                this.initialSlide(offset);
              }
            }}
          />
        </View>
      </TouchableOpacity>
    );
  }
}
