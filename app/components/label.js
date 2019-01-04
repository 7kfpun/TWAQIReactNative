import React from 'react';
import { bool, string } from 'prop-types';
import { Text, View } from 'react-native';

const Label = ({ color, isBorderOnly, text, textColor }) => {
  const containerStyleBase = {
    alignItems: 'center',
    borderRadius: 2,
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
  };

  const style = {
    fontSize: 12,
    color: textColor,
  };

  if (isBorderOnly) {
    containerStyle = {
      borderColor: color,
      borderWidth: 0.5,
    };
  } else {
    containerStyle = {
      backgroundColor: color,
    };
  }

  return (
    <View style={[containerStyleBase, containerStyle]}>
      <Text style={style}>{text}</Text>
    </View>
  );
};

Label.propTypes = {
  text: string.isRequired,
  color: string,
  textColor: string,
  isBorderOnly: bool,
};

Label.defaultProps = {
  color: 'black',
  textColor: 'black',
  isBorderOnly: false,
};

export default Label;
