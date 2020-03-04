import React from "react";
import { Text, TouchableWithoutFeedback, Dimensions } from "react-native";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import Carousel, { Pagination } from "react-native-snap-carousel";
import * as WebBrowser from "expo-web-browser";

const { width, height } = Dimensions.get("window");

export default class HomeCarousel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Banner: Banner,
      activeSlide: 0
    };
  }

  _renderItem({ item, index }, parallaxProps) {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          WebBrowser.openBrowserAsync(item.URL);
        }}
      >
        <Card>
          <CardImage source={{ uri: item.Image }} />
          <TitleContainer>
            <Title numberOfLines={2}>{item.Title}</Title>
          </TitleContainer>
        </Card>
      </TouchableWithoutFeedback>
    );
  }

  get pagination() {
    const { Banner, activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={Banner.length}
        activeDotIndex={activeSlide}
        dotColor={"#00FF00"}
        inactiveDotColor={"#BFBFBF"}
        containerStyle={{
          paddingTop: verticalScale(12),
          paddingBottom: verticalScale(40),
          width: width
        }}
        dotStyle={{
          width: scale(8),
          height: scale(8),
          borderRadius: 5
        }}
        inactiveDotStyle={{}}
        inactiveDotOpacity={1}
        inactiveDotScale={0.8}
      />
    );
  }

  render() {
    return (
      <>
        <Carousel
          data={this.state.Banner}
          renderItem={this._renderItem}
          sliderWidth={width}
          itemWidth={width - scale(36)}
          containerCustomStyle={{
            marginTop: 15,
            overflow: "visible"
          }}
          contentContainerCustomStyle={{ paddingVertical: verticalScale(10) }}
          layout={"default"}
          loop={false}
          onSnapToItem={index => this.setState({ activeSlide: index })}
        />
        {this.pagination}
      </>
    );
  }
}

const Card = styled.View`
  width: ${width - scale(36) + `px`};
  height: ${verticalScale(260) + `px`};
`;

const CardImage = styled.Image`
  width: ${width - scale(36) + `px`};
  height: ${verticalScale(260) + `px`};
`;

const TitleContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  padding-top: ${verticalScale(10) + `px`};
  padding-bottom: ${verticalScale(12) + `px`};
  padding-left: ${scale(16) + `px`};
  padding-right: ${scale(16) + `px`};
  background: #fff;
  max-width: ${width * 0.7 + `px`};
`;

const Title = styled.Text`
  font-size: ${scale(24) + `px`};
  line-height: ${verticalScale(32) + `px`};
  color: #000;
  font-family: "DrukTextCyr-Bold";
`;

const Banner = [
  {
    Title: "Найдем тебе жилье рядом с F class",
    Image: "https://i.imgur.com/UYiroysl.jpg",
    URL: "https://google.com/"
  },
  {
    Title: "Earlier this morning, NYC",
    Image: "https://i.imgur.com/UPrs1EWl.jpg",
    URL: "https://google.com/"
  },
  {
    Title: "White Pocket Sunset",
    Image: "https://i.imgur.com/MABUbpDl.jpg",
    URL: "https://google.com/"
  },
  {
    Title: "Acrocorinth, Greece",
    Image: "https://i.imgur.com/KZsmUi2l.jpg",
    URL: "https://google.com/"
  },
  {
    Title: "The lone tree, majestic landscape of New Zealand",
    Image: "https://i.imgur.com/2nCt3Sbl.jpg",
    URL: "https://google.com/"
  },
  {
    Title: "Middle Earth, Germany",
    Image: "https://i.imgur.com/lceHsT6l.jpg",
    URL: "https://google.com/"
  }
];
