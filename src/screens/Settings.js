import React from "react";
import { inject, observer } from "mobx-react";
import { TouchableOpacity, Dimensions, BackHandler } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import images from "../constants/images";
import Switch from "../components/Switch";

const { width, height } = Dimensions.get("window");

@inject("main")
@observer
class Notifications extends React.Component {
  render() {
    return (
      <NotificationsContainer>
        <NotificationsSwitch>
          <Switch
            ref={ref => {
              this.switch = ref;
            }}
            colorActive="rgb(253, 227, 0)"
            value={this.props.main.ChatNotificationsEnabled}
            onChange={value => {
              this.props.main.set("ChatNotificationsEnabled", value);
            }}
          />
        </NotificationsSwitch>

        <NotificationsContent>
          <TouchableOpacity
            onPress={() => this.switch.toggle()}
            activeOpacity={0.9}
          >
            <NotificationsTitle>
              получать уведомления о новых сообщениях в чате
            </NotificationsTitle>
          </TouchableOpacity>
        </NotificationsContent>
      </NotificationsContainer>
    );
  }
}

@inject("feed")
@inject("member")
@inject("main")
@observer
export default class SettingsScreen extends React.Component {
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
    this.props.main.clear();
    this.props.feed.clear();
    this.props.member.clear();
  };

  renderSettings = () => {
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
        <Title>настройки</Title>

        <Notifications />

        <TouchableOpacity onPress={this.signOut} activeOpacity={0.9}>
          <ButtonProfile>
            <ButtonProfileText>выйти из аккаунта</ButtonProfileText>
          </ButtonProfile>
        </TouchableOpacity>

        <TouchableOpacity
          //onPress={this.deactivateAccount}
          activeOpacity={0.9}
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          style={{
            marginTop: verticalScale(60)
          }}
        >
          <RemoveText>удалить аккаунт</RemoveText>
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
        {this.renderSettings()}
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

const ButtonProfile = styled.View`
  width: ${width - scale(30) + `px`};
  margin-top: ${scale(50) + `px`};
  padding-top: ${scale(16) + `px`};
  padding-bottom: ${scale(16) + `px`};
  margin-left: ${scale(15) + `px`};
  margin-right: ${scale(15) + `px`};
  border-radius: 14px;
  background: #fafafa;
  border: ${scale(1) + `px solid #ebebeb`};
  align-items: center;
  justify-content: center;
`;

const ButtonProfileText = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(16) + `px`};
  font-family: "IBMPlexMono";
  color: #3b435a;
`;

const NotificationsContainer = styled.View`
  margin-left: ${scale(15) + `px`};
  margin-right: ${scale(35) + `px`};
  width: ${width - scale(35) + `px`};
  flex-direction: row;
  align-items: center;
`;

const NotificationsSwitch = styled.View`
  margin-right: ${scale(15) + `px`};
`;

const NotificationsContent = styled.View`
  flex-direction: column;
  width: ${width * 0.7 + `px`};
`;

const NotificationsTitle = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(20) + `px`};
  font-family: "IBMPlexMono";
  color: #525a71;
`;

const RemoveText = styled.Text`
  align-self: center;
  font-size: ${scale(16) + `px`};
  line-height: ${scale(16) + `px`};
  font-family: "IBMPlexMono";
  color: red;
`;
