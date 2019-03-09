import React from 'react';
import { func, string } from 'prop-types';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import Ionicons from 'react-native-vector-icons/Ionicons';

import noop from '../utils/helpers';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  titleText: {
    fontSize: 24,
    color: 'black',
  },
  descriptionText: {
    marginTop: 6,
    fontSize: 16,
    color: 'black',
    lineHeight: 16,
  },
  rightIcon: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 5,
  },
});

const Header = ({ title, description, iconName, onPress, backOnPress }) => (
  <TouchableOpacity style={{ height: 100 }} onPress={backOnPress}>
    <View style={styles.container}>
      {backOnPress && backOnPress !== noop && (
        <Ionicons
          style={{ marginRight: 10 }}
          name="ios-arrow-back"
          size={30}
          color={iOSColors.black}
        />
      )}

      <View style={{ flex: 5, flexDirection: 'row', alignItems: 'center' }}>
        {title && <Text style={styles.titleText}>{title}</Text>}
        {description && (
          <Text style={styles.descriptionText}>{description}</Text>
        )}
      </View>

      {iconName && (
        <TouchableOpacity style={styles.rightIcon} onPress={onPress}>
          <Ionicons name={iconName} size={26} color={iOSColors.gray} />
        </TouchableOpacity>
      )}
    </View>
  </TouchableOpacity>
);

Header.defaultProps = {
  title: null,
  description: null,
  onPress: noop,
  backOnPress: noop,
  iconName: null,
};

Header.propTypes = {
  title: string,
  description: string,
  onPress: func,
  backOnPress: func,
  iconName: string,
};

export default Header;
