import * as React from "react";
import { Dimensions } from "react-native";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { SingleImage } from "./Lightbox";
import images from "../constants/images";

const { width, height } = Dimensions.get("window");

export default class FeedCardTop extends React.Component {
  render() {
    return (
      <TopContainer>
        <TopStartContainer>
          <AvatarContainer
            style={{
              zIndex: 5
            }}
          >
            <SingleImage
              uri="http://213.226.125.134:4000/static/Avatar_temp.png"
              style={{
                width: scale(40),
                height: scale(40)
              }}
            />
          </AvatarContainer>

          {true && (
            <MatchContainer
              style={{
                backgroundColor: "#984446",
                zIndex: 10
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
              <Time>7ч.</Time>
            </UserTitleContainer>
            <UserCaption>мгимо</UserCaption>
          </UserContainer>
        </TopStartContainer>
      </TopContainer>
    );
  }
}
//
/*

              <AvatarImage source={images.Avatar_temp} />
            */

const TopContainer = styled.View`
  position: absolute;
  z-index: 2000;
  width: ${width - scale(40) + `px`};
  top: ${getStatusBarHeight() + verticalScale(20) + `px`};
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
  z-index: 10000;
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
  color: #fff;
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
  color: #fff;
`;

const UserCaption = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(18) + `px`};
  font-family: "IBMPlexSans-Light";
  color: #fff;
`;

const Time = styled.Text`
  font-size: ${scale(12) + `px`};
  line-height: ${scale(18) + `px`};
  font-family: "IBMPlexSans-Medium";
  color: #fff;
  margin-left: ${scale(10) + `px`};
`;