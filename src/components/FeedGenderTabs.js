import React from "react";
import { inject, observer } from "mobx-react";
import { View, TouchableOpacity, Animated, Dimensions } from "react-native";
import styled from "styled-components/native";
import { verticalScale, scale } from "react-native-size-matters";

const { width, height } = Dimensions.get("window");

@inject("feed")
@observer
export default class FeedGenderTabs extends React.Component {
  state = {
    xTabOne: 0,
    xTabTwo: 0,
    xTabThree: 0,
    translateX: new Animated.Value(0)
  };

  initialSlide = offset => {
    let { translateX } = this.state;

    Animated.timing(translateX, {
      toValue: offset,
      duration: 1
    }).start();
  };

  handleSlide = offset => {
    let { translateX } = this.state;

    Animated.spring(translateX, {
      toValue: offset,
      duration: 100
    }).start();
  };

  render() {
    let { xTabOne, xTabTwo, xTabThree, translateX } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            width: "100%"
          }}
        >
          <View
            style={{
              flexDirection: "row",
              position: "relative",

              height: scale(56),
              backgroundColor: "#F2F2F2",
              padding: scale(4),
              borderRadius: 10,
              borderWidth: scale(1),
              borderColor: "#D9D9D9"
            }}
          >
            <Animated.View
              style={{
                position: "absolute",
                width: "33.3%",
                height: "100%",
                top: scale(4),
                left: scale(4),

                height: scale(46),
                boxShadow: "0px 1px 8px rgba(0, 0, 0, 0.12)",

                borderRadius: 10,
                backgroundColor: "#fff",
                borderWidth: scale(1),
                borderColor: "#D9D9D9",

                transform: [
                  {
                    translateX
                  }
                ]
              }}
            />

            <TouchableOpacity
              activeOpacity={1}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
              onLayout={event => {
                let offset = event.nativeEvent.layout.x - scale(4);
                this.setState({
                  xTabOne: offset
                });
                if (this.props.feed.Gender === "f") {
                  this.initialSlide(offset);
                }
              }}
              onPress={() => {
                this.props.feed.set("Gender", "f");
                this.handleSlide(xTabOne);
              }}
            >
              <>
                <Circles
                  style={{ opacity: this.props.feed.Gender === "f" ? 1 : 0.3 }}
                >
                  <Circle
                    style={{
                      backgroundColor: "#F9A5C8"
                    }}
                  />
                </Circles>
                <TabTitle
                  style={{
                    color:
                      this.props.feed.Gender === "f" ? "#3B435A" : "#6E7588"
                  }}
                >
                  девушек
                </TabTitle>
              </>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
              onLayout={event => {
                let offset = event.nativeEvent.layout.x - scale(4);
                this.setState({
                  xTabTwo: offset
                });
                if (this.props.feed.Gender === "m") {
                  this.initialSlide(offset);
                }
              }}
              onPress={() => {
                this.props.feed.set("Gender", "m");
                this.handleSlide(xTabTwo);
              }}
            >
              <>
                <Circles
                  style={{ opacity: this.props.feed.Gender === "m" ? 1 : 0.3 }}
                >
                  <Circle
                    style={{
                      backgroundColor: "#79BFF2"
                    }}
                  />
                </Circles>

                <TabTitle
                  style={{
                    color:
                      this.props.feed.Gender === "m" ? "#3B435A" : "#6E7588"
                  }}
                >
                  парней
                </TabTitle>
              </>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
              onLayout={event => {
                let offset = event.nativeEvent.layout.x - scale(6);
                this.setState({
                  xTabThree: offset
                });
                if (this.props.feed.Gender === "any") {
                  this.initialSlide(offset);
                }
              }}
              onPress={() => {
                this.props.feed.set("Gender", "any");
                this.handleSlide(xTabThree);
              }}
            >
              <>
                <Circles
                  style={{
                    opacity: this.props.feed.Gender === "any" ? 1 : 0.3
                  }}
                >
                  <Circle
                    style={{
                      backgroundColor: "#F9A5C8"
                    }}
                  />
                  <Circle
                    style={{
                      backgroundColor: "#79BFF2",
                      marginLeft: scale(-15),
                      zIndex: 500
                    }}
                  />
                </Circles>

                <TabTitle
                  style={{
                    color:
                      this.props.feed.Gender === "any" ? "#3B435A" : "#6E7588"
                  }}
                >
                  всех
                </TabTitle>
              </>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const TabTitle = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(16) + `px`};
  font-family: "IBMPlexMono";
  z-index: 2000;
`;

const Circles = styled.View`
  position: absolute;
  flex-direction: row;
  align-items: center;
  z-index: 1000;
`;

const Circle = styled.View`
  width: ${scale(30) + `px`};
  height: ${scale(30) + `px`};
  border-radius: 100px;
`;
