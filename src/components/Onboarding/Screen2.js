import React, { Component } from "react";
import { Animated, StyleSheet, Dimensions } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import styled from "styled-components/native";
import images from "../../constants/images";

const { width, height } = Dimensions.get("window");

export default class FirstScene extends Component {
  render() {
    let { animatedValue } = this.props,
      halfWWidth = width / 2,
      animateInputRange = [-1 * halfWWidth, 0, halfWWidth],
      subtitleAnimateStyle = [
        styles.subtitle,
        {
          transform: [
            {
              translateX: animatedValue.interpolate({
                inputRange: animateInputRange,
                outputRange: [halfWWidth + 10, 0, -1 * halfWWidth - 10],
                extrapolate: "clamp"
              })
            }
          ],
          opacity: animatedValue.interpolate({
            inputRange: animateInputRange,
            outputRange: [0, 1, 0]
          })
        }
      ];

    return (
      <Container>
        <Image source={images.Onboarding_2} resizeMode={"contain"} />
        <Content>
          <Title>быть в курсе событий</Title>
          <Animated.Text style={subtitleAnimateStyle}>
            вместе пойти на премьеру фильма, найти напарника для бега и многое
            другое в ленте приложения
          </Animated.Text>
        </Content>
      </Container>
    );
  }
}

const Container = styled.View`
  flex: 1;
  align-items: center;
  width: ${width + `px`};
  margin-top: ${verticalScale(20) + `px`};
`;

const Content = styled.View`
  width: ${width - scale(80) + `px`};
  margin-left: ${scale(40) + `px`};
  margin-right: ${scale(40) + `px`};
`;

const Image = styled.Image`
  width: ${width - scale(36) + `px`};
  height: ${(width - scale(36)) * 0.65 + `px`};
  margin-bottom: ${verticalScale(24) + `px`};
  margin-left: ${scale(18) + `px`};
  margin-right: ${scale(18) + `px`};
`;

const Title = styled.Text`
  font-size: ${scale(46) + `px`};
  line-height: ${scale(46) + `px`};
  margin-bottom: ${verticalScale(16) + `px`};
  font-family: "Cormorant-Regular";
  color: #525a71;
`;

const styles = StyleSheet.create({
  subtitle: {
    fontSize: scale(16),
    lineHeight: scale(22),
    fontFamily: "IBMPlexSans-Light",
    color: "#252E48"
  }
});
