import React from "react";
import { TouchableOpacity, Dimensions, ImageBackground } from "react-native";
import * as NavigationService from "../service/NavigationService";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import images from "../constants/images";

const { width, height } = Dimensions.get("screen");

export default class MenuModal extends React.PureComponent {
  navigate = screen => {
    this.props.modal.closeModal();
    NavigationService.navigate(screen);
  };

  render() {
    return (
      <ModalContainer>
        <CircleSide>
          <CircleImage source={images.ModalCircle} resizeMode={"stretch"} />
        </CircleSide>
        <ImageBackground
          source={images.ModalBG}
          style={{ width: "100%", height: "100%" }}
        >
          <ModalContent>
            <ModalCloseContainer>
              <TouchableOpacity
                onPress={this.props.modal.closeModal}
                activeOpacity={0.9}
                hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <ModalClose source={images.ModalClose} />
              </TouchableOpacity>
            </ModalCloseContainer>
            {menuItems.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => this.navigate(item.screen)}
                  activeOpacity={0.9}
                  hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  style={{
                    marginBottom: verticalScale(30)
                  }}
                >
                  <MenuItem>{item.title.toUpperCase()}</MenuItem>
                </TouchableOpacity>
              );
            })}
          </ModalContent>
        </ImageBackground>
      </ModalContainer>
    );
  }
}

const menuItems = [
  {
    title: "Бронирование",
    screen: "Booking"
  },
  {
    title: "Информация",
    screen: "Info"
  },
  {
    title: "Профиль",
    screen: "Profile"
  },
  {
    title: "Onboarding",
    screen: "Onboarding"
  },
  {
    title: "Splash",
    screen: "Splash"
  },
  {
    title: "CalendarDemo",
    screen: "CalendarDemo"
  }
];

const ModalContainer = styled.View`
  width: ${width + `px`};
  height: ${height + `px`};
  flex: 1;
  flex-direction: row;
  background-color: transparent;
  overflow: hidden;
`;

const CircleSide = styled.View`
  width: ${width * 0.3 + `px`};
  height: ${height + `px`};
  flex-direction: column;
  align-items: flex-end;
`;

const CircleImage = styled.Image`
  width: 100%;
  max-height: ${height + `px`};
  max-width: ${width * 0.2 + `px`};
`;

const ModalContent = styled.View`
  width: ${width * 0.7 + `px`};
  height: ${height + `px`};
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  padding-right: ${scale(20) + `px`};
`;

const ModalCloseContainer = styled.View`
  position: absolute;
  top: ${verticalScale(60) + `px`};
  right: ${scale(20) + `px`};
`;

const ModalClose = styled.Image`
  width: ${scale(23) + `px`};
  height: ${scale(23) + `px`};
`;

const MenuItem = styled.Text`
  font-size: ${scale(36) + `px`};
  color: #000;
  font-family: "DrukTextCyr-Bold";
`;
