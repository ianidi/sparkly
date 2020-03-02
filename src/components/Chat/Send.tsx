import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  ViewPropTypes,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from "react-native";
import Color from "./Color";
import images from "../../constants/images";
import { scale } from "react-native-size-matters";

const styles = StyleSheet.create({
  container: {
    borderWidth: scale(1),
    borderColor: "#525A71",
    width: scale(40),
    height: scale(40),
    marginLeft: scale(10),
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    color: Color.defaultBlue,
    fontWeight: "600",
    fontSize: 17,
    backgroundColor: Color.backgroundTransparent,
    marginBottom: 12,
    marginLeft: 10,
    marginRight: 10
  }
});

export interface SendProps {
  text?: string;
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  alwaysShowSend?: boolean;
  disabled?: boolean;
  sendButtonProps?: Partial<TouchableOpacityProps>;
  onSend?({ text }: { text: string }, b: boolean): void;
}

export default class Send extends Component<SendProps> {
  static defaultProps = {
    text: "",
    onSend: () => {},
    label: "Send",
    containerStyle: {},
    textStyle: {},
    children: null,
    alwaysShowSend: false,
    disabled: false,
    sendButtonProps: null
  };

  static propTypes = {
    text: PropTypes.string,
    onSend: PropTypes.func,
    label: PropTypes.string,
    containerStyle: ViewPropTypes.style,
    textStyle: PropTypes.any,
    children: PropTypes.element,
    alwaysShowSend: PropTypes.bool,
    disabled: PropTypes.bool,
    sendButtonProps: PropTypes.object
  };

  render() {
    const {
      text,
      containerStyle,
      onSend,
      children,
      textStyle,
      label,
      alwaysShowSend,
      disabled,
      sendButtonProps
    } = this.props;
    return (
      <TouchableOpacity
        testID="send"
        accessible
        accessibilityLabel="send"
        activeOpacity={0.9}
        style={[
          styles.container,
          containerStyle,
          {
            backgroundColor:
              text && text.trim().length > 0 ? "#F5CFD0" : "white"
          }
        ]}
        onPress={() => {
          if (text && onSend) {
            onSend({ text: text.trim() }, true);
          }
        }}
        accessibilityTraits="button"
        disabled={disabled}
        {...sendButtonProps}
      >
        {children || (
          <Image
            style={{ width: scale(20), height: scale(20) }}
            source={images.ChatSend}
          />
        )}
      </TouchableOpacity>
    );
  }
}
