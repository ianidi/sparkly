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
import FeedCircles from "../components/FeedCircles";
import Avatar from "../components/Avatar";

const { width, height } = Dimensions.get("window");

@inject("main")
@inject("feed")
@inject("member")
@observer
export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Notifications: false,
      popupFeed: false,
      popupCamera: false
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

  popupFeedOpen = () => {
    this.setState({ popupFeed: true, popupCamera: false });
  };

  popupFeedClose = () => {
    this.setState({ popupFeed: false, popupCamera: false });
  };

  popupCameraOpen = () => {
    this.setState({ popupCamera: true, popupFeed: false });
  };

  popupCameraClose = () => {
    this.setState({ popupCamera: false, popupFeed: false });
  };

  navigateCamera = () => {
    if (this.state.popupCamera) {
      this.popupCameraClose();
      return;
    }
    if (this.state.popupFeed) {
      this.popupFeedClose();
      return;
    }
    this.props.navigation.navigate("Camera");
  };

  navigateFeedMy = () => {
    if (this.state.popupCamera) {
      this.popupCameraClose();
      return;
    }
    if (this.state.popupFeed) {
      this.popupFeedClose();
      return;
    }
    this.props.navigation.navigate("FeedMy");
  };

  renderHome = () => {
    return (
      <>
        <TopContainer>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Profile")}
            activeOpacity={0.9}
          >
            <TopStartContainer>
              <Avatar my={true} />
              <TitleContainer>
                <Title>{this.props.member.Name}</Title>
                <Caption>
                  {this.props.member.UniversityAbbr.toLowerCase()}
                </Caption>
              </TitleContainer>
            </TopStartContainer>
          </TouchableOpacity>
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
          {this.props.member.MemberFeedURI != null ? (
            <TouchableOpacity onPress={this.navigateFeedMy} activeOpacity={0.9}>
              <CardMy>
                <CardImages>
                  <CardCircles>
                    <CardCircle
                      style={{
                        backgroundColor: this.props.member
                          .MemberFeedRestrictUniversity
                          ? "#525A71"
                          : "#fff",
                        borderWidth: scale(1),
                        borderColor: this.props.member
                          .MemberFeedRestrictUniversity
                          ? "#525A71"
                          : "#D9D9D9"
                      }}
                    />
                  </CardCircles>

                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={this.popupFeedOpen}
                  >
                    <CardInfo
                      source={images.InfoWhite}
                      style={{ marginRight: scale(10) }}
                    />
                  </TouchableOpacity>
                </CardImages>

                <CardMyImageContainer>
                  <CardMyImage
                    source={{ uri: this.props.member.MemberFeedURI }}
                  />
                </CardMyImageContainer>
                <CardMyText>моя анкета</CardMyText>
              </CardMy>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={this.navigateCamera} activeOpacity={0.9}>
              <CardMy
                style={{
                  borderWidth: scale(1),
                  borderColor: "#ebebeb"
                }}
              >
                <CardImages>
                  <CardCircles>
                    <CardCircle
                      style={{
                        backgroundColor: "#E6E6E6"
                      }}
                    />
                  </CardCircles>

                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={this.popupFeedOpen}
                  >
                    <CardInfo
                      source={images.Info}
                      style={{ marginRight: scale(10) }}
                    />
                  </TouchableOpacity>
                </CardImages>

                <CardMyText style={{ color: "#3B435A" }}>
                  здесь будет ваша анкета, сделайте фото
                </CardMyText>
              </CardMy>
            </TouchableOpacity>
          )}

          <CardSmallContainer>
            <TouchableOpacity
              onPress={this.navigateCamera}
              activeOpacity={0.9}
              style={{ zIndex: 1000 }}
            >
              <CardSmall>
                <CardImages>
                  <CameraImage source={images.Camera} />
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={this.popupCameraOpen}
                  >
                    <CardInfo source={images.Info} />
                  </TouchableOpacity>
                  {this.state.popupCamera && (
                    <PopupContainer
                      style={{
                        right: -10
                      }}
                    >
                      <TouchableOpacity
                        activeOpacity={0.9}
                        style={{
                          position: "absolute",
                          top: scale(10),
                          right: scale(10),
                          zIndex: 1000
                        }}
                        onPress={this.popupCameraClose}
                        hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
                      >
                        <PopupClose source={images.PopupClose} />
                      </TouchableOpacity>
                      <PopupText>
                        Здесь вы можете загрузить свою фотографию в ленту, чтобы
                        затем найти новых друзей для общения
                      </PopupText>
                    </PopupContainer>
                  )}

                  {this.state.popupFeed && (
                    <PopupContainer
                      style={{
                        right: -10
                      }}
                    >
                      <TouchableOpacity
                        activeOpacity={0.9}
                        style={{
                          position: "absolute",
                          top: scale(10),
                          right: scale(10),
                          zIndex: 1000
                        }}
                        onPress={this.popupFeedClose}
                        hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
                      >
                        <PopupClose source={images.PopupClose} />
                      </TouchableOpacity>
                      <PopupText>
                        В ленте можешь поделиться фотографиями как ты
                        занимаешься спортом, гуляешь, проводишь свободное время.
                        Поделись своим хобби и не забудь, что на фотографии
                        должен быть только ты.
                      </PopupText>
                    </PopupContainer>
                  )}
                </CardImages>
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
          style={{
            marginTop: verticalScale(50),
            marginBottom: verticalScale(20)
          }}
        >
          <ButtonContainer>
            <Button>
              <FeedCircles />
              <ButtonText>смотреть анкеты</ButtonText>
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

const PopupContainer = styled.View`
  position: absolute;
  z-index: 3000;
  max-width: ${width * 0.84 + `px`};
  top: ${scale(30) + `px`};
  padding-top: ${verticalScale(15) + `px`};
  padding-bottom: ${verticalScale(15) + `px`};
  padding-left: ${scale(15) + `px`};
  padding-right: ${scale(27) + `px`};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
  elevation: 2;
  border-radius: 10px;
  background: #f2f2f2;
  border: 1px solid #9499a7;
`;

const PopupText = styled.Text`
  flex: 1;
  flex-wrap: wrap;
  font-size: ${scale(12) + `px`};
  line-height: ${scale(16) + `px`};
  font-family: "IBMPlexMono";
  color: #3b435a;
`;

const PopupClose = styled.Image`
  width: ${scale(15) + `px`};
  height: ${scale(15) + `px`};
`;

const TopContainer = styled.View`
  margin-top: ${verticalScale(20) + `px`};
  margin-bottom: ${verticalScale(16) + `px`};
  margin-left: ${scale(20) + `px`};
  margin-right: ${scale(20) + `px`};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const TopStartContainer = styled.View`
  flex-direction: row;
  justify-content: center;
`;

const TitleContainer = styled.View`
  justify-content: center;
  margin-left: ${scale(10) + `px`};
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

const CardCircles = styled.View`
  flex-direction: row;
  align-items: center;
  z-index: 1000;
`;

const CardCircle = styled.View`
  width: ${scale(30) + `px`};
  height: ${scale(30) + `px`};
  border-radius: 100px;
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
  padding-right: ${scale(10) + `px`};
  padding-bottom: ${scale(25) + `px`};
  border-radius: 10px;
  background: #fafafa;
  justify-content: space-between;
`;

const CardMyImageContainer = styled.View`
  width: ${(width - scale(39)) / 2 + `px`};
  height: ${verticalScale(300) + `px`};
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 10px;
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
  padding-top: ${scale(15) + `px`};
  padding-left: ${scale(15) + `px`};
  padding-right: ${scale(20) + `px`};
  padding-bottom: ${scale(25) + `px`};
  border-radius: 10px;
  background: #fafafa;
  border: ${scale(1) + `px solid #ebebeb`};
  justify-content: space-between;
`;

const CardImages = styled.View`
  z-index: 5000;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const CardInfo = styled.Image`
  width: ${scale(24) + `px`};
  height: ${scale(24) + `px`};
`;

const CameraImage = styled.Image`
  width: ${scale(30) + `px`};
  height: ${scale(30) + `px`};
`;

const MessageImage = styled.Image`
  width: ${scale(30) + `px`};
  height: ${scale(30) + `px`};
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
  padding-top: ${scale(8) + `px`};
  padding-bottom: ${scale(8) + `px`};
  padding-left: ${scale(8) + `px`};
  padding-right: ${scale(12) + `px`};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: ${scale(1) + `px solid #E6E6E6`};
  border-radius: 10px;
`;

const ButtonText = styled.Text`
  margin-left: ${scale(4) + `px`};
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

/*
            <CardCircles>
              <CardCircle
                style={{
                  backgroundColor: "#70C874",
                  zIndex: 500
                }}
              />
              <CardCircle
                style={{
                  backgroundColor: "#525A71",
                  marginLeft: scale(-15)
                }}
              />
            </CardCircles>
             */
