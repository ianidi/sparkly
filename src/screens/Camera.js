import React from "react";
import { inject, observer } from "mobx-react";
import AsyncStorage from "@react-native-community/async-storage";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Platform
} from "react-native";
import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import { withModal } from "react-native-modalfy";
import images from "../constants/images";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import {
  getStatusBarHeight,
  getBottomSpace
} from "react-native-iphone-x-helper";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import UploadProgress from "../components/UploadProgress";
//import FormData from "form-data";
import { BASE_URL } from "../constants";

const landmarkSize = 2;

const flashModeOrder = {
  off: "on",
  on: "auto",
  auto: "torch",
  torch: "off"
};

const flashIcons = {
  off: "flash-off",
  on: "flash-on",
  auto: "flash-auto",
  torch: "highlight"
};

const wbOrder = {
  auto: "sunny",
  sunny: "cloudy",
  cloudy: "shadow",
  shadow: "fluorescent",
  fluorescent: "incandescent",
  incandescent: "auto"
};

const wbIcons = {
  auto: "wb-auto",
  sunny: "wb-sunny",
  cloudy: "wb-cloudy",
  shadow: "beach-access",
  fluorescent: "wb-iridescent",
  incandescent: "wb-incandescent"
};

@inject("main")
@inject("member")
@observer
class CameraScreen extends React.Component {
  state = {
    flash: "off",
    zoom: 0,
    autoFocus: "on",
    type: "back",
    whiteBalance: "auto",
    ratio: "16:9",
    ratios: [],
    barcodeScanning: false,
    faceDetecting: false,
    faces: [],
    newPhotos: false,
    permissionsGranted: false,
    pictureSize: undefined,
    pictureSizes: [],
    pictureSizeId: 0,
    showGallery: false,
    isRecording: false,
    uploadProgress: null
  };

  async componentWillMount() {
    let granted = true;

    let cameraGranted = await Permissions.askAsync(Permissions.CAMERA);
    console.log(cameraGranted, "cameraGranted");

    if (cameraGranted.status !== "granted") {
      granted = false;
    }

    let audioGranted = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    console.log(audioGranted, "audioGranted");

    if (audioGranted.status !== "granted") {
      granted = false;
    }
    console.log(granted, "granted");

    this.setState({
      permissionsGranted: granted
    });
  }

  openGallery = async () => {
    let granted = true;

    if (Platform.OS === "ios") {
      let cameraGranted = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (cameraGranted.status !== "granted") {
        granted = false;
      }
    }

    if (!granted) {
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      //base64: true,
      exif: true,
      quality: 0.8
    });

    if (!result.cancelled) {
      this.imagePreview(result.uri);
    }
  };

  componentDidMount() {
    if (this.props.main.ModalCameraContentTooltip == false) {
      this.props.main.set("ModalCameraContentTooltip", true);
      this.props.modal.openModal("CameraContentTooltip");
    }

    FileSystem.makeDirectoryAsync(
      FileSystem.documentDirectory + "photos"
    ).catch(e => {
      console.log(e, "Directory exists");
    });
  }

  getRatios = async () => {
    const ratios = await this.camera.getSupportedRatios();
    return ratios;
  };

  toggleFacing = () =>
    this.setState({ type: this.state.type === "back" ? "front" : "back" });

  toggleFlash = () =>
    this.setState({ flash: flashModeOrder[this.state.flash] });

  close = () => this.props.navigation.goBack();

  setRatio = ratio => this.setState({ ratio });

  setIsRecording = isRecording => this.setState({ isRecording });

  toggleWB = () =>
    this.setState({ whiteBalance: wbOrder[this.state.whiteBalance] });

  toggleFocus = () =>
    this.setState({ autoFocus: this.state.autoFocus === "on" ? "off" : "on" });

  zoomOut = () =>
    this.setState({
      zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1
    });

  zoomIn = () =>
    this.setState({
      zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1
    });

  setFocusDepth = depth => this.setState({ depth });

  toggleBarcodeScanning = () =>
    this.setState({ barcodeScanning: !this.state.barcodeScanning });

  toggleFaceDetection = () =>
    this.setState({ faceDetecting: !this.state.faceDetecting });

  takePicture = () => {
    if (this.camera) {
      this.camera.takePictureAsync({
        onPictureSaved: this.onPictureSaved,
        //base64: true,
        exif: true,
        quality: 0.8
      });
    }
  };

  recordVideo = async () => {
    try {
      if (this.camera) {
        this.setIsRecording(true);
        let video = await this.camera.recordAsync({ maxDuration: 3 }); //TODO: 15
        Alert.alert(
          "Your video will be uploaded to sparkly.",
          "Thank you for participation in sparkly."
          //JSON.stringify(video)
        );
        this.setIsRecording(false);
      }
    } catch (err) {
      Alert.alert(
        "Your video will be uploaded to sparkly.",
        "Thank you for participation in sparkly."
        //JSON.stringify(err)
      );
      this.setIsRecording(false);
    }
  };

  handleMountError = ({ message }) => console.error(message);
  /*
  createFormData = (photo, body) => {
    const data = new FormData();
    data.append('file', {
        name: photo.filename,
        uri: Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
    });

    Object.keys(body).forEach(key => {
        data.append(key, body[key]);
    });

    return data;
};*/

  createFormData = (photo, body) => {
    const data = new FormData();
    data.append("file", {
      name: "cb72798f-5d62-48dd-a13c-e3041f2efaa6.jpg",
      uri:
        Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
    });

    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });

    return data;
  };

  onPictureSaved = async photo => {
    let directory = `${FileSystem.documentDirectory}photos/${Date.now()}.jpg`;

    await FileSystem.moveAsync({
      from: photo.uri,
      to: directory
    });
    this.imagePreview(directory);
  };

  imagePreview = uri => {
    this.props.member.set("ImageUploadLocalURI", uri);
    this.props.modal.openModal("CameraUploadPreview");
  };

  imageUpload = async uri => {
    try {
      const token = await AsyncStorage.getItem("@Api:token");

      console.log(uri);

      //uri: Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")

      let formData = new FormData();
      formData.append("file", {
        uri,
        name: `photo.jpeg`,
        type: `image/jpeg`
      });

      let options = {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      };

      const res = await fetch(`${BASE_URL}/feed/upload`, options);

      console.log(JSON.stringify(res));

      /*
      let formData = new FormData();

      formData.append("file", {
        uri: directory,
        type: "image/jpeg/jpg",
        name: "cb72798f-5d62-48dd-a13c-e3041f2efaa6.jpg"
        //data: photo.base64
      });

      axios
        .post(`${BASE_URL}/feed/upload`, formData, {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          } //,
          //onUploadProgress: callback
        })
        .catch(error => {
          throw error;
        });*/
    } catch (err) {
      console.debug(JSON.stringify(err));
    }
  };
  /*
      //const formData = this.createFormData(photo, { Category: "Feed" });

      const form = new FormData();
      form.append("image[image]", {
        name: "omgitsme.jpg",
        uri: photo.uri,
        type: "image/jpg"
      });
      const headers = {
        "Content-Type": "multipart/form-data"
      };
      const response = await apiUpload.post("/feed/upload", form, { headers });
      console.log(JSON.stringify(response));
      
      //console.log(JSON.stringify(formData));

      //api.setHeader("Content-Type", "multipart/form-data");
      const response = await apiUpload.post("/feed/upload", formData);

      console.log(JSON.stringify(response));

      if (response.ok && response.data.status == true) {
        message("Фотография загружена", "Она появится в ленте", "success");
      }*/

  //

  //
  /*
    return;

    const body = { Category: "Feed" };

    const formData = this.createFormData(photo, body);
    /*await FileSystem.moveAsync({
      from: photo.uri,
      to: `${FileSystem.documentDirectory}photos/${Date.now()}.jpg`
    });*/
  //return;
  /*
    const token = await AsyncStorage.getItem("@Api:token");

    console.log(photo);
    console.log(JSON.stringify(formData));
    console.log(token);

    axios
      .post(`${BASE_URL}/feed/upload`, formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        } //,
        //onUploadProgress: callback
      })
      .catch(error => {
        throw error;
      });

    return;

    const form = new FormData();
    form.append("image[image]", {
      name: `${Date.now()}.jpg`,
      uri: photo.uri,
      type: "image/jpg"
    });

    api.setHeader("Content-Type", "multipart/form-data");

    //const response = await api.post("/upload", form);
    //console.log(JSON.stringify(response));
    //this.setState({ newPhotos: true });*/

  onBarCodeScanned = code => {
    this.setState(
      { barcodeScanning: !this.state.barcodeScanning },
      Alert.alert(`Barcode found: ${code.data}`)
    );
  };

  onFacesDetected = ({ faces }) => this.setState({ faces });
  onFaceDetectionError = state => console.warn("Faces detection error:", state);

  collectPictureSizes = async () => {
    if (this.camera) {
      const pictureSizes = await this.camera.getAvailablePictureSizesAsync(
        this.state.ratio
      );
      let pictureSizeId = 0;
      if (Platform.OS === "ios") {
        pictureSizeId = pictureSizes.indexOf("High");
      } else {
        // returned array is sorted in ascending order - default size is the largest one
        pictureSizeId = pictureSizes.length - 1;
      }
      this.setState({
        pictureSizes,
        pictureSizeId,
        pictureSize: pictureSizes[pictureSizeId]
      });
    }
  };

  previousPictureSize = () => this.changePictureSize(1);
  nextPictureSize = () => this.changePictureSize(-1);

  changePictureSize = direction => {
    let newId = this.state.pictureSizeId + direction;
    const length = this.state.pictureSizes.length;
    if (newId >= length) {
      newId = 0;
    } else if (newId < 0) {
      newId = length - 1;
    }
    this.setState({
      pictureSize: this.state.pictureSizes[newId],
      pictureSizeId: newId
    });
  };

  renderFace({ bounds, faceID, rollAngle, yawAngle }) {
    return (
      <View
        key={faceID}
        transform={[
          { perspective: 600 },
          { rotateZ: `${rollAngle.toFixed(0)}deg` },
          { rotateY: `${yawAngle.toFixed(0)}deg` }
        ]}
        style={[
          styles.face,
          {
            ...bounds.size,
            left: bounds.origin.x,
            top: bounds.origin.y
          }
        ]}
      >
        <Text style={styles.faceText}>ID: {faceID}</Text>
        <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
        <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text>
      </View>
    );
  }

  renderLandmarksOfFace(face) {
    const renderLandmark = position =>
      position && (
        <View
          style={[
            styles.landmark,
            {
              left: position.x - landmarkSize / 2,
              top: position.y - landmarkSize / 2
            }
          ]}
        />
      );
    return (
      <View key={`landmarks-${face.faceID}`}>
        {renderLandmark(face.leftEyePosition)}
        {renderLandmark(face.rightEyePosition)}
        {renderLandmark(face.leftEarPosition)}
        {renderLandmark(face.rightEarPosition)}
        {renderLandmark(face.leftCheekPosition)}
        {renderLandmark(face.rightCheekPosition)}
        {renderLandmark(face.leftMouthPosition)}
        {renderLandmark(face.mouthPosition)}
        {renderLandmark(face.rightMouthPosition)}
        {renderLandmark(face.noseBasePosition)}
        {renderLandmark(face.bottomMouthPosition)}
      </View>
    );
  }

  renderFaces = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {this.state.faces.map(this.renderFace)}
    </View>
  );

  renderLandmarks = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {this.state.faces.map(this.renderLandmarksOfFace)}
    </View>
  );

  renderNoPermissions = () => (
    <>
      {this.renderClose()}
      <View style={styles.noPermissions}>
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontFamily: "IBMPlexSans",
            fontSize: scale(16),
            lineHeight: scale(20)
          }}
        >
          Приложению требуется доступ к камере.
        </Text>
      </View>
    </>
  );

  renderClose = () => <View />;
  /*
TODO:
  renderClose = () => (
    <View style={styles.closeBar}>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={this.close}
        activeOpacity={0.8}
      >
        <View
          style={{
            width: scale(40),
            height: scale(40),
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Ionicons name={"ios-close"} size={44} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );*/

  renderTopBar = () => (
    <View style={styles.topBar}>
      <View style={{ width: scale(40) }} />
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={this.toggleFlash}
        activeOpacity={0.8}
      >
        <View
          style={{
            width: scale(40),
            height: scale(40),
            backgroundColor: "#ffffff45",
            borderRadius: scale(10),
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <MaterialIcons
            name={flashIcons[this.state.flash]}
            size={26}
            color="white"
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.toggleButton}
        onPress={this.close}
        activeOpacity={0.8}
      >
        <View
          style={{
            width: scale(40),
            height: scale(40),
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Ionicons name={"ios-close"} size={44} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );

  renderBottomBar = () => (
    <View style={styles.bottomBar}>
      <View style={styles.bottomBarUpperContent}>
        {/*
        TODO:
        <View
          style={{
            width: scale(52),
            height: verticalScale(40),
            backgroundColor: "#ffffff45",
            borderRadius: scale(10),
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              color: "#BC7071",
              fontFamily: "IBMPlexSans",
              fontSize: scale(16),
              lineHeight: scale(20)
            }}
          >
            0:15
          </Text>
          </View>*/}
      </View>

      <View style={styles.bottomBarContent}>
        <View
          style={{
            width: scale(75),
            height: scale(75),
            alignItems: "flex-start",
            justifyContent: "center"
          }}
        >
          <TouchableOpacity onPress={this.openGallery} activeOpacity={0.8}>
            <Gallery source={images.Gallery} />
          </TouchableOpacity>
        </View>
        <View style={{ width: scale(75), height: scale(75) }}>
          {this.state.isRecording == false && (
            <TouchableOpacity onPress={this.takePicture} activeOpacity={0.8}>
              <CameraButton source={images.CameraButton} />
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            width: scale(75),
            height: scale(75),
            alignItems: "flex-end",
            justifyContent: "center"
          }}
        >
          <TouchableOpacity onPress={this.toggleFacing} activeOpacity={0.8}>
            <CameraReverse source={images.CameraReverse} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  renderCamera = () => (
    <View style={{ flex: 1 }}>
      <Camera
        ref={ref => {
          this.camera = ref;
        }}
        style={styles.camera}
        onCameraReady={this.collectPictureSizes}
        type={this.state.type}
        flashMode={this.state.flash}
        autoFocus={this.state.autoFocus}
        zoom={this.state.zoom}
        whiteBalance={this.state.whiteBalance}
        ratio={this.state.ratio}
        pictureSize={this.state.pictureSize}
        onMountError={this.handleMountError}
        onFacesDetected={
          this.state.faceDetecting ? this.onFacesDetected : undefined
        }
        onFaceDetectionError={this.onFaceDetectionError}
        /*barCodeScannerSettings={{
            barCodeTypes: [
              BarCodeScanner.Constants.BarCodeType.qr,
              BarCodeScanner.Constants.BarCodeType.pdf417,
            ],
          }}
          onBarCodeScanned={this.state.barcodeScanning ? this.onBarCodeScanned : undefined}*/
      >
        {this.renderTopBar()}
        {this.renderBottomBar()}
      </Camera>
      {this.state.faceDetecting && this.renderFaces()}
      {this.state.faceDetecting && this.renderLandmarks()}
    </View>
  );

  render() {
    const { uploadProgress } = this.state;

    const cameraScreenContent = this.state.permissionsGranted
      ? this.renderCamera()
      : this.renderNoPermissions();
    return (
      <>
        {uploadProgress && <UploadProgress uploadProgress={uploadProgress} />}
        <View style={styles.container}>{cameraScreenContent}</View>
      </>
    );
  }
}

export default withModal(CameraScreen);

const CameraButton = styled.Image`
  width: ${scale(75) + `px`};
  height: ${scale(75) + `px`};
`;

const Gallery = styled.Image`
  width: ${scale(40) + `px`};
  height: ${scale(40) + `px`};
`;

const CameraReverse = styled.Image`
  width: ${scale(45) + `px`};
  height: ${scale(45) + `px`};
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  },
  camera: {
    flex: 1,
    justifyContent: "space-between"
  },
  closeBar: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: verticalScale(20),
    paddingLeft: scale(25),
    paddingRight: scale(25)
  },
  topBar: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: verticalScale(20) + getStatusBarHeight(),
    paddingLeft: scale(25),
    paddingRight: scale(25)
  },
  bottomBar: {
    paddingLeft: scale(25),
    paddingRight: scale(25),
    paddingBottom: verticalScale(20) + getBottomSpace(),
    backgroundColor: "transparent"
  },
  bottomBarUpperContent: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: verticalScale(24)
  },
  bottomBarContent: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row"
  },
  noPermissions: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10
  },
  gallery: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  toggleButton: {
    alignItems: "center",
    justifyContent: "center"
  },
  autoFocusLabel: {
    fontSize: 20,
    fontWeight: "bold"
  },
  bottomButton: {
    flex: 0.3,
    height: 58,
    justifyContent: "center",
    alignItems: "center"
  },
  newPhotosDot: {
    position: "absolute",
    top: 0,
    right: -5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4630EB"
  },
  options: {
    position: "absolute",
    bottom: 80,
    left: 30,
    width: 200,
    height: 160,
    backgroundColor: "#000000BA",
    borderRadius: 4,
    padding: 10
  },
  detectors: {
    flex: 0.5,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row"
  },
  pictureQualityLabel: {
    fontSize: 10,
    marginVertical: 3,
    color: "white"
  },
  pictureSizeContainer: {
    flex: 0.5,
    alignItems: "center",
    paddingTop: 10
  },
  pictureSizeChooser: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  pictureSizeLabel: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  facesContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    top: 0
  },
  face: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: "absolute",
    borderColor: "#FFD700",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  landmark: {
    width: landmarkSize,
    height: landmarkSize,
    position: "absolute",
    backgroundColor: "red"
  },
  faceText: {
    color: "#FFD700",
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
    backgroundColor: "transparent"
  },
  row: {
    flexDirection: "row"
  }
});
