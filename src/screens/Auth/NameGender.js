import React from "react";
import { inject, observer } from "mobx-react";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  BackHandler
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import images from "../../constants/images";

const { width, height } = Dimensions.get("screen");

@inject("main")
@inject("member")
@observer
export default class NameGenderScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputFocused: true
    };
  }

  componentDidMount = () => {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      return true;
    });
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  onChangeNameInput = Name => {
    this.props.member.set("Name", Name);
  };

  continue = Gender => {
    this.props.member.set("Gender", Gender);
    this.props.member.NameGender();
  };

  inputBlur = () => {
    this.setState(
      { inputFocused: false },
      this.scrollView.scrollTo({ x: 0, y: 0, animated: true })
    );
  };

  renderName = () => {
    let showButton = false;

    if (
      typeof this.props.member.Name != "undefined" &&
      this.props.member.Name.length > 2
    ) {
      showButton = true;
    }

    return (
      <>
        <Title>привет, напиши{"\n"}свое имя</Title>

        <TextInput
          refInput={ref => {
            this.input = ref;
          }}
          style={{
            fontSize: scale(20),
            fontFamily: "IBMPlexSans-Light",
            color: "#252E48",
            marginLeft: scale(40)
          }}
          value={this.props.member.Name}
          onChangeText={Name => {
            this.onChangeNameInput(Name);
          }}
          onBlur={this.inputBlur}
          onFocus={() => this.setState({ inputFocused: true })}
          autoCompleteType="off"
          autoCorrect={false}
          autoFocus={true}
          allowFontScaling={false}
          textContentType={"name"}
        />
        <InputUnderline
          style={{ opacity: this.state.inputFocused ? 1 : 0.7 }}
        />
        <Caption>под этим именем тебя будут видеть в sparkly</Caption>
        {showButton && (
          <Button>
            <TouchableOpacity
              onPress={() => this.continue("f")}
              activeOpacity={0.9}
              hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <ButtonPart>
                <ButtonText>я девушка</ButtonText>
                <ButtonCircle
                  style={{
                    right: scale(22),
                    backgroundColor: "#f9a5c8"
                  }}
                />
              </ButtonPart>
            </TouchableOpacity>
            <ButtonDelimiter />
            <TouchableOpacity
              onPress={() => this.continue("m")}
              activeOpacity={0.9}
              hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <ButtonPart>
                <ButtonText>я парень</ButtonText>
                <ButtonCircle
                  style={{
                    right: scale(22),
                    backgroundColor: "#79BFF2"
                  }}
                />
              </ButtonPart>
            </TouchableOpacity>
          </Button>
        )}
      </>
    );
  };

  render() {
    let showButton = false;

    if (
      typeof this.props.member.Name != "undefined" &&
      this.props.member.Name.length > 2
    ) {
      showButton = true;
    }

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#fff",
          width: width,
          paddingRight: scale(16)
        }}
      >
        <ScrollView
          ref={ref => {
            this.scrollView = ref;
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={"handled"}
          contentContainerStyle={{
            minHeight:
              showButton && this.state.inputFocused
                ? height + verticalScale(40)
                : height + verticalScale(40)
          }}
          //onScrollBeginDrag={Keyboard.dismiss}
          //keyboardDismissMode={"on-drag"}
        >
          {this.renderName()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const Title = styled.Text`
  font-size: ${scale(46) + `px`};
  line-height: ${scale(46) + `px`};
  margin-top: ${verticalScale(65) + `px`};
  margin-bottom: ${verticalScale(40) + `px`};
  margin-left: ${scale(40) + `px`};
  font-family: "Cormorant-Regular";
  color: #525a71;
`;

const InputUnderline = styled.View`
  margin-top: ${verticalScale(10) + `px`};
  margin-left: ${scale(40) + `px`};
  width: 100%;
  height: ${verticalScale(2) + `px`};
  background: #9499a7;
`;

const Caption = styled.Text`
  font-size: ${scale(12) + `px`};
  line-height: ${scale(16) + `px`};
  margin-top: ${verticalScale(10) + `px`};
  margin-bottom: ${verticalScale(10) + `px`};
  margin-left: ${scale(40) + `px`};
  font-family: "IBMPlexMono";
  color: #6e7588;
`;

const Button = styled.View`
  width: ${width - scale(32) + `px`};
  height: ${verticalScale(90) + `px`};
  margin-top: ${verticalScale(40) + `px`};
  margin-bottom: ${verticalScale(20) + `px`};
  margin-left: ${scale(16) + `px`};
  margin-right: ${scale(16) + `px`};
  flex-direction: row;
  align-items: center;
  background: #fff;
  border: ${scale(1) + `px solid #525A71`};
`;

const ButtonPart = styled.View`
  width: ${(width - scale(32)) / 2 - scale(1) + `px`};
  height: ${verticalScale(90) + `px`};
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(16) + `px`};
  font-family: "IBMPlexMono";
  color: #3b435a;
`;

const ButtonCircle = styled.View`
  position: absolute;
  z-index: -1;
  width: ${scale(40) + `px`};
  height: ${scale(40) + `px`};
  border-radius: 100px;
`;

const ButtonDelimiter = styled.View`
  width: ${scale(1) + `px`};
  height: ${verticalScale(90) + `px`};
  background: #525a71;
`;
