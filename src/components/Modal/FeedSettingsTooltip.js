import React from "react";
import { inject, observer } from "mobx-react";
import { TouchableOpacity, Dimensions } from "react-native";
import * as NavigationService from "../../service/Navigation";
import { getBottomSpace } from "react-native-iphone-x-helper";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import FeedCircles from "../FeedCircles";
import Tooltip from "./Tooltip";

const { width, height } = Dimensions.get("window");

@inject("feed")
@observer
export default class FeedSettingsTooltipModal extends React.PureComponent {
  close = () => {
    this.props.modal.closeModal();
  };

  complete = () => {
    this.props.feed.set("FeedSettingsOpen", true);
    this.props.modal.openModal("FeedSettings");
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
            title="фильтр"
            caption="в фильтрах ты можешь выбрать подходящие для себя настройки, чтобы поиск людей стал ещё интереснее"
            button="выбрать фильтры"
            onComplete={this.complete}
          />

          <ButtonContainer>
            <Button>
              <FeedCircles />
            </Button>
          </ButtonContainer>
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
  bottom: ${getBottomSpace() + verticalScale(40) + `px`};
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

const Button = styled.View`
  padding-top: ${scale(8) + `px`};
  padding-bottom: ${scale(8) + `px`};
  padding-left: ${scale(8) + `px`};
  padding-right: ${scale(8) + `px`};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 10px;
`;
