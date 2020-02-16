import React from "react";
import { TouchableOpacity, Dimensions } from "react-native";
import * as NavigationService from "../service/NavigationService";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import images from "../constants/images";

const { width, height } = Dimensions.get("screen");

export default class Header extends React.Component {
  back = () => {
    NavigationService.goBack();
  };

  render() {
    const { title, previous } = this.props;

    return (
      <Container>
        {previous && (
          <BackContainer>
            <TouchableOpacity
              onPress={this.back}
              activeOpacity={0.9}
              hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <BackImage source={images.HeaderBack} />
            </TouchableOpacity>
          </BackContainer>
        )}
        <Title>{title}</Title>
      </Container>
    );
  }
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: ${width + `px`};
  height: ${verticalScale(65) + `px`};
`;

const BackContainer = styled.View`
  position: absolute;
  top: ${verticalScale(24) + `px`};
  left: ${scale(16) + `px`};
`;

const BackImage = styled.Image`
  width: ${scale(40) + `px`};
  height: ${scale(17) + `px`};
`;

const Title = styled.Text`
  font-size: ${scale(20) + `px`};
  color: #000;
  font-family: "Rubik-Regular";
`;
