import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  SafeAreaView,
  View,
  Image,
  PermissionsAndroid,
  Text,
  TouchableOpacity,
} from 'react-native';

///////////////import app components/////////////
import CamerBottomSheet from '../../../components/CameraBottomSheet/CameraBottomSheet';
import Header from '../../../components/Header/Header';
import EmojiSelector from '../../../components/Chat/EmojiModal';

//////////////////app icons////////////////
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

////////////////app styles/////////////////////
import styles from './styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

///////////////////app Packages//////////////
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Send,
  Composer,
} from 'react-native-gifted-chat';

//////////////furestore/////////////
import firestore from '@react-native-firebase/firestore';

//////////////////////////app api/////////////////////////
import axios from 'axios';
import {BASE_URL, IMAGE_URL} from '../../../utills/ApiRootUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

/////////////////app images///////////////
import Colors from '../../../utills/Colors';

////////////////////navigation//////////////////
import {useIsFocused} from '@react-navigation/native';

//////////////sens button svg////////////
import SendBtn from '../../../assets/svgs/send.svg';

////////////app fonts////////
import {fontFamily} from '../../../constant/fonts';

/////////app redux///////
import {useSelector} from 'react-redux';

import EmojiPicker from 'rn-emoji-keyboard';

const ChatScreen = ({route, navigation}) => {
  ////////////////redux/////////////////
  const imagePath = useSelector(state => state.image);
  console.log("here redux",imagePath.path)

  //////////navigation//////////
  const isFocused = useIsFocused();

  /////////////redux/////////////
  const {emoji_name} = useSelector(state => state.emoji);

  ////////////previos data//////////
  const [emoji_visible, setEmojivisible] = useState(false);

  ////////////previos data//////////
  const [predata] = useState(route.params);

  ////////Bottom sheet references/////////
  const refRBSheet = useRef();

  //////////////chat states/////////////
  const [messages, setMessages] = useState([]);

  /////////////Get Notification/////////////
  const [profileImage, setProfileImage] = useState('');
  const [username, setUsername] = useState('');

  const GetProfileData = async () => {
    var user_id = await AsyncStorage.getItem('User_id');
    axios({
      method: 'GET',
      url: BASE_URL + 'auth/specific_user/' + user_id,
    })
      .then(async function (response) {
        console.log('list data here ', response.data.result);
        setProfileImage(response.data.result[0].image);
        setUsername(response.data.result[0].username);
      })
      .catch(function (error) {
        console.log('error', error);
      });
  };
  useEffect(() => {
    GetProfileData();
    AllMessages();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission given');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const AllMessages = async () => {
    var user_id = await AsyncStorage.getItem('User_id');
    const docid =
      predata.userid > user_id
        ? user_id + '-' + predata.userid
        : predata.userid + '-' + user_id;

    const messageRef = firestore()
      .collection('chats')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', 'desc');

    messageRef.onSnapshot(querySnap => {
      const allmsg = querySnap.docs.map(docsnap => {
        const data = docsnap.data();
        if (data.createdAt) {
          return {
            ...docsnap.data(),
            createdAt: docsnap.data().createdAt.toDate(),
          };
        } else {
          return {
            ...docsnap.data(),
            createdAt: new Date(),
          };
        }
      });
      setMessages(allmsg);
    });
  };
  const ref = useRef();

  useEffect(() => {
    requestCameraPermission();
  }, [isFocused]);
  const onSend = useCallback((messages = []) => {
    handleSend(messages);
  }, []);
  const handleSend = async messageArray => {
    console.log('here chat message value array', messageArray);
    var user_id = await AsyncStorage.getItem('User_id');
    const docid =
      predata.userid > user_id
        ? user_id + '-' + predata.userid
        : predata.userid + '-' + user_id;

    let myMsg = null;
    const msg = messageArray[0];
    console.log('here chat message value', msg);
    myMsg = {
      ...msg,
      //text:text,
      type: "image_text",
      image: imagePath.path,
      senderId: predata.userid,
      receiverId: user_id,
      user: {
        _id: predata.userid,
        name: 'ali',
      },
    };
    if (messageArray.text) {
      msg.text = messageArray.text;
    } else if (messageArray.image) {
      msg.image = messageArray.image;
    } else if (messageArray.emoji) {
      msg.text = messageArray.emoji;
    }
    //messagesRef.push().set(messageArray);
    setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg));
    firestore()
      .collection('chats')
      .doc(docid)
      .collection('messages')
      .add({
        ...myMsg,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

    messages.forEach(message => {});
    AllMessages();
  };
  const handleSendImage = image => {
    const imageMessage = {
      _id: Math.round(Math.random() * 1000000),
      image,
      createdAt: new Date(),
      user: {
        _id: predata.userid, // Provide a unique user ID
      },
    };

    handleSend([imageMessage]);
  };

  const CustomInputToolbar = props => {
    return (
      <View
        style={{
          bottom: hp(1),
          height: hp(7),
          width: wp(100),
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          //bottom: hp(1),
        }}>
        <InputToolbar
          {...props}
          containerStyle={{
            backgroundColor: '#E6E6E6',
            borderRadius: wp(4),
            paddingLeft: wp(10),
            paddingRight: wp(9),
            width: wp(80),
            left: wp(3),
          }}
        />

        <TouchableOpacity
          style={{position: 'absolute', top: hp(2.5), left: wp(6)}}
          onPress={() => setIsOpen(true)}>
          <FontAwesome5
            name={'smile'}
            size={22}
            color={'#444444'}
            onPress={() => setIsOpen(true)}
          />
        </TouchableOpacity>

        <View style={{position: 'absolute', top: hp(2.5), right: wp(20)}}>
          <MaterialCommunityIcons
            name={'camera'}
            size={22}
            color={'#444444'}
            onPress={() => refRBSheet.current.open()}
            //onPress={() => handleImageUpload()}
          />
        </View>
      </View>
    );
  };
  const SendComponent = props => {
    return (
      <Send
        {...props}
        containerStyle={{
          borderWidth: 0,
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: hp(5),
            width: wp(12),
            borderRadius: wp(10),
            position: 'absolute',
            bottom: hp(0),
            left: wp(12),
          }}>
          <SendBtn width={wp(16)} height={hp(10)} />
        </View>
      </Send>
    );
  };
  const CustomBubbleText = props => {
   // console.log('hree data',props.currentMessage)
    return (
      <View>
        {props.currentMessage.image ? (
          <Image
            source={{uri: props.currentMessage.image}}
            style={{height: 120, width: 100}}
            resizeMode="contain"
          />
        ) : (
          <Text
            style={{
              color: 'black',
              paddingHorizontal: wp(1),
              paddingVertical: 0,
              //fontWeight: "bold",
            }}>
            {props.currentMessage.text}
          </Text>
        )}
      </View>
    );
  };

  const [isOpen, setIsOpen] = useState(false);
  const handlePick = emojiObject => {
    console.log(emojiObject);
    /* example emojiObject = { 
        "emoji": "❤️",
        "name": "red heart",
        "slug": "red_heart",
      }
    */
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={'Chat'}
        left_icon={'chevron-back-sharp'}
        type={'withoutlogo'}
        left_iconPress={() => {
          navigation.goBack();
        }}
        username={username+imagePath.path}
        userimage={profileImage}
      />
      <GiftedChat
        alwaysShowSend
        isTyping={true}
        renderAvatar={() => null}
        bottomOffset={8}
        // /inverted={true}
        multiline={true}
        //minInputToolbarHeight={hp(80)}
        placeholderTextColor="#707070"
        textInputStyle={{
          fontSize: hp(1.8),
          color: 'black',
          backgroundColor: '#E6E6E6',
          // height: hp(3),
        }}
        textInputProps={{
          placeholder: 'Type Something',
          placeholderTextColor: '#999',
          autoFocus: false,
          autoCorrect: false,
          style: {
            backgroundColor: '#E6E6E6',
            width: wp(60),
            height: hp(6),
            color: 'black',
            // bottom: 0,
          },
        }}
        renderEmoji={props => <Emoji {...props} />}
        renderInputToolbar={props => {
          return <CustomInputToolbar {...props} />;
        }}
        renderSend={props => {
          return <SendComponent {...props} />;
        }}
        messages={messages}
        onSend={text => {
          onSend(text);
        }}
        user={{
          _id: predata.userid,
        }}
        custontext={{}}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  color: Colors.Appthemecolor,
                  backgroundColor:
                    props.currentMessage.text != ''
                      ? Colors.Appthemecolor
                      : 'orange',
                  // width: props.currentMessage.text != '' ? wp(80) : wp(70),
                  marginBottom: hp(1.5),
                  paddingTop: hp(2),
                  paddingHorizontal: wp(3),
                },
                left: {
                  color: Colors.Appthemecolor,
                  backgroundColor:
                    props.currentMessage.text != ''
                      ? Colors.inactivetextinput
                      : 'orange',
                  //width: props.currentMessage.text != "" ? wp(80) : wp(70),
                  marginBottom: hp(1.2),
                  paddingTop: hp(1),
                  paddingHorizontal: wp(2),
                },
              }}
            />
          );
        }}
        renderMessageText={props => {
          return <CustomBubbleText {...props} />;
        }}
      />

      <CamerBottomSheet
        refRBSheet={refRBSheet}
        onClose={() => {
          refRBSheet.current.close(), handleSendImage(imagePath);
        }}
        title={'From Gallery'}
        type={'Chat_image'}
      />
      <EmojiSelector
        modal_open={emoji_visible}
        modal_close={() => setEmojivisible(false)}
      />
    </SafeAreaView>
  );
};

export default ChatScreen;
