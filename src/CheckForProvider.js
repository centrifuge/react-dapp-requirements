import React, { Component } from 'react';
import { centeredStyle } from './utils';
import PropTypes from 'prop-types';

class ProviderUnavailableScreen extends Component {
  render() {
    return (
      <div style={centeredStyle}>
        <h1>Dapp requires access to your Ethereum account</h1>
        <p>You must approve connection request in Metamask</p>
        <a href="#" onClick={this.props.onRetry}>
          Connect
        </a>
      </div>
    );
  }
}

class LoadingScreen extends Component {
  render() {
    return (
      <div style={centeredStyle}>
        <p>Requesting account connection</p>
      </div>
    );
  }
}

class CheckForProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      selectedProvider: null
    };
  }

  static propTypes = {
    fetchProvider: PropTypes.func.isRequired,
    onProviderReceived: PropTypes.func,
    ProviderUnavailableComponent: PropTypes.func,
    LoadingComponent: PropTypes.func
  };

  static defaultProps = {
    ProviderUnavailableComponent: ProviderUnavailableScreen,
    LoadingComponent: LoadingScreen,
    onProviderReceived: () => {}
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.setState({
      loading: true
    });
    try {
      this.props
        .fetchProvider()
        .then((result) => {
          const selectedProvider = result;
          if (selectedProvider !== this.state.selectedProvider) {
            this.setState({
              selectedProvider,
              loading: false
            });
            this.props.onProviderReceived(selectedProvider);
          }
        })
        .catch((e) => {
          // ignore timeout. We only care about web3 errors
          if (e !== 'promise.timeout') {
            this.setState({
              selectedProvider: null,
              loading: false
            });
            this.props.onProviderReceived(null);
          }
        });
    } catch (e) {
      throw new Error('this.props.fetchProvider does not return a promise!');
    }
  };

  render() {
    const { ProviderUnavailableComponent, LoadingComponent } = this.props;

    if (this.state.loading) {
      return <LoadingComponent />;
    }

    if (!this.state.selectedProvider) {
      return <ProviderUnavailableComponent onRetry={this.fetchData} />;
    }
    return this.props.children;
  }
}

export default CheckForProvider;
