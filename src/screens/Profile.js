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
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { Switch } from "react-native-paper";
import images from "../constants/images";
import { api } from "../service/Api";
import Avatar from "../components/Avatar";

const { width, height } = Dimensions.get("screen");

@inject("main")
@inject("member")
@observer
class ProfileScreen extends React.Component {
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

  RoommateToggle = () => {
    this.setState({ Roommate: !this.state.Roommate });
  };

  uploadAvatar = () => {
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = ["Сделать фотографию", "Выбрать из галереи", "Отмена"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 2;

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex
      },
      buttonIndex => {
        // Do something here depending on the button index selected
      }
    );
  };

  renderProfile = () => {
    const { Roommate } = this.state;

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

        <Main>
          <TouchableOpacity onPress={this.uploadAvatar} activeOpacity={0.9}>
            <AvatarContainer>
              <Avatar />
              <AvatarAddText>добавить фотографию</AvatarAddText>
            </AvatarContainer>
          </TouchableOpacity>
          <Divider />

          <Label>имя</Label>
          <Value>{this.props.member.Name}</Value>
          <Divider />

          <Label>университет</Label>
          <Value>{this.props.member.UniversityAbbr.toLowerCase()}</Value>
          <Divider />

          <Label>факультет</Label>
          {this.props.member.Faculty ? (
            <Value>{this.props.member.Faculty}</Value>
          ) : (
            <Value>не задан</Value>
          )}
        </Main>
        <DividerBig />

        <RoommateSearch>
          <RoommateSearchSwitch>
            <Switch
              value={this.props.member.RoommateSearch}
              onValueChange={() => this.props.member.toggle("RoommateSearch")}
              color={"#FDE300"}
            />
          </RoommateSearchSwitch>

          <RoommateSearchContent>
            <TouchableOpacity
              onPress={() => this.props.member.toggle("RoommateSearch")}
              activeOpacity={0.9}
              hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <RoommateSearchTitle>
                показывать в моей анкете статус «ищу соседа»
              </RoommateSearchTitle>
              <RoommateSearchCaption>
                его будут видеть только те, кто также указал стутс «ищу соседа»
              </RoommateSearchCaption>
            </TouchableOpacity>
          </RoommateSearchContent>
        </RoommateSearch>

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Interests")}
          activeOpacity={0.9}
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <Button>
            <ButtonText>изменить мои интересы</ButtonText>
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
          {this.renderProfile()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default connectActionSheet(ProfileScreen);

const ArrowBack = styled.Image`
  width: ${scale(24) + `px`};
  height: ${scale(24) + `px`};
`;

const Title = styled.Text`
  font-size: ${scale(46) + `px`};
  line-height: ${scale(46) + `px`};
  margin-top: ${verticalScale(55) + `px`};
  margin-bottom: ${verticalScale(20) + `px`};
  margin-left: ${scale(40) + `px`};
  font-family: "Cormorant-Regular";
  color: #525a71;
`;

const Label = styled.Text`
  font-size: ${scale(12) + `px`};
  line-height: ${scale(16) + `px`};
  margin-top: ${verticalScale(25) + `px`};
  margin-bottom: ${verticalScale(5) + `px`};
  font-family: "IBMPlexMono";
  color: #525a71;
`;

const Value = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(24) + `px`};
  font-family: "IBMPlexSans-Medium";
  color: #3b435a;
`;

const Main = styled.View`
  padding-left: ${scale(40) + `px`};
`;

const Divider = styled.View`
  margin-top: ${verticalScale(10) + `px`};
  width: ${width - scale(40) + `px`};
  height: ${verticalScale(1) + `px`};
  background: #f0f0f0;
`;

const DividerBig = styled.View`
  margin-top: ${verticalScale(10) + `px`};
  margin-bottom: ${verticalScale(35) + `px`};
  width: ${width + `px`};
  height: ${verticalScale(1) + `px`};
  background: #f0f0f0;
`;

const RoommateSearch = styled.View`
  margin-left: ${scale(15) + `px`};
  margin-right: ${scale(35) + `px`};
  margin-bottom: ${verticalScale(40) + `px`};
  width: ${width - scale(35) + `px`};
  flex-direction: row;
`;

const RoommateSearchSwitch = styled.View`
  padding-top: ${verticalScale(4) + `px`};
  margin-right: ${scale(15) + `px`};
`;

const RoommateSearchContent = styled.View`
  flex-direction: column;
  width: ${width * 0.7 + `px`};
`;

const RoommateSearchTitle = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(20) + `px`};
  margin-bottom: ${verticalScale(5) + `px`};
  font-family: "IBMPlexMono";
  color: #525a71;
`;

const RoommateSearchCaption = styled.Text`
  font-size: ${scale(12) + `px`};
  line-height: ${scale(16) + `px`};
  font-family: "IBMPlexMono";
  color: #9499a7;
`;

const Button = styled.View`
  width: ${width - scale(30) + `px`};
  padding-top: ${scale(16) + `px`};
  padding-bottom: ${scale(16) + `px`};
  margin-left: ${scale(15) + `px`};
  margin-right: ${scale(15) + `px`};
  margin-bottom: ${verticalScale(35) + `px`};
  border-radius: 14px;
  background: #fafafa;
  border: 1px solid #ebebeb;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(16) + `px`};
  font-family: "IBMPlexMono";
  color: #3b435a;
`;

const AvatarContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${scale(4) + `px`};
`;

const AvatarAddText = styled.Text`
  margin-left: ${scale(10) + `px`};
  font-size: ${scale(16) + `px`};
  line-height: ${scale(16) + `px`};
  color: #3b435a;
  font-family: "IBMPlexMono";
`;
