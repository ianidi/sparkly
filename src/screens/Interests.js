import React from "react";
import { inject, observer } from "mobx-react";
import {
  TouchableOpacity,
  Dimensions,
  ScrollView,
  BackHandler
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import images from "../constants/images";

const { width, height } = Dimensions.get("screen");

@inject("main")
@inject("member")
@observer
export default class MessagesScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showButton: true,
      interests: [
        {
          InterestID: 1,
          Title: "ум и креативность",
          Selected: false
        },
        {
          InterestID: 2,
          Title: "автомобили",
          Selected: true
        },
        {
          InterestID: 3,
          Title: "искусство",
          Selected: false
        },
        {
          InterestID: 4,
          Title: "музеи",
          Selected: false
        },
        {
          InterestID: 5,
          Title: "туризм",
          Selected: true
        }
      ]
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

  setInterest = index => {
    this.setState(prev => {
      let record = prev.Interests;
      return {
        Interests: [...prev.Interests, record]
      };
    });
  };

  continue = () => {
    //this.props.member.set("Faculty", this.state.Faculty);
    //this.props.member.FacultySelect();
  };

  renderHeader = () => {
    return (
      <>
        <TouchableOpacity
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
        </TouchableOpacity>
        <Title>увлечения и хобби</Title>
        <Interests>
          {this.state.interests.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              onPress={() => {
                //this.setInterest(index);
              }}
            >
              <InterestContainer
                style={{
                  backgroundColor: item.Selected ? "#6E7588" : "#fff"
                }}
              >
                <InterestText
                  style={{
                    color: item.Selected ? "#fff" : "#252e48"
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
          paddingRight: scale(15)
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderHeader()}
        </ScrollView>
        <TouchableOpacity
          onPress={this.continue}
          activeOpacity={0.9}
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <Button
            style={{
              borderWidth: this.state.showButton ? scale(1) : 0,
              borderColor: "#525A71"
            }}
          >
            <ButtonText
              style={{
                color: this.state.showButton ? "#3b435a" : "#9499A7"
              }}
            >
              далее
            </ButtonText>
            {this.state.showButton && (
              <ButtonCircle
                style={{
                  backgroundColor: "#F5CFD0"
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
  margin-top: ${verticalScale(65) + `px`};
  margin-bottom: ${verticalScale(25) + `px`};
  margin-left: ${scale(25) + `px`};
  font-family: "Cormorant-Regular";
  color: #525a71;
`;

const Skip = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(24) + `px`};
  text-align: right;
  font-family: "IBMPlexSans";
  color: #9499a7;
`;

const Interests = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const InterestContainer = styled.View`
  padding-top: ${scale(16) + `px`};
  padding-bottom: ${scale(16) + `px`};
  padding-left: ${scale(20) + `px`};
  padding-right: ${scale(20) + `px`};
  margin-right: ${scale(9) + `px`};
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
  margin-top: ${verticalScale(40) + `px`};
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
