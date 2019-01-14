import React, { Component } from 'react';
import CheckForBrowser from './CkeckForBrowser';
import CheckForAccount from './CheckForAccount';
import CheckForWeb3 from './CheckForWeb3';
import CheckForNetwork from './CheckForNetwork';
import { promisify } from './utils';
import PropTypes from 'prop-types';
import CheckForProvider from './CheckForProvider';

let _provider;
let _networkId;

class DappRequirements extends Component {
  static propTypes = {
    // array of supported networks
    supportedNetworks: PropTypes.array.isRequired,
    // Map of labels for eth network ids
    networkMap: PropTypes.object,
    // method that checks if web3 is injected on the window obj. Is Metamask installed?
    web3Provided: PropTypes.func,
    // method that checks for the web3 provider. Connection access granted?
    fetchProvider: PropTypes.func,
    // polling method for current account
    fetchAccount: PropTypes.func,
    // method that retrieves the selected ETH network
    fetchNetwork: PropTypes.func,
    // method that checks for browser(chrome, firefox, opera)
    isBrowserSupported: PropTypes.func,
    // callback for connection access
    onProviderReceived: PropTypes.func,
    // callback for network change
    onNetworkIdReceived: PropTypes.func,
    // callback for account change
    onAccountChange: PropTypes.func,
    // Render when metamsk is not installed
    Web3UnavailableComponent: PropTypes.func,
    // Render if the user does not accept connection access
    ProviderUnavailableComponent: PropTypes.func,
    // Render while waiting for user connection input
    ProviderLoadingComponent: PropTypes.func,
    // Render if the current browser is not supported
    BrowserUnsupportedComponent: PropTypes.func,
    // Render if Metamask is locked
    AccountUnavailableComponent: PropTypes.func,
    // Render while waiting for account information
    AccountLoadingComponent: PropTypes.func,
    // Render if selected ETH network is not supported
    NetworkNotSupportedComponent: PropTypes.func,
    // Render while checking the selected network
    NetworkLoadingComponent: PropTypes.func,
    // Render in case of not Eth network(No internet connect)
    NetworkNotFoundComponent: PropTypes.func
  };

  static defaultProps = {
    web3Provided: () => {
      return window.ethereum || window.web3;
    },
    supportedNetworks: [4, 99999],
    isBrowserSupported: () => {
      // Browsers that have the Metamask extension
      return navigator.userAgent.match(
        /(opera|chrome|firefox)\/?\s*(\.?\d+(\.\d+)*)/i
      );
    },
    fetchProvider: async () => {
      if (ethereum) {
        await ethereum.enable();
        return ethereum;
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        return window.web3.currentProvider;
      }
    },
    fetchAccount: () => {
      const { web3 } = window;
      return promisify(web3.eth.getAccounts);
    },
    fetchNetwork: () => {
      const { web3 } = window;
      if (typeof web3.version === 'string') {
        return web3.eth.net.getId();
      } else if (web3.version.api) {
        return promisify(web3.version.getNetwork);
      }
    },

    networkMap: {
      '1': 'MAINNET',
      '2': 'MORDEN',
      '3': 'ROPSTEN',
      '4': 'RINKEBY',
      '42': 'KOVAN'
    }
  };

  onProviderReceived = (provider) => {
    _provider = provider;
    if (this.props.onProviderReceived) this.onProviderReceived(provider);
  };

  onNetworkIdReceived = (networkId) => {
    _networkId = networkId;
    if (this.props.onNetworkIdReceived)
      this.props.onNetworkIdReceived(networkId);
  };

  onAccountChange = (account) => {
    if (this.props.onAccountChange)
      this.props.onAccountChange(account, _networkId, _provider);
  };

  render() {
    //used to skip rendering of components in a test env
    const { bypassChecks } = window;
    const {
      BrowserUnsupportedComponent,
      isBrowserSupported,
      Web3UnavailableComponent,
      web3Provided,
      ProviderUnavailableComponent,
      ProviderLoadingComponent,
      fetchProvider,
      supportedNetworks,
      NetworkNotSupportedComponent,
      NetworkLoadingComponent,
      NetworkNotFoundComponent,
      fetchNetwork,
      AccountUnavailableComponent,
      AccountLoadingComponent,
      fetchAccount
    } = this.props;

    return (
      <React.Fragment>
        {!bypassChecks ? (
          <CheckForBrowser
            BrowserUnsupportedComponent={BrowserUnsupportedComponent}
            isBrowserSupported={isBrowserSupported}>
            <CheckForWeb3
              Web3UnavailableComponent={Web3UnavailableComponent}
              web3Provided={web3Provided}>
              <CheckForProvider
                fetchProvider={fetchProvider}
                ProviderUnavailableComponent={ProviderUnavailableComponent}
                LoadingComponent={ProviderLoadingComponent}
                onProviderReceived={this.onProviderReceived}>
                <CheckForNetwork
                  LoadingComponent={NetworkLoadingComponent}
                  NetworkNotFoundComponent={NetworkNotFoundComponent}
                  NetworkNotSupportedComponent={NetworkNotSupportedComponent}
                  networkMap={this.props.networkMap}
                  onNetworkIdReceived={this.onNetworkIdReceived}
                  fetchNetwork={fetchNetwork}
                  supportedNetworks={supportedNetworks}>
                  <CheckForAccount
                    AccountUnavailableComponent={AccountUnavailableComponent}
                    LoadingComponent={AccountLoadingComponent}
                    fetchAccount={fetchAccount}
                    onAccountChange={this.onAccountChange}>
                    {this.props.children}
                  </CheckForAccount>
                </CheckForNetwork>
              </CheckForProvider>
            </CheckForWeb3>
          </CheckForBrowser>
        ) : (
          this.props.children
        )}
      </React.Fragment>
    );
  }
}

export default DappRequirements;
