import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { useNavigation } from '@react-navigation/native';

import { Snackbar } from "react-native-paper";

//////////////////app components///////////////////
import CustomModal from "../Modal/CustomModal";
import CustomTextInput from "../TextInput/CustomTextInput";
import CustomButtonhere from "../Button/CustomButton";

////////////app icons////////////////
import Ionicons from "react-native-vector-icons/Ionicons";

///////////////app packages/////////////
import RBSheet from "react-native-raw-bottom-sheet";

///////////////app styles//////////////////
import styles from "./styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

////////////////////redux////////////
import { useSelector, useDispatch } from "react-redux";

//////////////////app Images////////////////
import { appImages } from "../../constant/images";

/////////////colors//////////
import Colors from "../../utills/Colors";


const DescriptionBottomSheet = (props) => {

  const navigation = useNavigation();
  //Modal States
  const [modalVisible, setModalVisible] = useState(false);

  /////////////redux states///////
  const dispatch = useDispatch();

  ////////////////textinput state//////////////
  const [description, setDescription] = useState("");

    ///////////////button states/////////////
    const [loading, setloading] = useState(0);
    const [disable, setdisable] = useState(0);
    const [visible, setVisible] = useState(false);
    const [snackbarValue, setsnackbarValue] = useState({ value: "", color: "" });
    const onDismissSnackBar = () => setVisible(false);


  //Api form validation
  const formValidation = async () => {
    // input validation
    if (description == "") {
      setsnackbarValue({ value: "Please Enter Comment description", color: "red" });
      setVisible("true");
    } 

    else {
      setloading(1);
      setdisable(1);
    }
  };
  return (
    <RBSheet
      //sstyle={{flex:1}}
      ref={props.refRBSheet}
      closeOnDragDown={true}
      closeOnPressMask={false}
      openDuration={50}
      closeDuration={50}
      animationType="fade"
      //height={500}
      customStyles={{
        wrapper: {
          backgroundColor: "rgba(52, 52, 52, 0.5)",
        },
        draggableIcon: {
          backgroundColor: Colors.AppBckGround_color,
        },
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: hp(50),
          backgroundColor: Colors.AppBckGround_color,
        },
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: wp(7),
        }}
      >
        <Text style={styles.maintext}>{props.title}</Text>
        <TouchableOpacity onPress={() => props.refRBSheet.current.close()}>
          <Ionicons
            name={"close"}
            size={22}
            color={Colors.Appthemecolor}
            onPress={() => props.refRBSheet.current.close()}
          />
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: hp(3), paddingHorizontal: wp(7) }}>
        <Text style={styles.subtext}>{props.subtitle}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          marginHorizontal: wp("5%"),
        }}
      >
        <CustomTextInput
          icon={appImages.email}
          type={"withouticoninput"}
          texterror={"invalid"}
          term={description}
          multiline={true}
          placeholder="Description"
          onTermChange={(desc) => setDescription(desc)}
        />
      </View>
      <View style={{ marginTop: hp(0) }}>
          <CustomButtonhere
            title={"ADD"}
            widthset={80}
            topDistance={7}
            loading={loading}
            disabled={disable}
            onPress={() => {
              //navigation.navigate("Drawerroute");
              formValidation();
            }}
          />
        </View>
      <View style={styles.btnView}>
        {/* <TouchableOpacity
          style={styles.btn}
          onPress={() =>   listing_Comments(data)}
        >
          <Text style={styles.btnText}>{props.btntext}</Text>
        </TouchableOpacity> */}

      </View>
      <CustomModal
          modalVisible={modalVisible}
          CloseModal={() => setModalVisible(false)}
          Icon={appImages.sucess}
          text={"Sucess"}
          subtext={
            props.btntext === "REPORT"
              ? "Report Sucessfully"
              : "Review Added Successfully"
          }
          buttontext={"OK"}
          onPress={() => {
            props.onClose()
         setModalVisible(false)
//navigation.navigate('CommentsDetails')
          }}
        />
      <Snackbar
          duration={400}
          visible={visible}
          onDismiss={onDismissSnackBar}
          style={{
            backgroundColor: snackbarValue.color,
            marginBottom: hp(9),
            zIndex: 999,
          }}
        >
          {snackbarValue.value}
        </Snackbar>
    </RBSheet>
  );
};

export default DescriptionBottomSheet;
