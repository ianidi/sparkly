import React from "react";
import { inject, observer } from "mobx-react";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  BackHandler
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import { debounce } from "lodash";
import images from "../../constants/images";
import { api } from "../../service/Api";

const { width, height } = Dimensions.get("screen");

@inject("main")
@inject("auth")
@observer
export default class UniversityScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputFocused: true,
      loading: false,
      Search: "",
      University: [],
      SearchResult: []
    };
  }

  componentDidMount = () => {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.arrowBackPress();
      return true;
    });
    this.getUniversity();
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  arrowBackPress = () => {
    this.props.navigation.goBack();
  };

  //Получить список университетов
  getUniversity = async () => {
    try {
      this.setState({ loading: true });

      const response = await api.post("/signup/university/get");

      if (
        response.ok &&
        response.data.status == true &&
        response.data.University != null
      ) {
        this.setState({ University: response.data.University });
      }

      this.setState({ loading: false });
      return true;
    } catch (err) {
      this.setState({ loading: false });
      return false;
    }
  };

  onChangeSearchInput = Search => {
    this.setState({ Search: Search.toLowerCase() }, this.search);
  };

  search = debounce(function() {
    if (this.state.Search.length > 1) {
      this.getSearchResults();
    } else {
      this.setState({ SearchResult: [] });
    }
  }, 300);

  getSearchResults = async () => {
    try {
      this.setState({ loading: true });

      let filter = this.state.University.filter(el => {
        return (
          el.Title.toLowerCase().indexOf(this.state.Search) > -1 ||
          el.Abbr.toLowerCase().indexOf(this.state.Search) > -1
        );
      });
      this.setState({ SearchResult: filter });

      this.setState({ loading: false });
      return true;
    } catch (err) {
      this.setState({ loading: false });
      return false;
    }
  };

  //TODO: Получить результаты поиска
  getSearchResults1 = async () => {
    try {
      this.setState({ loading: true });

      const response = await api.post("/signup/university/search", {
        Search: this.state.Search
      });

      console.log(JSON.stringify(response.data));

      if (
        response.ok &&
        response.data.status == true &&
        response.data.University != null
      ) {
        this.setState({ University: response.data.University });
      }

      this.setState({ loading: false });
      return true;
    } catch (err) {
      this.setState({ loading: false });
      return false;
    }
  };

  select = (UniversityID, UniversityTitle, UniversityAbbr) => {
    this.props.auth.set("UniversityID", UniversityID);
    this.props.auth.set("UniversityTitle", UniversityTitle);
    this.props.auth.set("UniversityAbbr", UniversityAbbr);
    this.props.auth.UniversitySelect();
  };

  inputBlur = () => {
    this.setState({ inputFocused: false });
  };

  renderUniversity = () => {
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={this.arrowBackPress}
          style={{
            position: "absolute",
            top: verticalScale(23),
            left: scale(19)
          }}
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <ArrowBack source={images.AuthArrowBack} />
        </TouchableOpacity>

        <TextInput
          refInput={ref => {
            this.input = ref;
          }}
          style={{
            fontSize: scale(20),
            fontFamily: "IBMPlexSans-Light",
            color: "#252E48",
            marginTop: verticalScale(50),
            marginLeft: scale(40)
          }}
          onChangeText={Search => {
            this.onChangeSearchInput(Search);
          }}
          onBlur={this.inputBlur}
          onFocus={() => this.setState({ inputFocused: true })}
          autoCompleteType="off"
          autoCorrect={false}
          autoFocus={true}
          allowFontScaling={false}
          textContentType={"name"}
        />
        <InputUnderline
          style={{ opacity: this.state.inputFocused ? 1 : 0.7 }}
        />
        <Caption>например: московский государственный ..</Caption>
      </>
    );
  };
  //[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

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
        {this.renderUniversity()}
        <ScrollView
          //showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={"handled"}
          contentContainerStyle={{
            marginLeft: scale(40)
          }}
          onScrollBeginDrag={Keyboard.dismiss}
          keyboardDismissMode={"on-drag"}
        >
          {this.state.SearchResult.map((record, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                this.select(record.UniversityID, record.Title, record.Abbr)
              }
              activeOpacity={0.9}
            >
              <SearchItem>
                <SearchItemText>{record.Abbr}</SearchItemText>
                <SearchItemCaption>{CityName[record.CityID]}</SearchItemCaption>
              </SearchItem>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const CityName = { 1: "москва", 2: "2", 3: "3" };

const ArrowBack = styled.Image`
  width: ${scale(24) + `px`};
  height: ${scale(24) + `px`};
`;

const InputUnderline = styled.View`
  margin-top: ${verticalScale(10) + `px`};
  margin-left: ${scale(40) + `px`};
  width: ${width - scale(40) + `px`};
  height: ${verticalScale(2) + `px`};
  background: #9499a7;
`;

const Caption = styled.Text`
  font-size: ${scale(12) + `px`};
  line-height: ${scale(16) + `px`};
  margin-top: ${verticalScale(10) + `px`};
  margin-bottom: ${verticalScale(14) + `px`};
  margin-left: ${scale(40) + `px`};
  font-family: "IBMPlexMono";
  color: #6e7588;
`;

const SearchItem = styled.View`
  width: ${width - scale(65) + `px`};
  padding-top: ${verticalScale(20) + `px`};
  padding-bottom: ${verticalScale(20) + `px`};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: ${scale(1) + `px`};
  border-bottom-color: #f0f0f0;
`;

const SearchItemText = styled.Text`
  font-size: ${scale(20) + `px`};
  line-height: ${scale(20) + `px`};
  font-family: "IBMPlexSans-Light";
  color: #252e48;
`;

const SearchItemCaption = styled.Text`
  margin-left: ${scale(10) + `px`};
  font-size: ${scale(12) + `px`};
  line-height: ${scale(12) + `px`};
  font-family: "IBMPlexMono";
  text-align: right;
  color: #6e7588;
`;
