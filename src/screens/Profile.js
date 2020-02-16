import React from "react";
import { inject, observer } from "mobx-react";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  BackHandler
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import { debounce } from "lodash";
import images from "../constants/images";
import { api } from "../service/Api";

const { width, height } = Dimensions.get("screen");

@inject("main")
@inject("auth")
@observer
export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputFocused: true,
      loading: false
    };
  }

  componentDidMount = () => {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.arrowBackPress();
      return true;
    });
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  arrowBackPress = () => {
    this.props.navigation.goBack();
  };

  inputBlur = () => {
    this.setState({ inputFocused: false });
  };

  renderProfile = () => {
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
        <Title>мой профиль</Title>

        <TextInput
          refInput={ref => {
            this.input = ref;
          }}
          style={{
            fontSize: scale(20),
            fontFamily: "IBMPlexSans-Light",
            color: "#252E48",
            marginLeft: scale(40)
          }}
          value={this.props.auth.Name}
          onChangeText={Name => {
            //this.onChangeNameInput(Name);
          }}
          onBlur={this.inputBlur}
          onFocus={() => this.setState({ inputFocused: true })}
          autoCompleteType="off"
          autoCorrect={false}
          editable={false}
          allowFontScaling={false}
          textContentType={"name"}
        />
        <InputUnderline
          style={{ opacity: this.state.inputFocused ? 1 : 0.7 }}
        />
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
        {this.renderProfile()}
      </SafeAreaView>
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

const InputUnderline = styled.View`
  margin-top: ${verticalScale(10) + `px`};
  margin-left: ${scale(40) + `px`};
  width: ${width - scale(40) + `px`};
  height: ${verticalScale(2) + `px`};
  background: #9499a7;
`;
