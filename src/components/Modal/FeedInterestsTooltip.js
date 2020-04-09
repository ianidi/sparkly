import React from "react";
import { inject, observer } from "mobx-react";
import { TouchableOpacity, Dimensions } from "react-native";
import * as NavigationService from "../../service/Navigation";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import Tooltip from "./Tooltip";

const { width, height } = Dimensions.get("window");

@inject("main")
@observer
export default class FeedSettingsTooltipModal extends React.PureComponent {
  close = () => {
    this.props.modal.closeModal();
  };

  complete = () => {
    this.props.main.set("ModalFeedInterests", true);
    this.props.modal.closeModal();
    NavigationService.navigate("Interests");
  };

  render() {
    return (
      <>
        <TouchableOpacity
          onPress={this.close}
          activeOpacity={0.9}
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <ModalContainer />
        </TouchableOpacity>
        <BottomContainer>
          <Tooltip
            title="интересы"
            caption="заполни свои интересы и мы сможем каждое утро делать тебе подборку из самых подходящих для тебя людей"
            button="заполнить интересы"
            onComplete={this.complete}
          />

          <TouchableOpacity
            onPress={this.close}
            activeOpacity={0.9}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <ButtonContainer>
              <Dismiss>пропустить</Dismiss>
            </ButtonContainer>
          </TouchableOpacity>
        </BottomContainer>
      </>
    );
  }
}

const BottomContainer = styled.View`
  width: ${width - scale(32) + `px`};
  margin-left: ${scale(15) + `px`};
  margin-right: ${scale(15) + `px`};
  position: absolute;
  z-index: 11000;
  top: ${getStatusBarHeight() + verticalScale(80) + `px`};
`;

const ModalContainer = styled.View`
  width: ${width + `px`};
  height: ${height + `px`};
  flex: 1;
  flex-direction: row;
  overflow: hidden;
`;

const ButtonContainer = styled.View`
  margin-top: ${verticalScale(25) + `px`};
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Dismiss = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(16) + `px`};
  font-family: "IBMPlexMono";
  color: #fff;
`;
