import React from "react";
import { inject, observer } from "mobx-react";
import { TouchableOpacity, Dimensions, BackHandler } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import images from "../constants/images";

const { width, height } = Dimensions.get("screen");

@inject("main")
@inject("auth")
@observer
export default class MessagesScreen extends React.Component {
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

  signOut = () => {
    this.props.auth.clear();
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
        <Title>сообщения</Title>
        <Temporary>нет новых сообщений</Temporary>
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

const Temporary = styled.Text`
  font-size: ${scale(20) + `px`};
  line-height: ${scale(20) + `px`};
  margin-top: ${verticalScale(20) + `px`};
  margin-bottom: ${verticalScale(20) + `px`};
  margin-left: ${scale(40) + `px`};
  font-family: "Cormorant-Regular";
  color: #525a71;
`;
