import React from "react";
import { inject, observer } from "mobx-react";
import { Dimensions, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import Svg, { G, Path, Rect } from "react-native-svg";

const { width, height } = Dimensions.get("screen");

@inject("feed")
@observer
export default class CategoryFeed extends React.Component {
  render() {
    return (
      <Container>
        <Svg
          style={{ marginLeft: scale(4), marginRight: scale(4) }}
          width={scale(30)}
          height={scale(30)}
          viewBox="0 0 30 30"
        >
          <G fillRule="nonzero" fill="none">
            <Path
              d="M15 30C6.716 30 0 23.284 0 15 0 6.716 6.716 0 15 0v30z"
              fill={this.props.feed.Gender != "m" ? "#F9A5C8" : "#79BFF2"}
            />
            <Path
              d="M15 0c8.284 0 15 6.716 15 15 0 8.284-6.716 15-15 15V0z"
              fill={this.props.feed.Gender != "f" ? "#79BFF2" : "#F9A5C8"}
            />
          </G>
        </Svg>

        <Circle
          style={{
            backgroundColor: this.props.feed.RestrictUniversity
              ? "#525A71"
              : "#fff",
            borderWidth: scale(1),
            borderColor: this.props.feed.RestrictUniversity
              ? "#525A71"
              : "#D9D9D9"
          }}
        />
      </Container>
    );
  }
}

const Container = styled.View`
  flex-direction: row;
`;

const Circle = styled.View`
  margin-left: ${scale(4) + `px`};
  margin-right: ${scale(4) + `px`};
  width: ${scale(30) + `px`};
  height: ${scale(30) + `px`};
  border-radius: 100px;
`;

/*
<Svg
          style={{  }}
          width={scale(30)}
          height={scale(30)}
          viewBox="0 0 30 30"
          fill="none"
        >
          <Rect width={30} height={30} rx={15} fill="#F4547A" />
        </Svg>
        */
