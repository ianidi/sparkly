import React from "react";
import { inject, observer } from "mobx-react";
import AsyncStorage from "@react-native-community/async-storage";
import { Image, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import {
  getStatusBarHeight,
  getBottomSpace
} from "react-native-iphone-x-helper";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import images from "../constants/images";
import FeedCardTop from "../components/FeedCardTop";

const { width, height } = Dimensions.get("window");

@inject("member")
@observer
export default class FeedMyScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      uploading: false
    };
  }

  navigateCamera = () => {
    this.props.navigation.goBack();
    this.props.navigation.navigate("Camera");
  };

  close = () => {
    this.props.navigation.goBack();
  };

  render() {
    return (
      <>
        <FeedCardTop my={true} />
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
              uri: this.props.member.MemberFeedURI
            }}
            style={styles.image}
          />
        </ModalContainer>
        <BottomContainer>
          <TouchableOpacity
            onPress={this.navigateCamera}
            activeOpacity={0.9}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <ButtonContainer>
              <Button>
                <ButtonText>запостить новое фото</ButtonText>
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
  padding-top: ${scale(14) + `px`};
  padding-bottom: ${scale(14) + `px`};
  padding-left: ${scale(12) + `px`};
  padding-right: ${scale(12) + `px`};
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

const CloseContainer = styled.View`
  position: absolute;
  z-index: 2000;
  top: ${getStatusBarHeight() + verticalScale(20) + `px`};
  right: ${scale(20) + `px`};
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
