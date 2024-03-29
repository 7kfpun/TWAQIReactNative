import React from 'react';
import { bool, func, number, string } from 'prop-types';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';

import { iOSColors } from 'react-native-typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import noop from '../../../utils/helpers';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  titleText: {
    fontSize: 16,
    color: 'black',
  },
  descriptionText: {
    marginTop: 6,
    fontSize: 12,
    color: 'black',
    lineHeight: 16,
  },
  disabled: {
    color: 'gray',
  },
});

const Row = ({
  title,
  description,
  onPress,
  iconName,
  iconSize,
  iconColor,
  disabled,
}) => (
  <TouchableOpacity onPress={disabled ? noop : onPress}>
    <View style={styles.container}>
      {iconName && (
        <Ionicons
          style={{ marginRight: 8 }}
          name={iconName}
          size={iconSize}
          color={iconColor}
        />
      )}

      <View style={{ flex: 1 }}>
        {title && (
          <Text style={[styles.titleText, disabled ? styles.disabled : {}]}>
            {title}
          </Text>
        )}
        {description && (
          <Text
            style={[styles.descriptionText, disabled ? styles.disabled : {}]}
          >
            {description}
          </Text>
        )}
      </View>

      <MaterialIcons name="chevron-right" size={21} color="gray" />
    </View>
  </TouchableOpacity>
);

Row.defaultProps = {
  title: null,
  description: null,
  onPress: noop,
  iconName: null,
  iconSize: 21,
  iconColor: iOSColors.tealBlue,
  disabled: false,
};

Row.propTypes = {
  title: string,
  description: string,
  onPress: func,
  iconName: string,
  iconSize: number,
  iconColor: string,
  disabled: bool,
};

export default Row;
