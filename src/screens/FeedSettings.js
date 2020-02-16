import React from "react";
import { inject, observer } from "mobx-react";
import {
  ScrollView,
  TouchableOpacity,
  Dimensions,
  BackHandler
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import images from "../constants/images";
import Tabs from "../components/Tabs";
import { Switch } from "react-native-paper";

const { width, height } = Dimensions.get("screen");

@inject("main")
@inject("auth")
@observer
export default class FeedSettingsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Notifications: false
    };
  }

  componentDidMount = () => {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.arrowBackPress();
      return true;
    });
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  arrowBackPress = () => {
    this.props.navigation.goBack();
  };

  complete = () => {
    this.props.navigation.navigate("University");
  };

  renderIntro = () => {
    const { Notifications } = this.state;

    return (
      <>
        <Title>настройка ленты</Title>
        <Delimiter />
        <SwitchContainer>
          <SwitchWrapper>
            <Switch
              value={Notifications}
              onValueChange={() => {
                this.setState({ Notifications: !Notifications });
              }}
              color={"#E6E6E6"}
              style
            />
          </SwitchWrapper>
          <SwitchCaption>
            смотреть студентов только из моего универсиитета
          </SwitchCaption>
        </SwitchContainer>
        <Tabs />
        <Delimiter />

        <CardContainer>
          <TouchableOpacity
            //onPress={() => NavigationService.navigate("Unlock")}
            activeOpacity={0.9}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <Card>
              <CardCircles>
                <CardCircle />
              </CardCircles>
              <CardTitle>любимое{"\n"}занятие</CardTitle>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            //onPress={() => NavigationService.navigate("Booking")}
            activeOpacity={0.9}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <Card>
              <CardCircles>
                <CardCircle />
              </CardCircles>
              <CardTitle>свободное{"\n"}время</CardTitle>
            </Card>
          </TouchableOpacity>
        </CardContainer>

        <CardContainer>
          <TouchableOpacity
            //onPress={() => NavigationService.navigate("Unlock")}
            activeOpacity={0.9}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <Card>
              <CardCircles>
                <CardCircle />
              </CardCircles>
              <CardTitle>студенческая{"\n"}жизнь</CardTitle>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            //onPress={() => NavigationService.navigate("Booking")}
            activeOpacity={0.9}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <Card>
              <CardCircles>
                <CardCircle />
              </CardCircles>
              <CardTitle>свободная{"\n"}категория</CardTitle>
            </Card>
          </TouchableOpacity>
        </CardContainer>

        <TouchableOpacity
          onPress={this.complete}
          activeOpacity={0.9}
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <Button>
            <ButtonCircle
              style={{
                backgroundColor: "#F5CFD0"
              }}
            />
            <ButtonText>смотреть ленту</ButtonText>
          </Button>
        </TouchableOpacity>
      </>
    );
  };

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#fff",
          width: width
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderIntro()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}
//<InfoImage source={images.Info} />

const Title = styled.Text`
  font-size: ${scale(44) + `px`};
  line-height: ${scale(44) + `px`};
  margin-top: ${verticalScale(24) + `px`};
  margin-left: ${scale(18) + `px`};
  margin-right: ${scale(18) + `px`};
  font-family: "Cormorant-Regular";
  color: #525a71;
`;

const Delimiter = styled.View`
  width: ${width + `px`};
  height: ${verticalScale(1) + `px`};
  margin-top: ${verticalScale(20) + `px`};
  margin-bottom: ${verticalScale(20) + `px`};
  background: #f2f2f2;
`;

const SwitchContainer = styled.View`
  flex-direction: row;
  width: ${width + `px`};
  align-items: center;
  justify-content: space-between;
  padding-left: ${scale(18) + `px`};
  padding-right: ${scale(18) + `px`};
  margin-bottom: ${verticalScale(20) + `px`};
`;

const SwitchWrapper = styled.View`
  width: ${scale(70) + `px`};
  height: ${verticalScale(40) + `px`};
  align-items: center;
  justify-content: center;
  margin-right: ${scale(15) + `px`};
`;

const SwitchCaption = styled.Text`
  width: ${width * 0.7 + `px`};
  font-size: ${scale(16) + `px`};
  line-height: ${scale(20) + `px`};
  font-family: "IBMPlexSans-Light";
  color: #9499a7;
`;

const Description = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(24) + `px`};
  margin-top: ${verticalScale(10) + `px`};
  margin-bottom: ${verticalScale(10) + `px`};
  font-family: "IBMPlexSans-Light";
  color: #252e48;
`;

const CardContainer = styled.View`
  width: ${width - 36 + `px`};
  margin-left: 18px;
  margin-right: 18px;
  margin-bottom: ${scale(9) + `px`};
  flex-direction: row;
  justify-content: space-between;
`;

const Card = styled.View`
  width: ${(width - 54) * 0.5 + `px`};
  padding-top: ${scale(14) + `px`};
  padding-left: ${scale(15) + `px`};
  padding-right: ${scale(18) + `px`};
  padding-bottom: ${scale(14) + `px`};
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
`;

const CardCircles = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${verticalScale(10) + `px`};
`;

const CardCircle = styled.View`
  width: ${scale(30) + `px`};
  height: ${scale(30) + `px`};
  background: #e6e6e6;
  border-radius: 100px;
`;

const InfoImage = styled.Image`
  width: ${scale(24) + `px`};
  height: ${scale(24) + `px`};
`;

const CardTitle = styled.Text`
  font-size: ${scale(15) + `px`};
  line-height: ${scale(19) + `px`};
  color: #3b435a;
  font-family: "IBMPlexSans-Light";
`;

const Button = styled.View`
  align-self: center;
  margin-top: ${verticalScale(20) + `px`};
  margin-bottom: ${verticalScale(20) + `px`};
  padding-top: ${verticalScale(8) + `px`};
  padding-bottom: ${verticalScale(8) + `px`};
  padding-left: ${verticalScale(12) + `px`};
  padding-right: ${verticalScale(12) + `px`};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: ${scale(1) + `px solid #E6E6E6`};
  border-radius: 10px;
`;

const ButtonText = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(16) + `px`};
  font-family: "IBMPlexMono";
  color: #3b435a;
`;

const ButtonCircle = styled.View`
  width: ${scale(30) + `px`};
  height: ${scale(30) + `px`};
  margin-right: ${scale(6) + `px`};
  border-radius: 100px;
`;
