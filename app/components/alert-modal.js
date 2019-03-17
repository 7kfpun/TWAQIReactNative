import React from 'react';
import { bool, func, string } from 'prop-types';

import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import Modal from 'react-native-modal';

import { noop } from '../utils/helpers';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  body: {
    height: height - 400,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  title: {
    alignItems: 'center',
    paddingTop: 25,
  },
  titleText: {
    fontWeight: '400',
    fontSize: 18,
    color: 'black',
  },
  description: {
    alignItems: 'center',
    paddingTop: 25,
  },
  descriptionText: {
    fontWeight: '300',
    fontSize: 16,
    lineHeight: 22,
    color: 'black',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontWeight: '300',
    fontSize: 16,
    color: iOSColors.gray,
  },
  okText: {
    fontWeight: '600',
    fontSize: 16,
    color: iOSColors.tealBlue,
  },
  footer: {
    height: 75,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  icon: {
    padding: 15,
  },
});

const AlertModal = ({
  handleClose,
  handleCancel,
  handleOK,
  isVisible,
  title,
  description,
  okText,
  cancelText,
}) => (
  <Modal
    style={styles.container}
    isVisible={isVisible}
    onSwipeComplete={handleClose}
    onBackButtonPress={handleClose}
    onBackdropPress={handleClose}
    scrollOffsetMax={300}
  >
    <View style={styles.body}>
      {title && (
        <View style={styles.title}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
      )}

      {description && (
        <View style={styles.description}>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={{ flex: 1 }} onPress={handleCancel}>
          <View style={styles.button}>
            <Text style={styles.cancelText}>{cancelText}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1 }} onPress={handleOK}>
          <View style={styles.button}>
            <Text style={styles.okText}>{okText}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

AlertModal.propTypes = {
  handleClose: func,
  handleCancel: func,
  handleOK: func,
  isVisible: bool,
  title: string,
  description: string,
  okText: string,
  cancelText: string,
};

AlertModal.defaultProps = {
  handleClose: noop,
  handleCancel: noop,
  handleOK: noop,
  isVisible: false,
  title: null,
  description: null,
  okText: 'OK',
  cancelText: 'Cancel',
};

export default AlertModal;
