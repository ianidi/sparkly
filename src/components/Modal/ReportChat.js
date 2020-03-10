import React from "react";
import { inject, observer } from "mobx-react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Alert
} from "react-native";
import { Modalize } from "react-native-modalize";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";

const { width } = Dimensions.get("window");

@inject("feed")
@observer
export default class ReportModal extends React.PureComponent {
  modal = React.createRef();

  openModal = () => {
    if (this.modal.current) {
      this.modal.current.open();
    }
  };

  closeModal = () => {
    if (this.modal.current) {
      this.modal.current.close();
    }
  };

  report = async index => {
    const result = await this.props.feed.Report(index, "chat");

    if (result) {
      Alert.alert(
        "Жалоба отправлена",
        "Ваша жалоба будет рассмотрена в течение 24 часов. Мы не извещаем о резульатах рассмотрения. Однако в случае удовлетворения жалобы к нарушителю будут применены меры.",
        [{ text: "OK", onPress: this.closeModal }]
      );
    }
  };

  renderContent = () => [
    <View style={s.content__header} key="0">
      <Title>Пожаловаться на сообщения</Title>
      <Text style={s.content__subheading}>
        Обратите внимание: жалоба — это не дизлайк. Жалуйтесь на сообщения
        только в том случае, если собеседник нарушает правила сервиса.
      </Text>
    </View>,

    <View key="1">
      {reasons.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => this.report(index)}
          activeOpacity={0.9}
          style={{
            marginBottom: verticalScale(10)
          }}
        >
          <ReasonContainer>
            <ReasonText>{item}</ReasonText>
          </ReasonContainer>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        onPress={this.closeModal}
        activeOpacity={0.9}
        style={{
          marginBottom: verticalScale(15)
        }}
      >
        <ReasonContainer>
          <ReasonTextCancel>Отменить жалобу</ReasonTextCancel>
        </ReasonContainer>
      </TouchableOpacity>
    </View>
  ];

  render() {
    return (
      <Modalize
        ref={this.modal}
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
          stickyHeaderIndices: [0]
        }}
      >
        {this.renderContent()}
      </Modalize>
    );
  }
}

const reasons = [
  "Спам",
  "Изображения обнаженного тела или действия сексуального характера",
  "Враждебные высказывания или символы",
  "Насилие или опасные организации",
  "Продажа незаконных или подлежащих правовому регулированию товаров",
  "Травля или преследования",
  "Самоубийство, нанесение себе увечий или и расстройства пищеварения",
  "Мошенничество или обман"
];

const Title = styled.Text`
  font-size: ${scale(24) + `px`};
  line-height: ${scale(28) + `px`};
  margin-top: ${verticalScale(10) + `px`};
  margin-bottom: ${verticalScale(10) + `px`};
  font-family: "Cormorant-Regular";
  color: #525a71;
`;

const ReasonContainer = styled.View`
  padding-top: ${verticalScale(5) + `px`};
  padding-bottom: ${verticalScale(5) + `px`};
  padding-left: ${verticalScale(15) + `px`};
  padding-right: ${verticalScale(15) + `px`};
`;

const ReasonText = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(20) + `px`};
  font-family: "IBMPlexSans";
  color: #3b435a;
`;

const ReasonTextCancel = styled.Text`
  font-size: ${scale(16) + `px`};
  line-height: ${scale(20) + `px`};
  font-family: "IBMPlexSans";
  color: red;
`;

const s = StyleSheet.create({
  content__header: {
    padding: scale(15),
    paddingBottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  },
  content__subheading: {
    marginBottom: 20,
    fontSize: 16,
    color: "#ccc"
  }
});
