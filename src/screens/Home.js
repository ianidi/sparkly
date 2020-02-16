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
import images from "../constants/images";

const { width, height } = Dimensions.get("screen");

@inject("main")
@inject("feed")
@inject("auth")
@observer
export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Notifications: false
    };
  }

  componentDidMount = () => {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.arrowBackPress();
      return true;
    });
  };

  feedInit = () => {
    this.props.feed.init();
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  arrowBackPress = () => {
    this.props.navigation.goBack();
  };

  renderHome = () => {
    return (
      <>
        <TopContainer>
          <TopStartContainer>
            <UserCircle>
              <UserImage source={images.User} />
            </UserCircle>
            <TitleContainer>
              <Title>{this.props.auth.Name}</Title>
              <Caption>{this.props.auth.UniversityAbbr}</Caption>
            </TitleContainer>
          </TopStartContainer>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Settings")}
            activeOpacity={0.9}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <SettingsCircle>
              <SettingsImage source={images.Settings} />
            </SettingsCircle>
          </TouchableOpacity>
        </TopContainer>

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Profile")}
          activeOpacity={0.9}
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <ButtonProfile>
            <ButtonProfileText>настроить свой профиль</ButtonProfileText>
          </ButtonProfile>
        </TouchableOpacity>
        <Delimiter />

        <CardContainer>
          <CardMy>
            <CardMyImage source={images.My} />
            <CardMyText>моя анкета</CardMyText>
          </CardMy>
          <CardSmallContainer>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Camera")}
              activeOpacity={0.9}
            >
              <CardSmall>
                <CameraImage source={images.Camera} />
                <CardSmallText>отснять{"\n"}новое фото</CardSmallText>
              </CardSmall>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Messages")}
              activeOpacity={0.9}
            >
              <CardSmall>
                <MessageImage source={images.Message} />
                <CardSmallText>посмотреть{"\n"}сообщения</CardSmallText>
              </CardSmall>
            </TouchableOpacity>
          </CardSmallContainer>
        </CardContainer>

        <TouchableOpacity
          onPress={this.feedInit}
          activeOpacity={0.9}
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <ButtonContainer>
            <Button>
              <ButtonCircle
                style={{
                  backgroundColor: "#F5CFD0"
                }}
              />
              <ButtonText>смотреть ленту</ButtonText>
            </Button>
          </ButtonContainer>
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
          width: width
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderHome()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const TopContainer = styled.View`
  margin-top: ${verticalScale(20) + `px`};
  margin-bottom: ${verticalScale(16) + `px`};
  margin-left: ${scale(20) + `px`};
  margin-right: ${scale(20) + `px`};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const UserCircle = styled.View`
  width: ${scale(40) + `px`};
  height: ${scale(40) + `px`};
  margin-right: ${scale(10) + `px`};
  border-radius: 50px;
  background: #f0f0f0;
  align-items: center;
  justify-content: center;
`;

const UserImage = styled.Image`
  width: ${scale(24) + `px`};
  height: ${scale(24) + `px`};
`;

const TopStartContainer = styled.View`
  flex-direction: row;
  justify-content: center;
`;

const TitleContainer = styled.View`
  justify-content: center;
`;

const Title = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(18) + `px`};
  font-family: "IBMPlexSans-Medium";
  color: #3b435a;
`;

const Caption = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(18) + `px`};
  font-family: "IBMPlexSans-Light";
  color: #525a71;
`;

const SettingsCircle = styled.View`
  width: ${scale(40) + `px`};
  height: ${scale(40) + `px`};
  margin-left: ${scale(10) + `px`};
  border-radius: 18px;
  background: #f7f7f7;
  align-items: center;
  justify-content: center;
`;

const SettingsImage = styled.Image`
  width: ${scale(20) + `px`};
  height: ${scale(20) + `px`};
`;

const ButtonProfile = styled.View`
  width: ${width - scale(30) + `px`};
  padding-top: ${scale(16) + `px`};
  padding-bottom: ${scale(16) + `px`};
  margin-left: ${scale(15) + `px`};
  margin-right: ${scale(15) + `px`};
  border-radius: 14px;
  background: #fafafa;
  border: 1px solid #ebebeb;
  align-items: center;
  justify-content: center;
`;

const ButtonProfileText = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(16) + `px`};
  font-family: "IBMPlexMono";
  color: #3b435a;
`;

const Delimiter = styled.View`
  width: ${width + `px`};
  height: ${verticalScale(1) + `px`};
  margin-top: ${verticalScale(22) + `px`};
  margin-bottom: ${verticalScale(22) + `px`};
  background: #f2f2f2;
`;

const CardContainer = styled.View`
  margin-left: ${scale(15) + `px`};
  margin-right: ${scale(15) + `px`};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const CardMy = styled.View`
  width: ${(width - scale(39)) / 2 + `px`};
  height: ${verticalScale(300) + `px`};
  padding-top: ${scale(15) + `px`};
  padding-left: ${scale(15) + `px`};
  padding-right: ${scale(15) + `px`};
  padding-bottom: ${scale(25) + `px`};
  border-radius: 10px;
  background: #fafafa;
  justify-content: flex-end;
  overflow: hidden;
`;

const CardMyImage = styled.Image`
  width: ${(width - scale(39)) / 2 + `px`};
  height: ${verticalScale(300) + `px`};
  position: absolute;
  top: 0;
  left: 0;
`;

const CardMyText = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(20) + `px`};
  font-family: "IBMPlexMono";
  color: #fff;
`;

const CardSmallContainer = styled.View`
  height: ${verticalScale(300) + `px`};
  align-items: center;
  justify-content: space-between;
`;

const CardSmall = styled.View`
  width: ${(width - scale(39)) / 2 + `px`};
  height: ${verticalScale(145) + `px`};
  padding-top: ${scale(20) + `px`};
  padding-left: ${scale(15) + `px`};
  padding-right: ${scale(20) + `px`};
  padding-bottom: ${scale(25) + `px`};
  border-radius: 10px;
  background: #fafafa;
  border: 1px solid #ebebeb;
  justify-content: space-between;
`;

const CameraImage = styled.Image`
  width: ${scale(25) + `px`};
  height: ${scale(17) + `px`};
`;

const MessageImage = styled.Image`
  width: ${scale(22) + `px`};
  height: ${scale(18) + `px`};
`;

const CardSmallText = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(20) + `px`};
  font-family: "IBMPlexMono";
  color: #3b435a;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

//align-self: center;
const Button = styled.View`
  margin-top: ${verticalScale(50) + `px`};
  margin-bottom: ${verticalScale(20) + `px`};
  padding-top: ${verticalScale(8) + `px`};
  padding-bottom: ${verticalScale(8) + `px`};
  padding-left: ${verticalScale(12) + `px`};
  padding-right: ${verticalScale(12) + `px`};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: ${scale(1) + `px solid #E6E6E6`};
  border-radius: 10px;
`;

const ButtonText = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(16) + `px`};
  font-family: "IBMPlexMono";
  color: #3b435a;
`;

const ButtonCircle = styled.View`
  width: ${scale(30) + `px`};
  height: ${scale(30) + `px`};
  margin-right: ${scale(6) + `px`};
  border-radius: 100px;
`;
