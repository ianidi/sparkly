import * as React from "react";
import { Dimensions, TouchableOpacity } from "react-native";
import * as NavigationService from "../service/Navigation";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import images from "../constants/images";
import { getStatusBarHeight } from "react-native-iphone-x-helper";

const { width, height } = Dimensions.get("window");

export default class ChatHeader extends React.Component {
  arrowBackPress = () => {
    NavigationService.goBack();
  };

  render() {
    return (
      <>
        <Spacing />
        <Container>
          <TopContainer>
            <TopStartContainer>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={this.arrowBackPress}
                style={{
                  marginRight: scale(30)
                }}
                hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <ArrowBack source={images.AuthArrowBack} />
              </TouchableOpacity>
              <AvatarContainer>
                <AvatarImage source={images.Avatar_temp} />
              </AvatarContainer>
              {true && (
                <MatchContainer
                  style={{
                    backgroundColor: "#984446"
                  }}
                >
                  <MatchStarImage source={images.MatchStar} />
                </MatchContainer>
              )}
              {true && (
                <MatchContainer
                  style={{
                    backgroundColor: "#9499A7"
                  }}
                >
                  <MatchText>?</MatchText>
                </MatchContainer>
              )}
              <UserContainer>
                <UserTitleContainer>
                  <UserTitle>Алина</UserTitle>
                </UserTitleContainer>
                <UserCaption>мгимо</UserCaption>
              </UserContainer>
            </TopStartContainer>
          </TopContainer>
          <Delimiter />
        </Container>
      </>
    );
  }
}

const Spacing = styled.View`
  height: ${verticalScale(34) + scale(29) + `px`};
`;

const Container = styled.View`
  position: absolute;
  top: ${getStatusBarHeight() + `px`};
  width: ${width + `px`};
  background: #fff;
  z-index: 2000;
`;

const TopContainer = styled.View`
  width: ${width - scale(40) + `px`};
  margin-top: ${verticalScale(20) + `px`};
  margin-bottom: ${verticalScale(14) + `px`};
  margin-left: ${scale(20) + `px`};
  margin-right: ${scale(20) + `px`};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const TopStartContainer = styled.View`
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
  color: #252e48;
`;

const MatchStarImage = styled.Image`
  width: ${scale(26) + `px`};
  height: ${scale(26) + `px`};
`;

const AvatarImage = styled.Image`
  width: ${scale(40) + `px`};
  height: ${scale(40) + `px`};
`;

const UserContainer = styled.View`
  margin-left: ${scale(10) + `px`};
  justify-content: center;
`;

const UserTitleContainer = styled.View`
  justify-content: flex-start;
  flex-direction: row;
`;

const UserTitle = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(18) + `px`};
  font-family: "IBMPlexSans-Medium";
  color: #252e48;
`;

const UserCaption = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(18) + `px`};
  font-family: "IBMPlexSans-Light";
  color: #252e48;
`;

const Delimiter = styled.View`
  width: ${width + `px`};
  height: ${scale(1) + `px`};
  background: #f2f2f2;
`;

const ArrowBack = styled.Image`
  width: ${scale(24) + `px`};
  height: ${scale(24) + `px`};
`;