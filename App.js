/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  Image,
  useColorScheme,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {Provider, useSelector} from 'react-redux';
import store from './src/store';
import {
  fetchTransportOptions,
  setCurrentlyViewingTransportOptionAction,
} from './src/store/transport';
import type {TransportOption, TransportOptionsProps} from './src/types/types';

store.dispatch(fetchTransportOptions());

const tram = require('./images/tram-car.png');
const train = require('./images/train.png');
const bus = require('./images/front-of-bus.png');

function onTransportOptionSelected() {
  store.dispatch(setCurrentlyViewingTransportOptionAction(this.item));
}

const TransportOptionListItem: () => Node = (props: TransportOptionsProps) => {
  return (
    <TouchableOpacity
      onPress={onTransportOptionSelected.bind({item: props.item})}
      style={styles.transportListItemRootLayoutStyle}>
      <View style={styles.transportListItemLastUpdatedlRootLayoutStyle}></View>
      <View style={styles.transportListItemDetaillRootLayoutStyle}>
        <Image source={getImageForTransportType(props.item.type)} />
      </View>
    </TouchableOpacity>
  );
};

const getImageForTransportType = (type: String) => {
  switch (type) {
    case 'tram':
      return tram;
    case 'train':
      return train;
    case 'bus':
      return bus;
  }
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  let {transport} = useSelector(state => state.transport);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <FlatList
        keyExtractor={(item: TransportOption) => item.devid}
        data={(transport ?? {}).transportOptions ?? []}
        renderItem={TransportOptionListItem}
      />
    </SafeAreaView>
  );
};

const AppWrapper: () => Node = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

const styles = StyleSheet.create({
  transportListItemRootLayoutStyle: {
    flexDirection: 'row',
  },
  transportListItemLastUpdatedlRootLayoutStyle: {
    flexDirection: 'column',
    flex: 1,
  },
  transportListItemDetaillRootLayoutStyle: {
    flexDirection: 'column',
    flex: 4,
  },
});

export default AppWrapper;
