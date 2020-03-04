import React from "react";
import { Dimensions, TouchableOpacity } from "react-native";
import styled from "styled-components";
import { scale, verticalScale } from "react-native-size-matters";
import { observer } from "mobx-react";

const { width, height } = Dimensions.get("window");

@observer
export default class Tooltip extends React.Component {
  render() {
    const { caption, title, onComplete, button } = this.props;

    return (
      <Container>
        <Header>
          <Title>{title}</Title>
          <Caption>{caption}</Caption>
        </Header>
        <TouchableOpacity activeOpacity={0.9} onPress={onComplete}>
          <Button>
            <ButtonText>{button}</ButtonText>
            <ButtonCircle />
          </Button>
        </TouchableOpacity>
      </Container>
    );
  }
}

const Container = styled.View`
  width: ${width - scale(32) + `px`};
  border: ${scale(1) + `px solid #525a71`};
`;

const Header = styled.View`
  padding-top: ${verticalScale(40) + `px`};
  padding-bottom: ${verticalScale(30) + `px`};
  padding-left: ${scale(40) + `px`};
  padding-right: ${scale(40) + `px`};
  background: #f5cfd0;
`;

const Title = styled.Text`
  font-size: ${scale(44) + `px`};
  line-height: ${scale(44) + `px`};
  margin-bottom: ${verticalScale(14) + `px`};
  color: #fff;
  font-family: "Cormorant";
`;

const Caption = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(24) + `px`};
  color: #252e48;
  font-family: "IBMPlexSans";
`;

const Button = styled.View`
  padding-top: ${verticalScale(25) + `px`};
  padding-bottom: ${verticalScale(25) + `px`};
  padding-left: ${scale(40) + `px`};
  padding-right: ${scale(40) + `px`};
  border-top-width: ${scale(1) + `px`};
  border-top-color: #525a71;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: #fff;
`;

const ButtonText = styled.Text`
  font-size: ${scale(16) + `px`};
  color: #3b435a;
  line-height: ${scale(16) + `px`};
  font-family: "IBMPlexMono";
`;

const ButtonCircle = styled.View`
  position: absolute;
  z-index: -1;
  background: #f5cfd0;
  width: ${scale(45) + `px`};
  height: ${scale(45) + `px`};
  border-radius: 100px;
`;
