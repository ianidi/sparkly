import PropTypes from "prop-types";
import React from "react";
import {
  View,
  Dimensions,
  Platform,
  StyleSheet,
  TextInput,
  TextInputProps
} from "react-native";
import { MIN_COMPOSER_HEIGHT, DEFAULT_PLACEHOLDER } from "./Constant";
import Color from "./Color";
import { scale, verticalScale } from "react-native-size-matters";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: scale(1),
    borderColor: "#525A71",
    backgroundColor: Color.white,
    paddingLeft: scale(15),
    paddingRight: scale(15),
    paddingTop: verticalScale(6),
    paddingBottom: verticalScale(8),
    minHeight: scale(40)
  },
  textInput: {
    fontSize: scale(15),
    fontFamily: "IBMPlexSans",
    lineHeight: scale(15),
    backgroundColor: Color.white
  }
});

export interface ComposerProps {
  composerHeight?: number;
  text?: string;
  placeholder?: string;
  placeholderTextColor?: string;
  textInputProps?: Partial<TextInputProps>;
  textInputStyle?: TextInputProps["style"];
  textInputAutoFocus?: boolean;
  keyboardAppearance?: TextInputProps["keyboardAppearance"];
  multiline?: boolean;
  disableComposer?: boolean;
  onTextChanged?(text: string): void;
  onInputSizeChanged?(contentSize: { width: number; height: number }): void;
}

export default class Composer extends React.Component<ComposerProps> {
  static defaultProps = {
    composerHeight: MIN_COMPOSER_HEIGHT,
    text: "",
    placeholderTextColor: Color.defaultColor,
    placeholder: DEFAULT_PLACEHOLDER,
    textInputProps: null,
    multiline: true,
    disableComposer: false,
    textInputStyle: {},
    textInputAutoFocus: false,
    keyboardAppearance: "default",
    onTextChanged: () => {},
    onInputSizeChanged: () => {}
  };

  static propTypes = {
    composerHeight: PropTypes.number,
    text: PropTypes.string,
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    textInputProps: PropTypes.object,
    onTextChanged: PropTypes.func,
    onInputSizeChanged: PropTypes.func,
    multiline: PropTypes.bool,
    disableComposer: PropTypes.bool,
    textInputStyle: PropTypes.any,
    textInputAutoFocus: PropTypes.bool,
    keyboardAppearance: PropTypes.string
  };

  contentSize?: { width: number; height: number } = undefined;

  onContentSizeChange = (e: any) => {
    const { contentSize } = e.nativeEvent;

    // Support earlier versions of React Native on Android.
    if (!contentSize) {
      return;
    }

    if (
      !this.contentSize ||
      (this.contentSize &&
        (this.contentSize.width !== contentSize.width ||
          this.contentSize.height !== contentSize.height))
    ) {
      this.contentSize = contentSize;
      this.contentSize.height += verticalScale(9);
      this.props.onInputSizeChanged!(this.contentSize!);
    }
  };

  onChangeText = (text: string) => {
    this.props.onTextChanged!(text);
  };

  render() {
    return (
      <View
        style={[
          styles.container
          //this.props.textInputStyle,
          //{
          //  height: this.props.composerHeight
          //}
        ]}
      >
        <TextInput
          testID={this.props.placeholder}
          accessible
          accessibilityLabel={this.props.placeholder}
          placeholder={this.props.placeholder}
          placeholderTextColor={this.props.placeholderTextColor}
          multiline={this.props.multiline}
          editable={!this.props.disableComposer}
          onChange={this.onContentSizeChange}
          onContentSizeChange={this.onContentSizeChange}
          onChangeText={this.onChangeText}
          style={[
            styles.textInput
            //this.props.textInputStyle
            //{
            //  height: this.props.composerHeight
            //}
          ]}
          autoFocus={this.props.textInputAutoFocus}
          value={this.props.text}
          enablesReturnKeyAutomatically
          underlineColorAndroid="transparent"
          keyboardAppearance={this.props.keyboardAppearance}
          {...this.props.textInputProps}
        />
      </View>
    );
  }
}
