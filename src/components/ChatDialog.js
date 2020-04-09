import React from "react";
import { inject, observer } from "mobx-react";
import { LayoutAnimation, Dimensions, Alert } from "react-native";
import styled from "styled-components";
import { scale, verticalScale } from "react-native-size-matters";
import images from "../constants/images";
import moment from "moment";
import "moment/locale/ru";
import { fromUnixTime } from "date-fns";

const { width, height } = Dimensions.get("window");

const CustomLayoutAnimation = {
  duration: 200,
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
  },
};

@inject("main")
@inject("member")
@observer
export default class ChatDialog extends React.Component {
  //componentWillMount() {
  //  LayoutAnimation.configureNext(CustomLayoutAnimation);
  //}

  handlePin = () => {
    this.props.item.pin();
  };

  handleRemove = () => {
    try {
      Alert.alert(
        "Удаление диалога",
        "Удалить диалог?",
        [
          {
            text: "Не удалять",
            style: "cancel",
          },
          {
            text: "Удалить",
            onPress: () => {
              this.removeItem();
            },
          },
        ],
        { cancelable: false }
      );
    } catch (err) {}
  };

  removeItem = () => {
    this.props.item.remove();
  };

  render() {
    const { dialog } = this.props;
    const info = this.props.member.dialogGet(dialog.name);

    return (
      <Container>
        <ImagesContainer>
          {info["AvatarURI"] != null && info["AvatarURI"] != "" ? (
            <AvatarContainer>
              <AvatarImage source={{ uri: info["AvatarURI"] }} />
            </AvatarContainer>
          ) : (
            <MemberCircle
              style={{
                borderWidth: this.props.member.RoommateSearch ? scale(2) : 0,
                borderColor: "#FDE300",
              }}
            >
              <MemberImage source={images.Member} />
            </MemberCircle>
          )}
          {info["MatchCount"] > 0 ? (
            <MatchContainer
              style={{
                backgroundColor: "#984446",
              }}
            >
              <MatchText style={{ color: "#fff" }}>
                {info["MatchCount"]}
              </MatchText>
            </MatchContainer>
          ) : (
            <MatchContainer
              style={{
                backgroundColor: "#9499A7",
              }}
            >
              <MatchText style={{ color: "#252e48" }}>?</MatchText>
            </MatchContainer>
          )}
        </ImagesContainer>

        <Content>
          <TitleContainer>
            <Title>{info["Name"]}</Title>
            <Status>
              {false && <TickRead source={images.TickRead} />}
              {false && <NoTick />}
              {dialog.last_message != null && (
                <Date>
                  {moment(fromUnixTime(dialog.last_message_date_sent))
                    .locale("ru")
                    .format("H:mm")}
                </Date>
              )}
            </Status>
          </TitleContainer>
          <MessageContainer>
            {dialog.last_message != null ? (
              <Message numberOfLines={2}>{dialog.last_message}</Message>
            ) : (
              <MessageEmpty>Список сообщений пуст</MessageEmpty>
            )}
            {dialog.unread_messages_count > 0 && (
              <MessageCountContainer>
                <MessageCount>
                  <MessageCountText>
                    {dialog.unread_messages_count}
                  </MessageCountText>
                </MessageCount>
              </MessageCountContainer>
            )}
          </MessageContainer>
        </Content>
      </Container>
    );
  }
} /*{moment
              .unix(dialog.lastMessage.date)
              .locale("en")
              .format("HH:mm")}*/

const MemberCircle = styled.View`
  width: ${scale(40) + `px`};
  height: ${scale(40) + `px`};
  border-radius: 100px;
  background: #f0f0f0;
  align-items: center;
  justify-content: center;
`;

const MemberImage = styled.Image`
  width: ${scale(24) + `px`};
  height: ${scale(24) + `px`};
`;

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: ${width + `px`};
  padding-top: ${verticalScale(20) + `px`};
  padding-bottom: ${verticalScale(20) + `px`};
  padding-left: ${scale(15) + `px`};
  padding-right: ${scale(15) + `px`};
`;

const ImagesContainer = styled.View`
  margin-right: ${scale(10) + `px`};
  flex-direction: row;
`;

const AvatarContainer = styled.View`
  position: relative;
  z-index: 2000;
  width: ${scale(40) + `px`};
  height: ${scale(40) + `px`};
  border-radius: 100px;
  overflow: hidden;
`;

const MatchContainer = styled.View`
  width: ${scale(40) + `px`};
  height: ${scale(40) + `px`};
  align-items: center;
  justify-content: center;
  margin-left: ${scale(-10) + `px`};
  border-radius: 100px;
`;

const MatchText = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(24) + `px`};
  font-family: "IBMPlexSans-Medium";
`;

const AvatarImage = styled.Image`
  width: ${scale(40) + `px`};
  height: ${scale(40) + `px`};
`;

const Content = styled.View`
  flex-direction: column;
  min-width: ${width * 0.67 + `px`};
`;

const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Status = styled.View`
  width: ${width * 0.26 + `px`};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(16) + `px`};
  font-family: "IBMPlexSans-Medium";
  color: #252e48;
`;

const NoTick = styled.View`
  width: ${scale(27) + `px`};
`;

const TickRead = styled.Image`
  width: ${scale(27) + `px`};
  height: ${scale(20) + `px`};
`;

const MessageContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
`;

const Message = styled.Text`
  width: ${width * 0.5 + `px`};
  font-size: ${scale(16) + `px`};
  line-height: ${scale(24) + `px`};
  font-family: "IBMPlexSans";
  color: #6e7588;
`;

const MessageCountContainer = styled.View`
  width: ${width * 0.17 + `px`};
  justify-content: center;
  align-items: flex-end;
  padding-right: ${scale(1) + `px`};
`;

const MessageCount = styled.View`
  justify-content: center;
  align-items: center;
  min-width: ${scale(35) + `px`};
  min-height: ${scale(35) + `px`};
  padding-top: ${scale(8) + `px`};
  padding-bottom: ${scale(8) + `px`};
  padding-left: ${scale(8) + `px`};
  padding-right: ${scale(8) + `px`};
  background: #252e48;
  border-radius: 100px;
`;

const MessageCountText = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(18) + `px`};
  font-family: "IBMPlexSans-Medium";
  text-align: center;
  color: #fff;
`;

const Date = styled.Text`
  width: ${width * 0.18 + `px`};
  font-size: ${scale(12) + `px`};
  line-height: ${scale(12) + `px`};
  font-family: "IBMPlexMono";
  color: #252e48;
  text-align: right;
`;

const MessageEmpty = styled.Text`
  font-size: ${scale(14) + `px`};
  line-height: ${scale(14) + `px`};
  font-family: "IBMPlexSerif-ExtraLightItalic";
  color: #999;
`;
