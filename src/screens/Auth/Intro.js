import React from "react";
import { inject, observer } from "mobx-react";
import {
  ScrollView,
  TouchableOpacity,
  Dimensions,
  BackHandler
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import images from "../../constants/images";

const { width, height } = Dimensions.get("window");

@inject("main")
@inject("member")
@observer
export default class IntroScreen extends React.Component {
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

  complete = () => {
    this.props.navigation.navigate("University");
  };

  renderIntro = () => {
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
        <Title>добро пожаловать, {this.props.member.Name}!</Title>

        <Description>
          sparkly поможет тебе найти твоего человека, просто хорошего друга,
          любовь или напарника для рисования, утренних пробежек, совместных
          походов в кино и многого другого...
        </Description>
        <TouchableOpacity
          onPress={this.complete}
          activeOpacity={0.9}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          style={{
            marginTop: verticalScale(36),
            marginBottom: verticalScale(20)
          }}
        >
          <Button>
            <ButtonText>выбрать университет</ButtonText>
            <ButtonCircle
              style={{
                backgroundColor: "#F5CFD0"
              }}
            />
          </Button>
        </TouchableOpacity>
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
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderIntro()}
        </ScrollView>
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
  margin-left: ${scale(40) + `px`};
  font-family: "Cormorant-Regular";
  color: #525a71;
`;

const Description = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(24) + `px`};
  margin-top: ${verticalScale(10) + `px`};
  margin-bottom: ${verticalScale(10) + `px`};
  margin-left: ${scale(40) + `px`};
  font-family: "IBMPlexSans-Light";
  color: #252e48;
`;

const Button = styled.View`
  width: ${width - scale(32) + `px`};
  padding-top: ${scale(25) + `px`};
  padding-bottom: ${scale(25) + `px`};
  margin-left: ${scale(16) + `px`};
  margin-right: ${scale(16) + `px`};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: ${scale(1) + `px solid #525A71`};
`;

const ButtonText = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(16) + `px`};
  font-family: "IBMPlexMono";
  color: #3b435a;
`;

const ButtonCircle = styled.View`
  position: absolute;
  z-index: -1;
  width: ${scale(50) + `px`};
  height: ${scale(50) + `px`};
  border-radius: 100px;
`;
