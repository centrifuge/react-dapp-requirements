# react-dapp-requirements

Checks all requirements that a user needs in order to use a DApp. All checks must pass in order for the DApp to be rendered.
- Supported Browser
- Metamask installation
- Metamask connection access
- ETH network
- Account

The component uses a composition pattern which means that each requirement is a standalone component 
and can be used independently.

The component comes with default properties, child components and methods which support web3 0.2.x and 1.x in order to work out of the box
but all them can be overridden.

```javascript
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
        NetworkNotFoundComponent: PropTypes.func,
    };
```

How to use
-----
```javascript


class App extends Component {
    
  onProviderReceived = (provider) => {
      if (provider)
        // Instantiate a instance of web3
  };
  
  onNetworkIdReceived = (networkId) => {
    if (networkId)
      // Do something with the network id(dispatch a redux action for example)
  };

  onAccountChange = (address) => {
    if (address)
      // Do something with the account address(dispatch a redux action for example)
  };

  render() {
    // Add your on rendering components that can have a custom styles,internationalization ,etc  
    let dappRequirementsScreens = {
      BrowserUnsupportedComponent: injectIntl(BrowserUnsupportedScreen),
      Web3UnavailableComponent: injectIntl(Web3UnavailableScreen),
      ProviderUnavailableComponent: injectIntl(ProviderUnavailableScreen),
      ProviderLoadingComponent: injectIntl(ProviderLoadingScreen),
      AccountUnavailableComponent: injectIntl(AccountUnavailableScreen),
      AccountLoadingComponent: injectIntl(AccountLoadingScreen),
      NetworkNotSupportedComponent: injectIntl(NetworkNotSupportedScreen),
      NetworkLoadingComponent: injectIntl(NetworkLoadingScreen),
      NetworkNotFoundComponent: injectIntl(NetworkNotFoundScreen),
    };

    return (
       <DappRequirements
                {...dappRequirementsScreens}
                supportedNetworks={['4','42']}
                onProviderReceived={this.onProviderReceived}
                onNetworkIdReceived={this.onNetworkIdReceived}
                onAccountChange={this.onAccountChange}
              >
              // Render if all checks pass  
      </DappRequirements>
    )
  }
}


```

### Disable component in tests
```javascript
global.bypassChecks = true;
```

Setup
-----

### `npm install` or `yarn install`

Testing
-----
### `npm test` or `yarn test`

Building
-----
### `npm run build` or `yarn build`

Builds the component for production to the `dist` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

