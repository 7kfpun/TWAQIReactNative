import React, { Component } from 'react';
import { Text, View } from 'react-native';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    console.log(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <View>
          <Text>Something went wrong.</Text>
        </View>
      );
    }
    return this.props.children;
  }
}
