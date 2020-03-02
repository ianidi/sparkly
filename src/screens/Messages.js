import React from "react";
import { inject, observer } from "mobx-react";
import {
  TouchableOpacity,
  Dimensions,
  FlatList,
  BackHandler
} from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import SafeAreaView from "react-native-safe-area-view";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import images from "../constants/images";
import ChatDialog from "../components/ChatDialog";
import NewMatch from "../components/NewMatch";

const { width, height } = Dimensions.get("screen");

@inject("main")
@inject("member")
@observer
export default class MessagesScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputFocused: true,
      loading: false,
      dialogs: [
        {
          to: {
            phone: "Алина"
          },
          lastMessage: {
            text: "fdsfdsfsdf ьлпдавь дльп длваьпдлвапь длпвьа дпльвадл"
          }
        },
        {
          to: {
            phone: "Сергей"
          },
          lastMessage: {
            text: "длваьпдлвапь длпвьа"
          }
        },
        {
          to: {
            phone: "Сергей"
          },
          lastMessage: {
            text: "длваьпдлвапь длпвьа"
          }
        }
      ],
      refreshing: false
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

  inputBlur = () => {
    this.setState({ inputFocused: false });
  };

  refresh = async () => {
    this.setState({ refreshing: true });
    //await this.getDialogsList();
    this.setState({ refreshing: false });
  };

  handleDialogPress = dialog => {
    this.props.navigation.navigate("Chat");
    //this.props.mainStore.set('dialogID', dialog.id);
    //this.props.mainStore.set('dialogUserID', dialog.to.id);
    //this.props.mainStore.set('dialogUserPhone', String(dialog.to.phone));
  };

  renderHeader = () => {
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={this.arrowBackPress}
          style={{
            position: "absolute",
            top: verticalScale(23) + getStatusBarHeight(),
            left: scale(19)
          }}
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <ArrowBack source={images.AuthArrowBack} />
        </TouchableOpacity>
        <Title>сообщения</Title>
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
          paddingRight: scale(16)
        }}
      >
        {this.renderHeader()}

        <FlatList
          ListEmptyComponent={() => (
            <NoMessages>здесь будут появляться ваши сообщения</NoMessages>
          )}
          ListHeaderComponent={() => <NewMatch />}
          ListFooterComponent={() =>
            !!this.state.dialogs.length ? <Divider /> : null
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: scale(24)
          }}
          ItemSeparatorComponent={() => <Divider />}
          data={this.state.dialogs}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                this.handleDialogPress(item);
              }}
            >
              <ChatDialog dialog={item} />
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => `${item.key}_${index}`}
          onRefresh={() => {
            this.refresh();
          }}
          refreshing={this.state.refreshing}
        />
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
  margin-bottom: ${verticalScale(10) + `px`};
  margin-left: ${scale(40) + `px`};
  font-family: "Cormorant-Regular";
  color: #525a71;
`;

const NoMessages = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(20) + `px`};
  margin-top: ${verticalScale(20) + `px`};
  margin-bottom: ${verticalScale(20) + `px`};
  margin-left: ${scale(40) + `px`};
  font-family: "IBMPlexMono";
  align-items: center;
  color: #3b435a;
`;

const Divider = styled.View`
  width: 100%;
  height: ${verticalScale(1) + `px`};
  background: #f2f2f2;
`;
