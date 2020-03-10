import React, { PureComponent } from "react";
import { Image, View } from "react-native";
import PropTypes from "prop-types";

export default class ImageCustom extends PureComponent {
  static propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    index: PropTypes.number,
    uri: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.carouselItems = {};
  }
  captureCarouselItem = (ref, idx) => {
    this.carouselItems[idx] = ref;
  };

  render() {
    const { uri, style, index } = this.props;
    return (
      <View>
        <Image
          ref={ref => this.captureCarouselItem(ref, index)}
          source={{
            uri: uri
          }}
          style={style}
        />
      </View>
    );
  }
}
