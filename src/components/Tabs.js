import React from "react";
import { ButtonGroup } from "react-native-elements";
import { Text } from "react-native";
import styled from "styled-components/native";
import { verticalScale, scale } from "react-native-size-matters";

export default class BookingRoomList extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedIndex: 2
    };
    this.updateIndex = this.updateIndex.bind(this);
  }
  updateIndex(selectedIndex) {
    this.setState({ selectedIndex });
  }

  render() {
    const buttons = [
      { element: component1 },
      { element: component2 },
      { element: component3 }
    ];
    const { selectedIndex } = this.state;
    return (
      <ButtonGroup
        onPress={this.updateIndex}
        selectedIndex={selectedIndex}
        buttons={buttons}
        containerStyle={{
          height: verticalScale(56),
          backgroundColor: "#F2F2F2",
          padding: scale(4),
          borderRadius: 10,
          borderWidth: scale(1),
          borderColor: "#D9D9D9"
        }}
        buttonStyle={{
          backgroundColor: "transparent"
        }}
        selectedButtonStyle={{
          borderRadius: 10,
          backgroundColor: "#fff",
          borderWidth: scale(1),
          borderColor: "#D9D9D9"
        }}
        selectedTextStyle={
          {
            //
          }
        }
        textStyle={
          {
            //
          }
        }
        containerBorderRadius={10}
      />
    );
  }
}
const component1 = () => <Title>девушек</Title>;
const component2 = () => <Title>парней</Title>;
const component3 = () => <Title>всех</Title>;

const Title = styled.Text`
  font-size: ${scale(15) + `px`};
  line-height: ${scale(15) + `px`};
  font-family: "IBMPlexMono";
  color: #6e7588;
`;
