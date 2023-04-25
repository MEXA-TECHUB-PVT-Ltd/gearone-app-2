import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

////////////////height width///////////////
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

///////////////icons////////////////
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

/////////////colors///////////////
import Colors from '../../utills/Colors';

//////////////////fonts///////////////
import {fontFamily} from '../../constant/fonts';

///////////////svg///////////////
import Logo from '../../assets/svgs/Logo.svg';
import YourLogo from '../../assets/svgs/yourlogo.svg';

const Header = ({
  title,
  left_icon,
  left_iconPress,
  right_icon,
  right_iconPress,
  headertype
}) => {
  return (
    <View style={styles.header}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: wp(2),
        }}>
        <View
          style={{
            height: hp(8),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Logo width={wp(30)} height={hp(6.5)} />
        </View>
        <View
          style={{
            height: hp(8),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <YourLogo width={wp(30)} height={hp(6)} />
        </View>
      </View>
      {headertype === 'header_without_text' ? null:
       (
        <View style={{flexDirection: 'row', marginTop: hp(5)}}>
          <View style={styles.iconContainer}>
            <Icon
              name={left_icon}
              size={20}
              color="white"
              onPress={left_iconPress}
            />
          </View>

          <View style={styles.titleContainer}>
            <Text style={[styles.title]}>{title}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    // flexDirection: 'row',
    height: hp(20),
    paddingTop: hp(1),
    backgroundColor: Colors.AppBckGround_color,
    borderBottomColor: 'gray',
    borderWidth: wp(0.4),
  },
  iconContainer: {
    // flex:0.8,
    width: wp(12),
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor:'red'
  },
  titleContainer: {
    //flex: 6,
    width: wp(80),
    alignItems: 'center',
    justifyContent: 'center',
    //justifyContent: 'center',
    //backgroundColor:'yellow'
  },
  title: {
    fontSize: hp(2.3),
    color: 'white',
    textAlign: 'center',
    fontFamily: fontFamily.Inter_Medium,
  },
});

export default Header;