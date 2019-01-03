import React, { Component } from 'react';
import { arrayOf, func, node, number, oneOfType } from 'prop-types';

import { ScrollView } from 'react-native';

class SwipeScrollView extends Component {
  static propTypes = {
    children: oneOfType([arrayOf(node), node]).isRequired,
    onScroll: func,
    onScrollUp: func,
    onScrollDown: func,
    scrollActionOffset: number,
  };

  static defaultProps = {
    onScroll: () => {},
    onScrollUp: () => console.log('Scrolling up'),
    onScrollDown: () => console.log('Scrolling down'),
    scrollActionOffset: 0,
  };

  onScroll = e => {
    /**
     * Allow parent component do something when 'onScroll' event is fired.
     */
    if (this.props.onScroll) {
      this.props.onScroll(e);
    }

    const offsetY = e.nativeEvent.contentOffset.y;

    console.log('offsetY', offsetY);

    /**
     * Prevent animation when ios scroll bounce.
     */
    const contentHeight = e.nativeEvent.contentSize.height;
    const layoutHeight = e.nativeEvent.layoutMeasurement.height;
    if (offsetY <= 0) {
      this.props.onScrollDown(e);
      return;
    }
    if (contentHeight / layoutHeight <= 1) {
      if (offsetY > 0) {
        this.setState({
          offsetY,
        });
        return;
      }
    } else {
      if (offsetY > contentHeight - layoutHeight) {
        this.setState({
          offsetY,
        });
        return;
      }
    }

    if (offsetY < this.props.scrollActionOffset) {
      this.props.onScrollDown(e);
    } else {
      this.props.onScrollUp(e);
    }
  };

  render() {
    return (
      <ScrollView
        scrollEventThrottle={10}
        {...this.props}
        onScroll={this.onScroll}
      >
        {this.props.children}
      </ScrollView>
    );
  }
}

export default SwipeScrollView;
