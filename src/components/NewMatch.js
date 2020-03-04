import React from "react";
import { Dimensions, TouchableOpacity } from "react-native";
import styled from "styled-components";
import { scale, verticalScale } from "react-native-size-matters";
import { observer } from "mobx-react";
import images from "../constants/images";

const { width, height } = Dimensions.get("window");

@observer
export default class NewMatch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      closed: false
    };
  }

  close = () => {
    this.setState({ closed: true });
  };

  render() {
    if (this.state.closed) {
      return null;
    }

    return (
      <Container>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            position: "absolute",
            top: verticalScale(30),
            right: scale(20),
            zIndex: 1000
          }}
          onPress={this.close}
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <Close source={images.NewMatchClose} />
        </TouchableOpacity>
        <Header>
          <Title>ура!{"\n"}совпадение</Title>

          <UserInfo>
            <ImagesContainer>
              <AvatarContainer>
                <AvatarImage source={images.Avatar_temp} />
              </AvatarContainer>
              {true && (
                <MatchContainer
                  style={{
                    backgroundColor: "#984446"
                  }}
                >
                  <MatchText style={{ color: "#fff" }}>5</MatchText>
                </MatchContainer>
              )}
              {false && (
                <MatchContainer
                  style={{
                    backgroundColor: "#9499A7"
                  }}
                >
                  <MatchText style={{ color: "#252e48" }}>?</MatchText>
                </MatchContainer>
              )}
            </ImagesContainer>

            <UserContainer>
              <UserName>Алина</UserName>
              <UserUniversity>мгу</UserUniversity>
            </UserContainer>
          </UserInfo>
        </Header>
        <TouchableOpacity activeOpacity={0.9}>
          <Button>
            <ButtonText>написать сообщение</ButtonText>
            <ButtonCircle />
          </Button>
        </TouchableOpacity>
      </Container>
    );
  }
}

const Container = styled.View`
  width: ${width - scale(32) + `px`};
  margin-top: ${verticalScale(10) + `px`};
  margin-bottom: ${verticalScale(10) + `px`};
  margin-left: ${scale(15) + `px`};
  margin-right: ${scale(15) + `px`};
  border: ${scale(1) + `px solid #525a71`};
`;

const Close = styled.Image`
  width: ${scale(24) + `px`};
  height: ${scale(24) + `px`};
`;

const Header = styled.View`
  padding-top: ${verticalScale(25) + `px`};
  padding-bottom: ${verticalScale(30) + `px`};
  padding-left: ${scale(40) + `px`};
  padding-right: ${scale(40) + `px`};
  background: #f5cfd0;
`;

const Title = styled.Text`
  font-size: ${scale(44) + `px`};
  line-height: ${scale(44) + `px`};
  margin-bottom: ${verticalScale(25) + `px`};
  color: #fff;
  font-family: "Cormorant";
`;

const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ImagesContainer = styled.View`
  margin-right: ${scale(10) + `px`};
  flex-direction: row;
`;

const AvatarContainer = styled.View`
  position: relative;
  z-index: 2000;
  width: ${scale(40) + `px`};
  height: ${scale(40) + `px`};
  border-radius: 100px;
  overflow: hidden;
`;

const MatchContainer = styled.View`
  width: ${scale(40) + `px`};
  height: ${scale(40) + `px`};
  align-items: center;
  justify-content: center;
  margin-left: ${scale(-10) + `px`};
  border-radius: 100px;
`;

const MatchText = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(24) + `px`};
  font-family: "IBMPlexSans-Medium";
`;

const AvatarImage = styled.Image`
  width: ${scale(40) + `px`};
  height: ${scale(40) + `px`};
`;

const UserContainer = styled.View`
  justify-content: center;
`;

const UserName = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(18) + `px`};
  font-family: "IBMPlexSans-Medium";
  color: #3b435a;
`;

const UserUniversity = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(18) + `px`};
  font-family: "IBMPlexSans-Light";
  color: #525a71;
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
