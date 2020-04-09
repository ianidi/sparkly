import React from "react";
import { inject, observer } from "mobx-react";
import AsyncStorage from "@react-native-community/async-storage";
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
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import * as Progress from "react-native-progress";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { BASE_URL } from "../constants";
import images from "../constants/images";
import Avatar from "../components/Avatar";
import Switch from "../components/Switch";

const { width, height } = Dimensions.get("window");

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

  changeAvatar = () => {
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = ["Сделать фотографию", "Выбрать из галереи", "Отмена"];
    const destructiveButtonIndex = 2;
    const cancelButtonIndex = 2;

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex
      },
      buttonIndex => {
        if (buttonIndex == 0) {
          this.openCamera();
        } else if (buttonIndex == 1) {
          this.openGallery();
        }
      }
    );
  };

  openCamera = async () => {
    try {
      let granted = true;

      let cameraGranted = await Permissions.askAsync(Permissions.CAMERA);

      if (cameraGranted.status !== "granted") {
        granted = false;
      }

      if (!granted) {
        alert("Разрешите доступ к камере в настройках");
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        exif: true,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8
      });

      if (!result.cancelled) {
        this.avatarUpload(result.uri);
      }
    } catch (err) {}
  };

  openGallery = async () => {
    try {
      let granted = true;

      let cameraGranted = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (cameraGranted.status !== "granted") {
        granted = false;
      }

      if (!granted) {
        alert("Разрешите доступ к медиатеке в настройках");
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        exif: true,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8
      });

      if (!result.cancelled) {
        this.avatarUpload(result.uri);
      }
    } catch (err) {}
  };

  avatarUpload = async uri => {
    try {
      const token = await AsyncStorage.getItem("@Api:token");

      let formData = new FormData();
      formData.append("file", {
        uri,
        name: `photo.jpeg`,
        type: `image/jpeg`
      });

      let options = {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
          Category: "avatar"
        }
      };

      this.setState({ loading: true });

      const request = await fetch(`${BASE_URL}/profile/avatar/upload`, options);
      const response = await request.json();

      console.log(JSON.stringify(response));

      this.setState({ loading: false });

      if (response?.status) {
        if (typeof response?.filename !== "undefined") {
          this.props.member.set("AvatarURI", response.filename);
        }
      }
    } catch (err) {
      this.setState({ loading: false });
      console.debug(JSON.stringify(err));
    }
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

        <Main>
          <TouchableOpacity onPress={this.changeAvatar} activeOpacity={0.9}>
            <AvatarContainer>
              <Avatar my={true} />
              {this.props.member.AvatarURI != "" ? (
                <AvatarAddText>изменить фотографию</AvatarAddText>
              ) : (
                <AvatarAddText>добавить фотографию</AvatarAddText>
              )}
            </AvatarContainer>
          </TouchableOpacity>
          <Divider />

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("EditNameGender")}
            activeOpacity={0.9}
            hitSlop={{ right: 20, left: 20 }}
          >
            <Label>имя</Label>
            <Value>{this.props.member.Name}</Value>
            <Divider />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("EditUniversity")}
            activeOpacity={0.9}
            hitSlop={{ right: 20, left: 20 }}
          >
            <Label>университет</Label>
            <Value>{this.props.member.UniversityAbbr.toLowerCase()}</Value>
            <Divider />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("EditFaculty")}
            activeOpacity={0.9}
            hitSlop={{ right: 20, left: 20 }}
          >
            <Label>факультет</Label>
            {this.props.member.Faculty ? (
              <Value>{this.props.member.Faculty}</Value>
            ) : (
              <Value>не задан</Value>
            )}
          </TouchableOpacity>
        </Main>
        <DividerBig />

        <RoommateSearch>
          <RoommateSearchSwitch>
            <Switch
              ref={ref => {
                this.switch = ref;
              }}
              colorActive="rgb(253, 227, 0)"
              value={this.props.member.RoommateSearch}
              loading={this.props.member.loading}
              onChange={value => {
                this.props.member.RoommateSearchToggle(value);
              }}
            />
          </RoommateSearchSwitch>

          <RoommateSearchContent>
            <TouchableOpacity
              onPress={() => this.switch.toggle()}
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
        {this.state.loading && (
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
