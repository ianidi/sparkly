import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { connect } from "react-redux";
import AttachmentIcon from "react-native-vector-icons/Entypo";
import { AutoGrowingTextInput } from "react-native-autogrow-textinput";
import ChatService from "../chat/services/chat-service";
import Message from "../chat/screens/main/chat/message";
import ImagePicker from "react-native-image-crop-picker";
import { scale } from "react-native-size-matters";
import images from "../constants/images";
import ChatHeader from "../components/ChatHeader";

const { width, height } = Dimensions.get("window");

export class Chat extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activIndicator: true,
      messageText: "",
    };
  }

  needToGetMoreMessage = null;

  componentDidMount() {
    const dialog = this.props.route.params;
    ChatService.getMessages(dialog)
      .catch((e) => alert(`Error.\n\n${JSON.stringify(e)}`))
      .then((amountMessages) => {
        console.log("amountMessages", amountMessages);
        amountMessages === 100
          ? (this.needToGetMoreMessage = true)
          : (this.needToGetMoreMessage = false);
        this.setState({ activIndicator: false });
      });
  }

  componentWillUnmount() {
    ChatService.resetSelectedDialogs();
  }

  getMoreMessages = () => {
    const dialog = this.props.route.params;
    if (this.needToGetMoreMessage) {
      this.setState({ activIndicator: true });
      ChatService.getMoreMessages(dialog).then((amountMessages) => {
        amountMessages === 100
          ? (this.needToGetMoreMessage = true)
          : (this.needToGetMoreMessage = false);
        this.setState({ activIndicator: false });
      });
    }
  };

  onTypeMessage = (messageText) => this.setState({ messageText });

  sendMessage = async () => {
    const dialog = this.props.route.params;
    const { messageText } = this.state;
    if (messageText.length <= 0) return;
    await ChatService.sendMessage(dialog, messageText);
    this.setState({ messageText: "" });
  };

  sendAttachment = async () => {
    const dialog = this.props.route.params;
    const img = await this.onPickImage();
    ChatService.sendMessage(dialog, "", img);
  };

  onPickImage = () => {
    return ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      return image;
    });
  };

  _keyExtractor = (item, index) => index.toString();

  _renderMessageItem(message) {
    const { user } = this.props.currentUser;
    const isOtherSender = message.sender_id !== user.id ? true : false;
    return (
      <Message otherSender={isOtherSender} message={message} key={message.id} />
    );
  }

  render() {
    const { history } = this.props;
    const { messageText, activIndicator } = this.state;

    return (
      <SafeAreaView
        style={{
          flex: 1,
          width: width,
        }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: "#fff" }}
          behavior={Platform.OS === "ios" ? "padding" : null}
          //keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 100}
        >
          {activIndicator && (
            <View style={styles.indicator}>
              <ActivityIndicator size="large" color="#525A71" />
            </View>
          )}
          <ChatHeader name={this.props.route.params.name} />
          <FlatList
            inverted
            data={history}
            keyExtractor={this._keyExtractor}
            renderItem={({ item }) => this._renderMessageItem(item)}
            onEndReachedThreshold={5}
            onEndReached={this.getMoreMessages}
            style={{
              paddingBottom: 2,
            }}
          />
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <AutoGrowingTextInput
                style={styles.textInput}
                placeholder="Сообщение"
                placeholderTextColor="#9499A7"
                value={messageText}
                onChangeText={this.onTypeMessage}
                maxHeight={170}
                minHeight={scale(40)}
                enableScrollToCaret
              />
              <TouchableOpacity style={styles.attachment}>
                <AttachmentIcon
                  name="attachment"
                  size={22}
                  color="#8c8c8c"
                  onPress={this.sendAttachment}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                ...styles.button,
                backgroundColor:
                  this.state.messageText.length > 0 ? "#F5CFD0" : "#fff",
              }}
              onPress={this.sendMessage}
              activeOpacity={0.9}
            >
              <Image
                style={{ width: scale(20), height: scale(20) }}
                source={images.ChatSend}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingTop: scale(2),
    paddingBottom: scale(6),
    paddingLeft: scale(15),
    paddingRight: scale(15),
  },
  activityIndicator: {
    position: "absolute",
    alignSelf: "center",
    paddingTop: 25,
  },
  textInput: {
    width: width - scale(82),
    fontSize: 17,
    fontWeight: "300",
    color: "#252E48",
    paddingHorizontal: 12,
    paddingTop: scale(8),
    paddingBottom: scale(8),
    paddingRight: 35,
    backgroundColor: "#fff",
    borderWidth: scale(1),
    borderColor: "#525A71",
  },
  button: {
    width: scale(40),
    height: scale(40),
    marginLeft: scale(12),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: scale(1),
    borderColor: "#525A71",
  },
  attachment: {
    width: scale(40),
    height: scale(40),
    position: "absolute",
    right: 5,
    bottom: 0,
    marginLeft: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  inputContainer: {
    flexDirection: "row",
  },
});

const mapStateToProps = (state, props) => ({
  history: state.messages[props.route.params.id],
  currentUser: state.currentUser,
});

export default connect(mapStateToProps)(Chat);
