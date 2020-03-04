import React from "react";
import { inject, observer } from "mobx-react";
import {
  ScrollView,
  TextInput,
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
export default class FacultyScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputFocused: true
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

  onChangeFacultyInput = Faculty => {
    this.props.member.set("Faculty", Faculty);
    this.props.member.set("Synchronized", false);
  };

  continue = () => {
    this.props.member.FacultySelect();
  };

  inputBlur = () => {
    this.setState(
      { inputFocused: false },
      this.scrollView.scrollTo({ x: 0, y: 0, animated: true })
    );
  };

  renderFaculty = () => {
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
        <Subtitle>
          найди друзей в{" "}
          <SubtitleCite>{this.props.member.UniversityTitle}</SubtitleCite>
        </Subtitle>
        {this.props.member.SignupComplete ? (
          <Title>изменить факультет</Title>
        ) : (
          <Title>а какой{"\n"}факультет?</Title>
        )}

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
          value={this.props.member.Faculty}
          onChangeText={Faculty => {
            this.onChangeFacultyInput(Faculty);
          }}
          onBlur={this.inputBlur}
          onFocus={() => this.setState({ inputFocused: true })}
          autoCompleteType="off"
          autoCorrect={false}
          autoFocus={true}
          allowFontScaling={false}
        />
        <InputUnderline
          style={{ opacity: this.state.inputFocused ? 1 : 0.7 }}
        />
        <Caption>
          эту информацию будут видеть только люди из твоего университета
        </Caption>
        {this.props.member.Faculty.length == 0 && (
          <TouchableOpacity
            onPress={this.continue}
            activeOpacity={0.9}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            {this.props.member.SignupComplete ? (
              <Skip>не указывать факультет</Skip>
            ) : (
              <Skip>пропустить</Skip>
            )}
          </TouchableOpacity>
        )}
        {this.props.member.Faculty.length > 2 && (
          <TouchableOpacity
            onPress={this.continue}
            activeOpacity={0.9}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            style={{
              marginTop: verticalScale(40),
              marginBottom: verticalScale(20)
            }}
          >
            <Button>
              {this.props.member.SignupComplete ? (
                <ButtonText>сохранить</ButtonText>
              ) : (
                <ButtonText>зарегистрироваться</ButtonText>
              )}
              <ButtonCircle
                style={{
                  backgroundColor: "#F5CFD0"
                }}
              />
            </Button>
          </TouchableOpacity>
        )}
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
        <ScrollView
          ref={ref => {
            this.scrollView = ref;
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={"handled"}
          contentContainerStyle={{
            minHeight:
              this.props.member.Faculty.length > 2 && this.state.inputFocused
                ? height + verticalScale(40)
                : height + verticalScale(40)
          }}
        >
          {this.renderFaculty()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const ArrowBack = styled.Image`
  width: ${scale(24) + `px`};
  height: ${scale(24) + `px`};
`;

const Subtitle = styled.Text`
  font-size: ${scale(12) + `px`};
  line-height: ${scale(12) + `px`};
  margin-top: ${verticalScale(60) + `px`};
  margin-bottom: ${verticalScale(10) + `px`};
  margin-left: ${scale(40) + `px`};
  font-family: "IBMPlexSerif-BoldItalic";
  color: #6e7588;
`;

const SubtitleCite = styled.Text`
  font-size: ${scale(12) + `px`};
  line-height: ${scale(12) + `px`};
  font-family: "IBMPlexSerif-BoldItalic";
  color: #bc7071;
`;

const Title = styled.Text`
  font-size: ${scale(46) + `px`};
  line-height: ${scale(46) + `px`};
  margin-bottom: ${verticalScale(20) + `px`};
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

const Caption = styled.Text`
  width: ${scale(280) + `px`};
  font-size: ${scale(12) + `px`};
  line-height: ${scale(16) + `px`};
  margin-top: ${verticalScale(10) + `px`};
  margin-bottom: ${verticalScale(10) + `px`};
  margin-left: ${scale(40) + `px`};
  font-family: "IBMPlexMono";
  color: #6e7588;
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

const Skip = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(24) + `px`};
  margin-top: ${verticalScale(10) + `px`};
  margin-bottom: ${verticalScale(20) + `px`};
  margin-left: ${scale(40) + `px`};
  font-family: "IBMPlexMono";
  color: #525a71;
`;
