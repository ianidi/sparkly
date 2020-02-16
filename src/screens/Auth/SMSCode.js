import React, { createRef } from "react";
import { inject, observer } from "mobx-react";
import {
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  BackHandler
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import images from "../../constants/images";
import * as WebBrowser from "expo-web-browser";
const pluralize = require("numeralize-ru").pluralize;
const timer = require("react-native-timer");

import CodeInput from "react-native-confirmation-code-field";

const { width, height } = Dimensions.get("screen");

@inject("main")
@inject("auth")
@observer
export default class AuthSMSCodeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      countdown: 10
    };
  }

  componentDidMount = () => {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.arrowBackPress();
      return true;
    });

    this.removeFocus = this.props.navigation.addListener("focus", () => {
      this.startCountdown();
    });
    this.removeBlur = this.props.navigation.addListener("blur", () => {
      this.clearCountdown();
    });
  };

  componentWillUnmount() {
    this.backHandler.remove();
    this.removeFocus();
    this.removeBlur();
  }

  arrowBackPress = () => {
    //Clear mobx phone
    this.props.auth.set("Phone", "+7");
    this.props.navigation.goBack();
  };

  startCountdown = () => {
    this.setState({ countdown: 60 }, () => {
      timer.setInterval(this, "resendCode", this.updateCountdown, 1000);
    });
  };

  clearCountdown = () => {
    timer.clearInterval(this);
  };

  updateCountdown = () => {
    countdown = this.state.countdown - 1;

    if (countdown <= 0) {
      this.clearCountdown();
    }

    this.setState({ countdown: countdown });
  };

  /* SMS Code */
  codeInput = createRef();

  handlerOnFulfill = Code => {
    this.props.auth.Auth(Code);

    this.clearCode();
  };

  clearCode() {
    const { current } = this.codeInput;

    if (current) {
      current.clear();
    }
  }

  pasteCode() {
    const { current } = this.codeInput;

    if (current) {
      current.handlerOnTextChange(value);
    }
  }

  resendCode = () => {
    this.startCountdown();
  };

  /* SMS Code */

  renderTOS = () => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          WebBrowser.openBrowserAsync("https://sparkly.website/");
        }}
      >
        <TOS>
          регистрируясь, вы принимаете условия{" "}
          <TOSLink>пользовательского соглашения</TOSLink> и соглашаетесь на
          обработку <TOSLink>персональных данных</TOSLink>
        </TOS>
      </TouchableWithoutFeedback>
    );
  };

  cellProps = ({ /*index, isFocused,*/ hasValue }) => {
    styles = {
      borderBottomColor: "#9499A7",
      borderBottomWidth: verticalScale(4),
      height: verticalScale(60),
      width: scale(40),
      fontSize: scale(32),
      fontFamily: "IBMPlexSerif-LightItalic",
      color: "#252E48"
    };

    if (hasValue) {
      return {
        style: [
          styles,
          {
            borderBottomColor: "#F0F0F0"
          }
        ]
      };
    }
    return {
      style: styles
    };
  };

  containerProps = {
    style: {
      height: verticalScale(70),
      marginLeft: scale(40)
    }
  };

  renderCode = () => {
    let { countdown } = this.state;

    return (
      <>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={this.arrowBackPress}
          style={{
            position: "absolute",
            top: verticalScale(23),
            left: scale(19)
          }}
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <ArrowBack source={images.AuthArrowBack} />
        </TouchableOpacity>
        <Title>введи код{"\n"}из смс</Title>

        <CodeInput
          ref={this.codeInput}
          autoFocus={true}
          blurOnSubmit={false}
          variant="clear"
          codeLength={4}
          keyboardType="numeric"
          cellProps={this.cellProps}
          containerProps={this.containerProps}
          inputPosition={"left"}
          onFulfill={this.handlerOnFulfill}
        />
        <Code>
          отправили код{"\n"}на номер {this.props.auth.PhoneMasked}
        </Code>
        {countdown > 0 && (
          <Code>
            повторный код через {countdown}{" "}
            {pluralize(countdown, "секунду", "секунды", "секунд")}
          </Code>
        )}
        {countdown <= 0 && (
          <TouchableOpacity
            onPress={this.resendCode}
            activeOpacity={0.9}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CodeResend>отправить код повторно</CodeResend>
          </TouchableOpacity>
        )}
        {this.renderTOS()}
      </>
    );
  };

  render() {
    return (
      <>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "#fff",
            width: width,
            paddingRight: scale(16)
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={"handled"}
          >
            {this.renderCode()}
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const ArrowBack = styled.Image`
  width: ${scale(24) + `px`};
  height: ${scale(24) + `px`};
`;

const Title = styled.Text`
  font-size: ${scale(46) + `px`};
  line-height: ${scale(46) + `px`};
  margin-top: ${verticalScale(65) + `px`};
  margin-bottom: ${verticalScale(40) + `px`};
  margin-left: ${scale(40) + `px`};
  font-family: "Cormorant-Regular";
  color: #525a71;
`;

const TOS = styled.Text`
  width: ${scale(220) + `px`};
  font-size: ${scale(12) + `px`};
  line-height: ${scale(16) + `px`};
  margin-top: ${verticalScale(60) + `px`};
  margin-bottom: ${verticalScale(10) + `px`};
  margin-left: ${scale(40) + `px`};
  font-family: "IBMPlexMono";
  color: #9499a7;
`;

const TOSLink = styled.Text`
  font-size: ${scale(12) + `px`};
  line-height: ${scale(16) + `px`};
  font-family: "IBMPlexMono";
  color: #525a71;
`;

const Code = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(24) + `px`};
  margin-top: ${verticalScale(10) + `px`};
  margin-bottom: ${verticalScale(20) + `px`};
  margin-left: ${scale(40) + `px`};
  font-family: "IBMPlexSans-Light";
  color: #3b435a;
`;

const CodeResend = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(24) + `px`};
  margin-top: ${verticalScale(10) + `px`};
  margin-bottom: ${verticalScale(20) + `px`};
  margin-left: ${scale(40) + `px`};
  font-family: "IBMPlexMono";
  color: #525a71;
`;
