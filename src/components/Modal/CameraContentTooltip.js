import React from "react";
import { inject, observer } from "mobx-react";
import { TouchableOpacity, Dimensions } from "react-native";
import * as NavigationService from "../../service/Navigation";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import Tooltip from "./Tooltip";

const { width, height } = Dimensions.get("window");

@inject("feed")
@observer
export default class CameraContentTooltipModal extends React.PureComponent {
  complete = () => {
    //this.props.feed.set("FeedSettingsOpen", true);
    this.props.modal.closeModal();
  };

  render() {
    return (
      <>
        <ModalContainer>
          <TooltipContainer>
            <Tooltip
              title="будь осторожнее"
              caption="публикуй фото и видео, уместные для многогранной аудитории. запрещено размещать контент, который содержит откровенное или непристойное содержание. в противном случае аккаунт будет заблокирован."
              button="продолжить"
              onComplete={this.complete}
            />
          </TooltipContainer>
        </ModalContainer>
      </>
    );
  }
}

const ModalContainer = styled.View`
  width: ${width + `px`};
  height: ${height + `px`};
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const TooltipContainer = styled.View`
  width: ${width - scale(32) + `px`};
  margin-left: ${scale(15) + `px`};
  margin-right: ${scale(15) + `px`};
  margin-bottom: ${verticalScale(40) + `px`};
`;
