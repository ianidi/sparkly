import React from "react";
import { inject, observer } from "mobx-react";
import {
  TouchableOpacity,
  Dimensions,
  ScrollView,
  BackHandler,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import * as Progress from "react-native-progress";
import ProgressBar from "../components/ProgressBar";
import {
  hobby,
  sport,
  people,
  goals,
  cinema,
  food,
  music,
} from "../constants/interests";

const { width, height } = Dimensions.get("window");

@inject("main")
@inject("member")
@observer
export default class MessagesScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      screen: "hobby",
      title: "увлечения и хобби",
      interests: hobby,
      showButton: true,
      selected: [],
      loading: false,
      progress: 14,
    };
  }

  increase = (key, value) => {
    this.setState({
      [key]: this.state[key] + value,
    });
  };

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

  setInterest = (index) => {
    this.setState((prev) => {
      let copy = [...prev.interests];
      copy[index].Selected = !copy[index].Selected;
      return {
        interests: [...copy],
      };
    });
  };

  continue = async () => {
    if (this.state.loading) {
      return;
    }

    this.setState({ loading: true });

    let data = this.state.interests.filter((item) => item.Selected == true);
    let array = [];

    Object.keys(data).map(function (key) {
      array.push(data[key].InterestTitle);
    });

    let result = await this.props.member.InterestsUpdate(
      this.state.screen,
      JSON.stringify(array)
    );

    this.setState({ loading: false });

    if (result == false) {
      return;
    }

    let nextScreen, title, interests, progress;

    if (this.state.screen == "hobby") {
      nextScreen = "sport";
      interests = sport;
      title = "спорт и здоровье";
      progress = 28;
    }
    if (this.state.screen == "sport") {
      nextScreen = "people";
      interests = people;
      title = "главное в людях";
      progress = 42;
    }
    if (this.state.screen == "people") {
      nextScreen = "goals";
      interests = goals;
      title = "главное в жизни";
      progress = 56;
    }
    if (this.state.screen == "goals") {
      nextScreen = "cinema";
      interests = cinema;
      title = "кино";
      progress = 70;
    }
    if (this.state.screen == "cinema") {
      nextScreen = "food";
      interests = food;
      title = "любимая кухня";
      progress = 84;
    }
    if (this.state.screen == "food") {
      nextScreen = "music";
      interests = music;
      title = "музыка";
      progress = 100;
    }
    if (this.state.screen == "music") {
      this.props.member.set("InterestsComplete", true);
      this.props.navigation.goBack();
    } else {
      this.setState(
        {
          screen: nextScreen,
          title: title,
          interests: interests,
          selected: [],
          progress: progress,
        },
        this.scroll
      );
    }
  };

  scroll = () => {
    this.scrollView.scrollTo({ x: 0, y: 0, animated: false });
  };

  renderInterests = () => {
    return (
      <>
        <Interests>
          {this.state.interests.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              onPress={() => {
                this.setInterest(index);
              }}
            >
              <InterestContainer
                style={{
                  backgroundColor: item.Selected ? "#6E7588" : "#fff",
                }}
              >
                <InterestText
                  style={{
                    color: item.Selected ? "#fff" : "#252e48",
                  }}
                >
                  {item.Title}
                </InterestText>
              </InterestContainer>
            </TouchableOpacity>
          ))}
        </Interests>
      </>
    );
  };

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#fff",
          width: width,
          paddingLeft: scale(15),
          paddingRight: scale(15),
        }}
      >
        <ProgressBar
          value={this.state.progress}
          backgroundColorOnComplete="#6CC644"
        />
        {this.state.loading && (
          <Progress.Circle
            indeterminate={true}
            color="#525A71"
            borderWidth={2}
            style={{
              position: "absolute",
              top: getStatusBarHeight() + verticalScale(10),
              right: scale(20),
            }}
          />
        )}
        {/*<TouchableOpacity
        activeOpacity={0.9}
        onPress={this.arrowBackPress}
        style={{
          position: "absolute",
          top: verticalScale(23),
          left: scale(3)
        }}
        hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <ArrowBack source={images.AuthArrowBack} />
      </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={this.arrowBackPress}
          style={{
            position: "absolute",
            top: verticalScale(23),
            right: scale(3)
          }}
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <Skip>пропустить</Skip>
        </TouchableOpacity>*/}
        <Title>{this.state.title}</Title>
        <ScrollView ref={(ref) => (this.scrollView = ref)}>
          {this.renderInterests()}
        </ScrollView>
        <TouchableOpacity onPress={this.continue} activeOpacity={0.9}>
          <Button
            style={{
              borderWidth: this.state.showButton ? scale(1) : 0,
              borderColor: "#525A71",
            }}
          >
            {this.state.progress == 100 ? (
              <ButtonText
                style={{
                  color: this.state.showButton ? "#3b435a" : "#9499A7",
                }}
              >
                готово
              </ButtonText>
            ) : (
              <ButtonText
                style={{
                  color: this.state.showButton ? "#3b435a" : "#9499A7",
                }}
              >
                далее
              </ButtonText>
            )}

            {this.state.showButton && (
              <ButtonCircle
                style={{
                  backgroundColor: "#F5CFD0",
                }}
              />
            )}
          </Button>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const ArrowBack = styled.Image`
  width: ${scale(24) + `px`};
  height: ${scale(24) + `px`};
`;

const Title = styled.Text`
  font-size: ${scale(46) + `px`};
  line-height: ${scale(46) + `px`};
  margin-top: ${verticalScale(25) + `px`};
  margin-bottom: ${verticalScale(25) + `px`};
  margin-left: ${scale(25) + `px`};
  font-family: "Cormorant-Regular";
  color: #525a71;
`;

const Skip = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(16) + `px`};
  margin-right: ${scale(20) + `px`};
  font-family: "IBMPlexSans";
  color: #9499a7;
`;
//text-align: right;

const Interests = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const InterestContainer = styled.View`
  padding-top: ${scale(16) + `px`};
  padding-bottom: ${scale(16) + `px`};
  padding-left: ${scale(8) + `px`};
  padding-right: ${scale(8) + `px`};
  margin-right: ${scale(4) + `px`};
  margin-bottom: ${verticalScale(15) + `px`};
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
  elevation: 2;
  border-radius: 10px;
`;

const InterestText = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(16) + `px`};
  text-align: center;
  font-family: "IBMPlexMono";
`;

const Button = styled.View`
  width: ${width - scale(32) + `px`};
  padding-top: ${scale(25) + `px`};
  padding-bottom: ${scale(25) + `px`};
  margin-top: ${verticalScale(20) + `px`};
  margin-bottom: ${verticalScale(20) + `px`};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: #fff;
`;

const ButtonText = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(16) + `px`};
  font-family: "IBMPlexMono";
`;

const ButtonCircle = styled.View`
  position: absolute;
  z-index: -1;
  width: ${scale(50) + `px`};
  height: ${scale(50) + `px`};
  border-radius: 100px;
`;
