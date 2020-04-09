import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {
  TouchableOpacity,
  Dimensions,
  FlatList,
  BackHandler,
  Button,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import SafeAreaView from "react-native-safe-area-view";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import images from "../constants/images";
import ChatDialog from "../components/ChatDialog";
import NewMatch from "../components/NewMatch";
//
import { connect } from "react-redux";
import store from "../chat/store";
import ChatService from "../chat/services/chat-service";
import AuthService from "../chat/services/auth-service";
import Indicator from "../chat/screens/components/indicator";
import PushNotificationService from "../chat/services/push-notification";

const { width, height } = Dimensions.get("window");

@inject("main")
@inject("member")
@observer
class Dialogs extends Component {
  //
  ChatToken = async () => {
    let res = await this.props.member.ChatToken();
  };
  //
  //
  //
  static currentUserInfo = "";
  dialogs = [];
  //
  constructor(props) {
    super(props);

    this.state = {
      isLoader: props.dialogs.length === 0 && true,
      inputFocused: true,
      loading: false,
      refreshing: false,
    };

    this.initChat();
  }

  initChat = async () => {
    const loggedIn = await AuthService.init();
    if (loggedIn) {
      ChatService.setUpListeners();
    } else {
      await this.chatLogin();
    }

    ChatService.fetchDialogsFromServer().then(() => {
      PushNotificationService.init(this.props.navigation);
    });
  };

  chatLogin = async () => {
    const dataUser = {
      full_name: this.props.member.ChatLogin,
      login: this.props.member.ChatLogin,
      password: this.props.member.ChatPassword,
    };

    AuthService.signIn(dataUser)
      .then(() => {
        ChatService.setUpListeners();
      })
      .catch((error) => {
        console.log(`Error.\n\n${JSON.stringify(error)}`);
      });
  };

  /*static getDerivedStateFromProps(props, state) {
    if (
      props.currentUser.user.full_name !== Dialogs.currentUserInfo.full_name
    ) {
      Dialogs.currentUserInfo = { ...props.currentUser.user };
      return true;
    }
    return null;
  }*/

  componentDidMount = () => {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.arrowBackPress();
      return true;
    });
  };

  componentDidUpdate(prevProps) {
    const { dialogs } = this.props;
    if (this.props.dialogs !== prevProps.dialogs) {
      this.dialogs = dialogs;
      this.setState({ isLoader: false });
    }
  }

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

  handleDialogPress = (dialog) => {
    this.props.navigation.navigate("Chat", dialog);
  };

  //this.props.mainStore.set('dialogID', dialog.id);
  //this.props.mainStore.set('dialogUserID', dialog.to.id);
  //this.props.mainStore.set('dialogUserPhone', String(dialog.to.phone));
  /*
  keyExtractor = (item, index) => index.toString();

  _renderDialog = ({ item }) => {
    return <Dialog dialog={item} navigation={this.props.navigation} />;
  };*/

  renderHeader = () => {
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={this.arrowBackPress}
          style={{
            position: "absolute",
            top: verticalScale(23) + getStatusBarHeight(),
            left: scale(19),
          }}
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <ArrowBack source={images.AuthArrowBack} />
        </TouchableOpacity>
        <Title>сообщения</Title>
        {/*<Button onPress={() => this.cometchatLogin()} title={"fgdfd"} />
        <Button onPress={() => this.ChatToken()} title={"ChatToken"} />*/}
      </>
    );
  };

  render() {
    // Dialogs.currentUserInfo = { ...store.getState().currentUser.user };

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#fff",
          width: width,
          paddingRight: scale(16),
        }}
      >
        {this.renderHeader()}

        <FlatList
          ListEmptyComponent={() => (
            <NoMessages>здесь будут появляться ваши сообщения</NoMessages>
          )}
          //ListHeaderComponent={() => <NewMatch />}
          ListFooterComponent={() =>
            !!this.dialogs.length ? <Divider /> : null
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: scale(24),
          }}
          ItemSeparatorComponent={() => <Divider />}
          data={this.dialogs}
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
          //onRefresh={() => {
          //  this.refresh();
          //}}
          refreshing={this.state.isLoader}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({ dialogs, currentUser }) => ({
  dialogs,
  currentUser,
});

export default connect(mapStateToProps)(Dialogs);

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
