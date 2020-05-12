import React, { useState, useEffect, useRef } from "react";
import ImagePicker from "react-native-image-crop-picker";
import { Toast } from "native-base";

import {
  RoundedHeader,
  Card,
  Text,
  BackIcon,
  Button,
  ErrorMessage
} from "../../components/index";
import { colors } from "../../theme";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Image,
  TouchableOpacity
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { showToast } from "../../utils/commonUtils";
import { Colors } from "react-native/Libraries/NewAppScreen";
import theme from "../../theme";

const UploadDocs = props => {
  const [avatarSet, changeAvtarSet] = useState("");
  const [avatarSetTwo, chageAvatarSetTwo] = useState("");
  const [uploadType, changeUploadType] = useState("");
  const [sizeElement, changeSizeElement] = useState();
  const refRBSheet = useRef();

  const saveButtonPressed = () => {
    Toast.show({
      text: "* Upload Payment Invoice is mandatory",
      duration: 10000,
      style: {
        backgroundColor: "white",
        position: "absolute",
        bottom: 100,
        marginLeft: 20
      },
      textStyle: { color: "red", fontSize: 14 }
    });
  };

  const myGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true
    })
      .then(image => {
        const size = image.size;
        console.log("test name", image.filename);
        changeSizeElement(size);
        let images = `data:${image.mime};base64,${image.data}`;
        let imagedata = image.data;
        if (image.filename) {
          if (uploadType === "one") {
            console.log("Test filename");
            changeAvtarSet(image.filename);
          } else {
            chageAvatarSetTwo(image.filename);
          }
        } else null;
        if (image) {
          refRBSheet.current.close();
          if (size > 100000000) {
            Toast.show({
              text: "* The File size greater than the mentioned size",
              duration: 10000,
              style: {
                backgroundColor: "white",
                position: "absolute",
                bottom: 100,
                marginLeft: 20
              },
              textStyle: { color: "red", fontSize: 14 }
            });
          } else {
            console.log("Nothing set avatar");
          }
        }
      })
      .catch(error => {
        console.log(error, "OPEN PICKER AGAIN");
      });
  };

  const OpenRbTest = type => {
    refRBSheet.current.open();
    changeUploadType(type);
  };

  const myCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true
    })
      .then(image => {
        const size = image.size;
        let images = `data:${image.mime};base64,${image.data}`;
        let imagedata = image.data;
        if (uploadType == "two") {
          changeAvtarSet(images);
        } else {
          chageAvatarSetTwo(images);
        }

        if (image) {
          refRBSheet.current.close();
          if (image.size > 1000) {
            showToast("Image size should be less than 5 MB", true);
          } else {
            console.log("Nothing open camera");
          }
        }
      })
      .catch(err => {
        console.log(err, "Open camera Again");
      });
  };
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <RoundedHeader style={{ borderBottomLeftRadius: 0 }}>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.goBack();
              }}
            >
              <BackIcon />
            </TouchableOpacity>

            <Text size="size7" medium color="white">
              Upload Documets
            </Text>
          </View>
        </RoundedHeader>
        <TouchableOpacity onPress={() => OpenRbTest("one")}>
          {avatarSet ? (
            <View style={styles.viewBorder2}>
              <Image
                style={{
                  height: 15,
                  width: 15,
                  alignSelf: "center",
                  marginLeft: 10
                }}
                source={require("../../../assets/images/doc.png")}
              />

              <Text
                style={{
                  marginLeft: 30,
                  alignSelf: "center"
                }}
              >
                {avatarSet}
              </Text>
            </View>
          ) : (
            <View
              style={[
                styles.viewBorder,
                {
                  borderColor: theme.colorBlack
                }
              ]}
            >
              <Image
                style={{
                  height: 15,
                  width: 15,
                  alignSelf: "center",
                  marginLeft: 10
                }}
                source={require("../../../assets/images/upload.png")}
              />

              <Text
                style={{
                  marginLeft: 30,
                  alignSelf: "center"
                }}
              >
                Upload Invoice
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => OpenRbTest("two")}>
          {avatarSetTwo ? (
            <View style={styles.viewBorder2}>
              <Image
                style={{
                  height: 15,
                  width: 15,
                  alignSelf: "center",
                  marginLeft: 10
                }}
                source={require("../../../assets/images/doc.png")}
              />

              <Text
                style={{
                  marginLeft: 30,
                  alignSelf: "center"
                }}
              >
                {avatarSetTwo}
              </Text>
            </View>
          ) : (
            <View
              style={[
                styles.viewBorder,
                {
                  borderColor: theme.colorBlack
                }
              ]}
            >
              <Image
                style={{
                  height: 15,
                  width: 15,
                  alignSelf: "center",
                  marginLeft: 10
                }}
                source={require("../../../assets/images/upload.png")}
              />

              <Text
                style={{
                  marginLeft: 30,
                  alignSelf: "center"
                }}
              >
                Upload Prescription
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <Text
          normal
          size="captionSmall"
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 5,
            marginLeft: 20
          }}
        >
          only png, jpg, gif, with max size of 5MB
        </Text>

        <RBSheet
          ref={refRBSheet}
          height={200}
          duration={0}
          animationType="slide"
        >
          <View>
            <Text size="size18" bold style={{ margin: 20 }}>
              Add Payment Invoice
            </Text>
            <TouchableOpacity onPress={() => myCamera()}>
              <View
                style={{
                  flexDirection: "row",
                  margin: 10,
                  marginLeft: 20
                }}
              >
                <Image
                  resizeMode="contain"
                  style={{ height: 30, width: 30 }}
                  source={require("../../../assets/images/galleryImg.png")}
                />
                <Text
                  size="size14"
                  medium
                  style={{ marginLeft: 20, alignSelf: "center" }}
                >
                  {"Take a photo"}
                </Text>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: 0.5
                  }}
                >
                  <Icon
                    name="chevron-right"
                    size={15}
                    style={{ alignSelf: "flex-end", marginRight: 20 }}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => myGallery()}>
              <View
                style={{
                  flexDirection: "row",
                  margin: 10,
                  marginLeft: 20
                }}
              >
                <Image
                  resizeMode="contain"
                  style={{ height: 30, width: 30 }}
                  source={require("../../../assets/images/photoImg.png")}
                />
                <Text
                  size="size14"
                  medium
                  style={{ marginLeft: 20, alignSelf: "center" }}
                >
                  {"Gallery"}
                </Text>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: 0.5
                  }}
                >
                  <Icon
                    name="chevron-right"
                    size={15}
                    style={{ alignSelf: "flex-end", marginRight: 20 }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </RBSheet>
        <ErrorMessage />
      </SafeAreaView>
      <Button style={styles.bottomButton} onPress={() => saveButtonPressed()}>
        <Text size="size14" medium style={{ color: colors.black2 }}>
          Save
        </Text>
      </Button>
    </View>
  );
};

export default UploadDocs;
const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter
  },
  viewBorder: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 3,
    height: 51,
    borderStyle: "dashed",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20
  },
  bottomButton: {
    bottom: 30,
    position: "absolute",
    height: 41,
    width: 300,
    alignSelf: "center",
    backgroundColor: "#28dbb0"
  },
  viewBorder2: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 3,
    height: 51,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    borderColor: "#5c2d90"
  }
});
