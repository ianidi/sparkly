import React, { Component } from "react";
import { StyleSheet, View, FlatList, Text, StatusBar } from "react-native";
import { connect } from "react-redux";
import store from "../store";
import Dialog from "./main/dialogs/elements/dialog";
import ChatService from "../services/chat-service";
import Indicator from "./components/indicator";
import PushNotificationService from "../services/push-notification";

class Dialogs extends Component {
  static currentUserInfo = "";
  dialogs = [];

  constructor(props) {
    super(props);
    this.state = {
      isLoader: props.dialogs.length === 0 && true
    };
  }

  componentDidMount() {
    ChatService.fetchDialogsFromServer().then(() => {
      PushNotificationService.init(this.props.navigation);
    });
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.currentUser.user.full_name !== Dialogs.currentUserInfo.full_name
    ) {
      Dialogs.currentUserInfo = { ...props.currentUser.user };
      return true;
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    const { dialogs } = this.props;
    if (this.props.dialogs !== prevProps.dialogs) {
      this.dialogs = dialogs;
      this.setState({ isLoader: false });
    }
  }

  keyExtractor = (item, index) => index.toString();

  _renderDialog = ({ item }) => {
    return <Dialog dialog={item} navigation={this.props.navigation} />;
  };

  render() {
    const { isLoader } = this.state;

    Dialogs.currentUserInfo = { ...store.getState().currentUser.user };

    return (
      <View style={styles.container}>
        <StatusBar barStyle={"dark-content"} />
        {isLoader ? (
          <Indicator color={"red"} size={40} />
        ) : this.dialogs.length === 0 ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ fontSize: 19 }}>No chats yet</Text>
          </View>
        ) : (
          <FlatList
            data={this.dialogs}
            keyExtractor={this.keyExtractor}
            renderItem={item => this._renderDialog(item)}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

const mapStateToProps = ({ dialogs, currentUser }) => ({
  dialogs,
  currentUser
});

export default connect(mapStateToProps)(Dialogs);
