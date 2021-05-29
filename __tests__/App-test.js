/**
 * @format
 */

import 'react-native';
import React from 'react';
import AppWrapper from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<AppWrapper />);
  expect(tree).toMatchSnapshot();
});
