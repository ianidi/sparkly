import React, { PureComponent } from "react";
import { View, SafeAreaView, TouchableOpacity, Text } from "react-native";
import {
  Chat,
  //Channel,
  //MessageList,
  //MessageInput,
  ChannelList
  //Thread,
  //CloseButton,
  //ChannelPreviewMessenger
} from "../components/Chat";

// Read more about style customizations at - https://getstream.io/chat/react-native-chat/tutorial/#custom-styles
const theme = {
  avatar: {
    image: {
      size: 32
    }
  },
  colors: {
    primary: "magenta"
  },
  spinner: {
    css: `
      width: 15px;
      height: 15px;
    `
  }
};

const user = {
  id: "billowing-firefly-8",
  name: "Billowing firefly",
  image:
    "https://stepupandlive.files.wordpress.com/2014/09/3d-animated-frog-image.jpg"
};

const filters = { type: "messaging" };
const sort = { last_message_at: -1 };
const options = {
  state: true,
  watch: true
};

export default class ChannelListScreen extends PureComponent {
  //Channel List

  render() {
    return (
      <SafeAreaView>
        <View style={{ display: "flex", height: "100%", padding: 10 }}>
          <ChannelList
            filters={filters}
            sort={sort}
            options={options}
            Preview={ChannelPreviewMessenger}
            onSelect={channel => {
              this.props.navigation.navigate("Channel", {
                channel
              });
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}
/*
          <Chat client={chatClient} style={theme}>
        </Chat>
        */
/*
class ChannelScreen extends PureComponent {
  //{channel.data.name}

  render() {
    const { navigation } = this.props;
    const channel = navigation.getParam("channel");

    return (
      <SafeAreaView>
        <Chat client={chatClient} style={theme}>
          <Channel client={chatClient} channel={channel}>
            <View style={{ display: "flex", height: "100%" }}>
              <MessageList
                onThreadSelect={thread => {
                  this.props.navigation.navigate("Thread", {
                    thread,
                    channel: channel.id
                  });
                }}
              />
              <MessageInput />
            </View>
          </Channel>
        </Chat>
      </SafeAreaView>
    );
  }
}

class ThreadScreen extends PureComponent {
  render() {
    const { navigation } = this.props;
    const thread = navigation.getParam("thread");
    const channel = chatClient.channel(
      "messaging",
      navigation.getParam("channel")
    );

    return (
      <SafeAreaView>
        <Chat client={chatClient}>
          <Channel
            client={chatClient}
            channel={channel}
            thread={thread}
            dummyProp="DUMMY PROP"
          >
            <View
              style={{
                display: "flex",
                height: "100%",
                justifyContent: "flex-start"
              }}
            >
              <Thread thread={thread} />
            </View>
          </Channel>
        </Chat>
      </SafeAreaView>
    );
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientReady: false
    };
  }

  async componentDidMount() {
    this.setState({
      clientReady: true
    });
  }
  render() {
    if (this.state.clientReady) return <AppContainer />;
    else return null;
  }
}
*/
