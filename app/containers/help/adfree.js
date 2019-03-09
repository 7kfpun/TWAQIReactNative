import React, { Component } from 'react';
import { func, shape } from 'prop-types';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';

import * as RNIap from 'react-native-iap';
import RNRestart from 'react-native-restart';
import store from 'react-native-simple-store';

import Header from '../../components/header';

import Row from './components/row';

import I18n from '../../utils/i18n';
import tracker from '../../utils/tracker';

import { config } from '../../config';

const productSkus = config.inAppProducts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  block: {
    paddingHorizontal: 10,
    paddingVertical: 30,
  },
  title: {
    fontSize: 24,
    color: 'black',
  },
});

const checkPurchaseHistory = async () => {
  try {
    tracker.logEvent('user-premium-restore-purchase-start');
    const purchaseHistory = await RNIap.getAvailablePurchases();
    console.log('getPurchaseHistory', purchaseHistory);

    if (purchaseHistory.length > 0) {
      for (const purchase of purchaseHistory) {
        if (config.inAppProducts.includes(purchase.productId)) {
          tracker.logEvent('user-premium-restore-purchase-done');
          return true;
        }
      }
    } else {
      tracker.logEvent('user-premium-restore-purchase-empty');
      return false;
    }
  } catch (err) {
    tracker.logEvent('user-premium-restore-purchase-error', err);
    console.warn(err);
    return false;
  }
};

export default class AdFree extends Component {
  state = {
    productList: [],
  };

  componentDidMount = async () => {
    await RNIap.initConnection();

    this.getProducts();
  };

  componentWillUnmount() {
    RNIap.endConnection();
  }

  getProducts = async () => {
    try {
      const products = await RNIap.getProducts(productSkus);
      console.log('getProducts', products);
      this.setState({
        productList: products.filter(i => productSkus.includes(i.productId)),
      });
    } catch (err) {
      console.warn(err);
    }
  };

  buyProductItem = async product => {
    // {
    //   description: '',
    //   introductoryPrice: '',
    //   subscriptionPeriodNumberIOS: '0',
    //   introductoryPriceNumberOfPeriodsIOS: '',
    //   introductoryPriceSubscriptionPeriodIOS: '',
    //   productId: 'com.example.adfree',
    //   price: '1000',
    //   introductoryPricePaymentModeIOS: '',
    //   type: 'Do not use this. It returned sub only before',
    //   title: '',
    //   subscriptionPeriodUnitIOS: 'DAY',
    //   localizedPrice: 'HK$1000.00',
    //   currency: 'HKD'
    // }
    tracker.logEvent('user-premium-buy-product-start', product);
    try {
      console.log('buyProductItem:', product);
      const purchase = await RNIap.buyProduct(product.productId);

      console.info('Purchase result', purchase);
      // {
      //   transactionReceipt: 'xxx',
      //   transactionDate: 1545732911000,
      //   productId: '',
      //   transactionId: '1000000489738811'
      // }
      if (productSkus.includes(purchase.productId)) {
        tracker.logEvent('user-premium-buy-product-done', purchase);
        this.applyLifetimePurchase();
        this.restartForApplyingPurchase();
      }

      tracker.logPurchase(
        product.price.replace(',', '.'),
        product.currency,
        true,
        product.title,
        product.type,
        product.productId
      );
    } catch (err) {
      if (err.code === 'E_ALREADY_OWNED') {
        this.applyLifetimePurchase();
        this.restartForApplyingPurchase();
      } else if (err.code === 'E_USER_CANCELLED') {
        // You are currently subscribed || cancelled
      } else if (err.code === 'E_UNKNOWN') {
        Alert.alert(err.code, err.message);
      }

      tracker.logEvent('user-premium-buy-product-error', err);
      tracker.logPurchase(
        product.price.replace(',', '.'),
        product.currency,
        false,
        product.title,
        product.type,
        product.productId
      );
    }
  };

  applyLifetimePurchase = () => {
    store.save('currentSubscription', 'adfree');
  };

  restartForApplyingPurchase = () => {
    Alert.alert(
      I18n.t('adfree.purchase_success.title'),
      I18n.t('adfree.purchase_success.description'),
      [
        {
          text: 'OK',
          onPress: () => {
            tracker.logEvent('user-premium-restart');
            RNRestart.Restart();
          },
        },
      ],
      { cancelable: false }
    );
  };

  restorePurchase = async () => {
    const history = await checkPurchaseHistory(false);
    if (history) {
      this.applyLifetimePurchase();
      Alert.alert(
        I18n.t('adfree.restore_success.title'),
        I18n.t('adfree.restore_success.description'),
        [
          {
            text: 'OK',
            onPress: () => {
              tracker.logEvent('user-premium-restore-purchase-restart');
              RNRestart.Restart();
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        I18n.t('adfree.restore_failed.title'),
        null,
        [{ text: 'OK' }],
        { cancelable: false }
      );
    }
  };

  render() {
    const {
      navigation: { goBack },
    } = this.props;
    const { productList } = this.state;

    return (
      <View style={styles.container}>
        <Header title={I18n.t('adfree.title')} backOnPress={() => goBack()} />

        <ScrollView>
          {productList.length > 0 &&
            productList.map(product => (
              <Row
                key={product.productId}
                title={`${I18n.t('adfree.product.title')} ${
                  product.localizedPrice
                }`}
                description={I18n.t('adfree.product.description')}
                onPress={() => this.buyProductItem(product)}
              />
            ))}

          <Row
            title={I18n.t('adfree.restore_purchase')}
            onPress={() => this.restorePurchase()}
          />
        </ScrollView>
      </View>
    );
  }
}

AdFree.propTypes = {
  navigation: shape({
    goBack: func.isRequired,
  }).isRequired,
};
