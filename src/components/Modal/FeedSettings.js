import React from "react";
import { inject, observer } from "mobx-react";
import { TouchableOpacity, Dimensions } from "react-native";
import * as NavigationService from "../../service/Navigation";
import { getBottomSpace } from "react-native-iphone-x-helper";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import { Switch } from "react-native-paper";
import FeedCircles from "../FeedCircles";
import FeedGenderTabs from "../FeedGenderTabs";
import images from "../../constants/images";

const { width, height } = Dimensions.get("screen");

@inject("feed")
@observer
export default class FeedSettingsModal extends React.PureComponent {
  complete = () => {
    this.close();
  };

  close = () => {
    this.props.feed.set("FeedSettingsOpen", false);
    this.props.modal.closeModal();
  };

  render() {
    return (
      <>
        <TouchableOpacity
          onPress={this.complete}
          activeOpacity={0.9}
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <ModalContainer />
        </TouchableOpacity>
        <BottomContainer>
          <SettingsContainer>
            <SwitchContainer>
              <SwitchWrapper>
                <Switch
                  value={this.props.feed.RestrictUniversity}
                  onValueChange={() => {
                    this.props.feed.toggle("RestrictUniversity");
                  }}
                  color={"#525A71"}
                />
              </SwitchWrapper>
              <SwitchCaption>
                смотреть студентов только из моего универсиитета
              </SwitchCaption>
            </SwitchContainer>
            <FeedGenderTabs />
          </SettingsContainer>

          <TouchableOpacity
            onPress={this.complete}
            activeOpacity={0.9}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <ButtonContainer>
              <Button>
                <FeedCircles />
                <ButtonText>смотреть анкеты</ButtonText>
              </Button>
            </ButtonContainer>
          </TouchableOpacity>
        </BottomContainer>
      </>
    );
  }
}

const BottomContainer = styled.View`
  width: ${width - scale(10) + `px`};
  margin-left: ${scale(5) + `px`};
  margin-right: ${scale(5) + `px`};
  position: absolute;
  z-index: 11000;
  bottom: ${getBottomSpace() + verticalScale(40) + `px`};
`;

const SettingsContainer = styled.View`
  width: ${width - scale(10) + `px`};
  padding-top: ${verticalScale(20) + `px`};
  padding-bottom: ${verticalScale(20) + `px`};
  padding-left: ${scale(10) + `px`};
  padding-right: ${scale(10) + `px`};
  margin-bottom: ${verticalScale(25) + `px`};
  border: 1px solid #525a71;
  border-radius: 10px;
  background: #fff;
`;

const SwitchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${verticalScale(20) + `px`};
`;

const SwitchWrapper = styled.View`
  height: ${verticalScale(40) + `px`};
  justify-content: center;
  margin-right: ${scale(15) + `px`};
`;

const SwitchCaption = styled.Text`
  max-width: ${width * 0.7 + `px`};
  font-size: ${scale(16) + `px`};
  line-height: ${scale(20) + `px`};
  font-family: "IBMPlexMono";
  color: #525a71;
`;

const ModalContainer = styled.View`
  width: ${width + `px`};
  height: ${height + `px`};
  flex: 1;
  flex-direction: row;
  overflow: hidden;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Button = styled.View`
  padding-top: ${scale(8) + `px`};
  padding-bottom: ${scale(8) + `px`};
  padding-left: ${scale(8) + `px`};
  padding-right: ${scale(12) + `px`};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: ${scale(1) + `px solid #E6E6E6`};
  border-radius: 10px;
`;

const ButtonText = styled.Text`
  margin-left: ${scale(4) + `px`};
  font-size: ${scale(16) + `px`};
  line-height: ${scale(16) + `px`};
  font-family: "IBMPlexMono";
  color: #3b435a;
`;
