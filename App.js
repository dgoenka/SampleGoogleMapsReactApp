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
import {Provider} from 'react-redux';
import store from './src/store';
import {
  fetchTransportOptions,
  setCurrentlyViewingTransportOptionAction,
  pollTransportOption,
} from './src/store/transport';
import type {TransportOption, TransportOptionsProps} from './src/types/types';
import {connect} from 'react-redux';
import useInterval from 'react-useinterval';
import get from 'lodash.get';
import * as chrono from 'chrono-node';
import {formatRelative} from 'date-fns';
import MapView, {Marker, Callout} from 'react-native-maps';
import {Appbar} from 'material-bread';

store.dispatch(fetchTransportOptions());

const tram = require('./images/tram-car.png');
const train = require('./images/train.png');
const bus = require('./images/front-of-bus.png');

function onTransportOptionSelected() {
  this.dispatch(setCurrentlyViewingTransportOptionAction(this.item));
}

const _TransportOptionListItem: () => Node = (props: TransportOptionsProps) => {
  let updatedAtDateObj = chrono.parseDate(
    get(props, 'item.data.data.updatedAt'),
  );
  return (
    <TouchableOpacity
      onPress={onTransportOptionSelected.bind({
        dispatch: props.dispatch,
        item: props.item,
      })}
      style={[
        styles.transportListItemRootLayoutStyle,
        props.item.devid ===
        props.transport.currentlyViewingTransportOption.devid
          ? styles.transportListCurrentlyActiveItemRootLayoutStyle
          : null,
      ]}>
      <View style={styles.transportListItemLastUpdatedlRootLayoutStyle}>
        <Text>
          {updatedAtDateObj
            ? formatRelative(updatedAtDateObj, new Date(), {addSuffix: true})
            : 'Never'}
        </Text>
      </View>
      <View style={styles.transportListItemDetaillRootLayoutStyle}>
        <Image
          style={styles.transportListItemDetailLogoStyle}
          resizeMode={'contain'}
          source={getImageForTransportType(props.item.type)}
        />
        <View style={styles.transportListItemDetailTextLayoutStyle}>
          <Text style={styles.transportListItemDetailTextHeaderStyle}>
            {getHeaderForType(props.item.type)}
          </Text>
          <Text style={styles.transportListItemDetailTextDetailStyle}>
            {props.item.route_no}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const TransportOptionListItem = connect(state => ({
  transport: state.transport,
}))(_TransportOptionListItem);

const getHeaderForType = (type: String) => {
  switch (type) {
    case 'tram':
      return 'Trolley Bus';
    case 'train':
      return 'Train';
    case 'bus':
      return 'Bus';
  }
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

const _App: () => Node = props => {
  useInterval(() => {
    if (props.transport.currentlyViewingTransportOption) {
      props.dispatch(
        pollTransportOption(props.transport.currentlyViewingTransportOption),
      );
    }
  }, 10000);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  let data = (props.transport ?? {}).transportOptions ?? [];

  let latitude = get(
    props,
    'transport.currentlyViewingTransportOption.data.data.latitude',
  );
  let longitude = get(
    props,
    'transport.currentlyViewingTransportOption.data.data.longitude',
  );

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Appbar
        barType={'normal'}
        title={'Sample Maps App'}
        navigation={'menu'}
        onNavigation={() => console.log('onNavigation!')}
        actionItems={[{name: 'search', onPress: () => console.log('onSearch')}]}
      />
      <View style={styles.seventyFivePercentage}>
        {latitude && longitude ? (
          <MapView
            style={{width: '100%', height: '100%'}}
            region={{
              latitude,
              longitude,
              latitudeDelta: 0.0055,
              longitudeDelta: 0.0027,
            }}>
            <Marker
              key={get(
                props,
                'transport.currentlyViewingTransportOption.devid',
              )}
              coordinate={{latitude, longitude}}
              title={get(
                props,
                'transport.currentlyViewingTransportOption.route_no',
              )}
              description={getHeaderForType(
                get(props, 'transport.currentlyViewingTransportOption.type'),
              )}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: 'red',
                    padding: 5,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                    }}>
                    {get(
                      props,
                      'transport.currentlyViewingTransportOption.route_no',
                    )}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: 'red',
                    borderBottomRightRadius: 10,
                    borderBottomLeftRadius: 10,
                    height: 10,
                    width: 5,
                  }}
                />
              </View>
            </Marker>
          </MapView>
        ) : (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>{'Please Wait..'}.</Text>
          </View>
        )}
      </View>
      <FlatList
        style={styles.twentyFivePercentage}
        keyExtractor={(item: TransportOption) => item.devid}
        data={data}
        renderItem={renderTransportListItem}
      />
    </SafeAreaView>
  );
};

const renderTransportListItem = args => <TransportOptionListItem {...args} />;

const App = connect(state => ({
  transport: state.transport,
}))(_App);

const AppWrapper: () => Node = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

const styles = StyleSheet.create({
  transportListItemRootLayoutStyle: {
    flexDirection: 'row',
    padding: 5,
  },
  transportListCurrentlyActiveItemRootLayoutStyle: {
    backgroundColor: 'darkgrey',
  },
  transportListItemLastUpdatedlRootLayoutStyle: {
    flexDirection: 'column',
    flex: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transportListItemDetaillRootLayoutStyle: {
    flexDirection: 'row',
    flex: 4,
    padding: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    borderColor: 'grey',
  },
  transportListItemDetailLogoStyle: {
    height: 50,
    width: 50,
  },
  transportListItemDetailTextLayoutStyle: {
    flex: 1,
    flexDirection: 'column',
    padding: 5,
  },
  transportListItemDetailTextHeaderStyle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  transportListItemDetailTextDetailStyle: {
    fontSize: 15,
  },
  seventyFivePercentage: {width: '100%', height: '70%'},
  twentyFivePercentage: {width: '100%', height: '20%'},
});

export default AppWrapper;
