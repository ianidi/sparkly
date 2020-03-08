import React from "react";
import { inject, observer } from "mobx-react";
import AsyncStorage from "@react-native-community/async-storage";
import { Image, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import * as NavigationService from "../../service/Navigation";
import {
  getStatusBarHeight,
  getBottomSpace
} from "react-native-iphone-x-helper";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import * as Progress from "react-native-progress";
import images from "../../constants/images";
import { BASE_URL } from "../../constants";
import Switch from "../../components/Switch";

const { width, height } = Dimensions.get("window");

@inject("member")
@observer
export default class CameraUploadPreviewModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      uploading: false
    };
  }

  complete = () => {
    if (this.state.uploading) {
      return;
    }
    this.imageUpload();
  };

  imageUpload = async () => {
    try {
      this.setState({ uploading: true });

      const token = await AsyncStorage.getItem("@Api:token");

      let formData = new FormData();
      formData.append("file", {
        uri: this.props.member.ImageUploadLocalURI,
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
          Category: "feed",
          RestrictUniversity: this.props.member.ImageUploadRestrictUniversity
        }
      };

      const request = await fetch(`${BASE_URL}/feed/upload`, options);
      const response = await request.json();

      console.log(JSON.stringify(response));

      this.props.member.set(
        "LastFeedLocalURI",
        this.props.member.ImageUploadLocalURI
      );
      this.props.member.set(
        "LastFeedRestrictUniversity",
        this.props.member.ImageUploadRestrictUniversity
      );

      //TODO: update user feed
      NavigationService.goBack();
      this.close();
    } catch (err) {
      this.setState({ uploading: false });
      alert("Не удалось загрузить изображение");
      console.debug(JSON.stringify(err));
    }
  };

  close = () => {
    this.props.modal.closeModal();
  };

  render() {
    return (
      <>
        {this.state.uploading == false && (
          <CloseContainer>
            <TouchableOpacity
              onPress={this.close}
              activeOpacity={0.9}
              hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CloseImage source={images.Close} />
            </TouchableOpacity>
          </CloseContainer>
        )}
        <ModalContainer>
          <Image
            source={{
              uri: this.props.member.ImageUploadLocalURI
            }}
            style={styles.image}
          />
        </ModalContainer>
        <BottomContainer>
          {this.state.uploading == false && (
            <SettingsContainer>
              <SwitchContainer>
                <SwitchWrapper>
                  <Switch
                    ref={ref => {
                      this.switch = ref;
                    }}
                    colorActive="rgb(82, 90, 113)"
                    value={this.props.member.ImageUploadRestrictUniversity}
                    onChange={value => {
                      this.props.member.set(
                        "ImageUploadRestrictUniversity",
                        value
                      );
                    }}
                  />
                </SwitchWrapper>
                <TouchableOpacity
                  onPress={() => this.switch.toggle()}
                  activeOpacity={0.9}
                >
                  <SwitchCaption>
                    показывать студентам{"\n"}только в моем университете
                  </SwitchCaption>
                </TouchableOpacity>
              </SwitchContainer>
            </SettingsContainer>
          )}

          <TouchableOpacity
            onPress={this.complete}
            activeOpacity={0.9}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <ButtonContainer>
              <Button>
                {this.state.uploading == false ? (
                  <>
                    <Circle
                      style={{
                        backgroundColor: this.props.member
                          .ImageUploadRestrictUniversity
                          ? "#525A71"
                          : "#fff",
                        borderWidth: scale(1),
                        borderColor: this.props.member
                          .ImageUploadRestrictUniversity
                          ? "#525A71"
                          : "#D9D9D9"
                      }}
                    />
                    <ButtonText>запостить фото</ButtonText>
                  </>
                ) : (
                  <>
                    <Progress.CircleSnail
                      color={["#525A71", "#F5CFD0", "#FDE300"]}
                      size={scale(30)}
                      strokeCap={"butt"}
                      style={{
                        marginLeft: scale(4),
                        marginRight: scale(4)
                      }}
                    />
                    <ButtonText>загружаем фото</ButtonText>
                  </>
                )}
              </Button>
            </ButtonContainer>
          </TouchableOpacity>
        </BottomContainer>
      </>
    );
  }
}

const BottomContainer = styled.View`
  width: ${width - scale(10) + `px`};
  margin-left: ${scale(5) + `px`};
  margin-right: ${scale(5) + `px`};
  position: absolute;
  z-index: 11000;
  bottom: ${getBottomSpace() + verticalScale(40) + `px`};
`;

const SettingsContainer = styled.View`
  width: ${width - scale(10) + `px`};
  padding-top: ${verticalScale(20) + `px`};
  padding-bottom: ${verticalScale(20) + `px`};
  padding-left: ${scale(10) + `px`};
  padding-right: ${scale(10) + `px`};
  margin-bottom: ${verticalScale(25) + `px`};
  border: 1px solid #525a71;
  border-radius: 10px;
  background: #fff;
`;

const SwitchContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const SwitchWrapper = styled.View`
  margin-right: ${scale(10) + `px`};
`;

const SwitchCaption = styled.Text`
  font-size: ${scale(15) + `px`};
  line-height: ${scale(19) + `px`};
  font-family: "IBMPlexMono";
  color: #525a71;
  max-width: ${width * 0.7 + `px`};
`;

const ModalContainer = styled.View`
  width: ${width + `px`};
  height: ${height + `px`};
  flex: 1;
  flex-direction: row;
  overflow: hidden;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

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

const Circle = styled.View`
  margin-left: ${scale(4) + `px`};
  margin-right: ${scale(4) + `px`};
  width: ${scale(30) + `px`};
  height: ${scale(30) + `px`};
  border-radius: 100px;
`;

const CloseContainer = styled.View`
  position: absolute;
  z-index: 2000;
  top: ${getStatusBarHeight() + verticalScale(20) + `px`};
  left: ${scale(20) + `px`};
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const CloseImage = styled.Image`
  width: ${scale(24) + `px`};
  height: ${scale(24) + `px`};
`;

const styles = StyleSheet.create({
  image: {
    ...StyleSheet.absoluteFillObject,
    width: null,
    height: null
  }
});
