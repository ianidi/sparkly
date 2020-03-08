import React from "react";
import { inject, observer } from "mobx-react";
import { Dimensions, View } from "react-native";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import images from "../constants/images";
import { BASE_URL } from "../constants";
import { SingleImage } from "./Lightbox";

const { width, height } = Dimensions.get("window");

@inject("feed")
@inject("member")
@observer
export default class Avatar extends React.Component {
  render() {
    return (
      <>
        {this.props.my ? (
          <>
            {this.props.member.AvatarURL != "" ? (
              <>
                <AvatarContainer
                  style={{
                    zIndex: 5,
                    borderRadius: 100,
                    borderWidth: this.props.member.RoommateSearch
                      ? scale(2)
                      : 0,
                    borderColor: "#FDE300"
                  }}
                >
                  <SingleImage
                    //uri="http://213.226.125.134:4000/static/Avatar_temp.png"
                    uri={`${BASE_URL}/static/${this.props.member.AvatarURL}`}
                    style={{
                      width: scale(40),
                      height: scale(40)
                    }}
                  />
                </AvatarContainer>
              </>
            ) : (
              <MemberCircle
                style={{
                  borderWidth: this.props.member.RoommateSearch ? scale(2) : 0,
                  borderColor: "#FDE300"
                }}
              >
                <MemberImage source={images.Member} />
              </MemberCircle>
            )}
          </>
        ) : (
          <>
            {this.props.AvatarURL != "" ? (
              <>
                <AvatarContainer
                  style={{
                    zIndex: 5,
                    borderRadius: 100,
                    borderWidth: this.props.RoommateSearch ? scale(2) : 0,
                    borderColor: "#FDE300"
                  }}
                >
                  <SingleImage
                    //uri="http://213.226.125.134:4000/static/Avatar_temp.png"
                    uri={`${BASE_URL}/static/${this.props.AvatarURL}`}
                    style={{
                      width: scale(40),
                      height: scale(40)
                    }}
                  />
                </AvatarContainer>
              </>
            ) : (
              <MemberCircle
                style={{
                  borderWidth: this.props.RoommateSearch ? scale(2) : 0,
                  borderColor: "#FDE300"
                }}
              >
                <MemberImage source={images.Member} />
              </MemberCircle>
            )}
          </>
        )}
      </>
    );
  }
}

const AvatarContainer = styled.View`
  position: relative;
  z-index: 10000;
  width: ${scale(40) + `px`};
  height: ${scale(40) + `px`};
  border-radius: 100px;
  overflow: hidden;
`;

const MemberCircle = styled.View`
  width: ${scale(40) + `px`};
  height: ${scale(40) + `px`};
  border-radius: 100px;
  background: #f0f0f0;
  align-items: center;
  justify-content: center;
`;

const MemberImage = styled.Image`
  width: ${scale(24) + `px`};
  height: ${scale(24) + `px`};
`;

/*
              <View
                style={{
                  position: "absolute",
                  width: scale(40),
                  height: scale(40),
                  zIndex: 30000,
                  backgroundColor: "transparent"
                }}
              />
              */
