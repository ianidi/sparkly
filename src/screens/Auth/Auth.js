import React from "react";
import { inject, observer } from "mobx-react";
import {
  ScrollView,
  TouchableOpacity,
  Dimensions,
  BackHandler
} from "react-native";
//import TextInputMask from "react-native-text-input-mask";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { TextInputMask } from "react-native-masked-text";
import SafeAreaView from "react-native-safe-area-view";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import * as WebBrowser from "expo-web-browser";
import * as Progress from "react-native-progress";
import images from "../../constants/images";

const { width, height } = Dimensions.get("window");

@inject("main")
@inject("member")
@observer
export default class AuthScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputFocused: true,
      Phone: "+7 "
    };
  }

  componentDidMount = () => {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      return true;
    });
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  onChangePhoneInput = async PhoneMasked => {
    this.setState({
      Phone: PhoneMasked
    });

    this.props.member.set("PhoneMasked", PhoneMasked);

    let Phone = PhoneMasked.replace(/[^0-9]+/g, "");

    this.props.member.set("Phone", Phone);

    // Передать номер телефона на сервер и запросить sms
    if (Phone.length == 11) {
      this.props.member.RequestCode();
    }
  };

  renderTOS = () => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          WebBrowser.openBrowserAsync("https://sparkly.website/");
        }}
        hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
        style={{
          marginTop: verticalScale(60)
        }}
      >
        <TOS>
          регистрируясь, вы принимаете условия{" "}
          <TOSLink>пользовательского соглашения</TOSLink> и соглашаетесь на
          обработку <TOSLink>персональных данных</TOSLink>
        </TOS>
      </TouchableOpacity>
    );
  };

  renderPhone = () => {
    return (
      <>
        <Title>введи номер телефона</Title>

        {/*<TextInputMask
          refInput={ref => {
            this.input = ref;
          }}
          style={{
            fontSize: scale(32),
            fontFamily: "IBMPlexSerif-LightItalic",
            color: "#252E48",
            marginLeft: scale(40)
          }}
          onChangeText={(formatted, extracted) => {
            this.onChangePhoneInput(formatted, extracted);
          }}
          mask={"+7 [000] [000] [00] [00]"}
          onBlur={() => this.setState({ inputFocused: false })}
          onFocus={() => this.setState({ inputFocused: true })}
          autoCompleteType="off"
          autoCorrect={false}
          placeholder="+7"
          placeholderTextColor={"#252E48"}
          keyboardType={"number-pad"}
          autoFocus={true}
          allowFontScaling={false}
          textContentType={"telephoneNumber"}
          value={this.props.member.Phone}
        />*/}
        <TextInputMask
          ref={ref => (this.phoneField = ref)}
          style={{
            fontSize: scale(32),
            fontFamily: "IBMPlexSerif-LightItalic",
            color: "#252E48",
            marginLeft: scale(40)
          }}
          type={"custom"}
          options={{
            /**
             * mask: (String | required | default '')
             * the mask pattern
             * 9 - accept digit.
             * A - accept alpha.
             * S - accept alphanumeric.
             * * - accept all, EXCEPT white space.
             */
            mask: "+7 999 999 99 99"
          }}
          onBlur={() => this.setState({ inputFocused: false })}
          onFocus={() => this.setState({ inputFocused: true })}
          onChangeText={value => {
            this.onChangePhoneInput(value);
          }}
          //value={this.props.member.Phone}
          value={this.state.Phone}
          maxLength={18}
          autoCompleteType="off"
          autoCorrect={false}
          placeholder="+7"
          placeholderTextColor={"#252E48"}
          keyboardType={"number-pad"}
          textContentType={"telephoneNumber"}
          allowFontScaling={false}
          autoFocus={true}
        />
        <InputUnderline
          style={{
            opacity: this.state.inputFocused ? 1 : 0.7
          }}
        />

        {this.renderTOS()}
      </>
    );
  };

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#fff",
          width: width,
          paddingRight: scale(16)
        }}
      >
        {this.props.member.loading && (
          <Progress.Circle
            size={30}
            indeterminate={true}
            color="#525A71"
            borderWidth={2}
            style={{
              position: "absolute",
              top: getStatusBarHeight() + verticalScale(10),
              right: scale(20)
            }}
          />
        )}
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={"handled"}
        >
          {this.renderPhone()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const Title = styled.Text`
  font-size: ${scale(46) + `px`};
  line-height: ${scale(46) + `px`};
  margin-top: ${verticalScale(65) + `px`};
  margin-bottom: ${verticalScale(40) + `px`};
  margin-left: ${scale(40) + `px`};
  font-family: "Cormorant-Regular";
  color: #525a71;
`;

const InputUnderline = styled.View`
  margin-top: ${verticalScale(10) + `px`};
  margin-left: ${scale(40) + `px`};
  width: 100%;
  height: ${verticalScale(2) + `px`};
  background: #9499a7;
`;

const TOS = styled.Text`
  width: ${scale(240) + `px`};
  font-size: ${scale(12) + `px`};
  line-height: ${scale(16) + `px`};
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
