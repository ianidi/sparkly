import React from "react";
import { TouchableOpacity, Dimensions, ImageBackground } from "react-native";
import * as NavigationService from "../../service/Navigation";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import images from "../../constants/images";

const { width, height } = Dimensions.get("window");

export default class FeedOnboardingModal extends React.PureComponent {
  navigate = screen => {
    this.props.modal.closeModal();
    NavigationService.navigate(screen);
  };

  render() {
    return (
      <TouchableOpacity
        onPress={this.props.modal.closeModal}
        activeOpacity={0.9}
        hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <ModalContainer>
          <ModalContent>
            <HandSwipeImage source={images.HandSwipe} />
            <Caption>свайпни влево чтобы перейти к следующему человеку</Caption>
            <HandTapImage source={images.HandTap} />
            <Caption>нажми два раза чтобы лайкнуть понравившееся фото</Caption>
          </ModalContent>
        </ModalContainer>
      </TouchableOpacity>
    );
  }
}

const ModalContainer = styled.View`
  width: ${width + `px`};
  height: ${height + `px`};
  flex: 1;
  flex-direction: row;
  background-color: #00000090;
  overflow: hidden;
`;

const ModalContent = styled.View`
  width: ${width + `px`};
  height: ${height + `px`};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-left: ${scale(16) + `px`};
  padding-right: ${scale(16) + `px`};
`;

const HandSwipeImage = styled.Image`
  width: ${scale(75) + `px`};
  height: ${scale(75) + `px`};
`;

const HandTapImage = styled.Image`
  width: ${scale(75) + `px`};
  height: ${scale(75) + `px`};
  margin-top: ${verticalScale(60) + `px`};
`;

const Caption = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(24) + `px`};
  margin-top: ${verticalScale(30) + `px`};
  margin-bottom: ${verticalScale(12) + `px`};
  color: #fff;
  font-family: "IBMPlexSans";
  text-align: center;
`;
