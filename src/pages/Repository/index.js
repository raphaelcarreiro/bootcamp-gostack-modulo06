import React from 'react';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';

function Repository(props) {
  const { navigation } = props;

  const url = navigation.getParam('repository').html_url;

  return <WebView source={{ uri: url }} />;
}

Repository.navigationOptions = props => ({
  title: props.navigation.getParam('repository').name,
});

Repository.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};

export default Repository;
