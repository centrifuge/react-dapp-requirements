import React, {Component} from 'react';
import CheckForBrowser from "./CkeckForBrowser";
import CheckForAccount from "./CheckForAccount";
import CheckForWeb3 from "./CheckForWeb3";
import CheckForNetwork from "./CheckForNetwork";
import {promisify} from "./utils";
import PropTypes from "prop-types";


class DappRequirements extends Component {

    static propTypes = {
        supportedNetworks: PropTypes.array.isRequired,
        networkMap: PropTypes.object,
        web3Provided: PropTypes.func,
        fetchAccount: PropTypes.func,
        fetchNetwork: PropTypes.func,
        isBrowserSupported: PropTypes.func,
        onNetworkIdReceived: PropTypes.func,
        onAccountChange: PropTypes.func,
        Web3UnavailableComponent: PropTypes.func,
        BrowserUnsupportedComponent: PropTypes.func,
        AccountUnavailableComponent: PropTypes.func,
        AccountLoadingComponent: PropTypes.func,
        NetworkNotSupportedComponent: PropTypes.func,
        NetworkLoadingComponent: PropTypes.func,
        NetworkNotFoundComponent: PropTypes.func,
    };

    static defaultProps = {
        web3Provided: () => {
            return window.web3;
        },
        supportedNetworks: [4, 99999],
        isBrowserSupported: () => {
            //We support only Firefox, Brave and Chrome as they are the only ones with metamask support
            return navigator.userAgent.match(/(opera|chrome|firefox)\/?\s*(\.?\d+(\.\d+)*)/i);
        },
        fetchAccount: () => {
            const {web3} = window;
            return promisify(web3.eth.getAccounts);
        },
        fetchNetwork: () => {
            const {web3} = window;
            if (typeof web3.version === "string") {
                return web3.eth.net.getId();
            } else if (web3.version.api) {
                return promisify(web3.version.getNetwork);
            }
        },

        networkMap: {
            "1": 'MAINNET',
            "2": 'MORDEN',
            "3": 'ROPSTEN',
            "4": 'RINKEBY',
            "42": 'KOVAN',
        },
    };

    render() {
        //used to skip rendering of components in a test env
        const {bypassChecks} = window;
        const {
            BrowserUnsupportedComponent,
            isBrowserSupported,
            Web3UnavailableComponent,
            web3Provided,
            supportedNetworks,
            NetworkNotSupportedComponent,
            NetworkLoadingComponent,
            NetworkNotFoundComponent,
            fetchNetwork,
            onNetworkIdReceived,
            AccountUnavailableComponent,
            AccountLoadingComponent,
            fetchAccount,
            onAccountChange

        } = this.props;

        return <React.Fragment>
            {!bypassChecks ? <CheckForBrowser BrowserUnsupportedComponent={BrowserUnsupportedComponent}
                                              isBrowserSupported={isBrowserSupported}>
                <CheckForWeb3 Web3UnavailableComponent={Web3UnavailableComponent} web3Provided={web3Provided}>
                    <CheckForNetwork LoadingComponent={NetworkLoadingComponent}
                                     NetworkNotFoundComponent={NetworkNotFoundComponent}
                                     NetworkNotSupportedComponent={NetworkNotSupportedComponent}
                                     networkMap={this.props.networkMap}
                                     onNetworkIdReceived={onNetworkIdReceived}
                                     fetchNetwork={fetchNetwork}
                                     supportedNetworks={supportedNetworks}>
                        <CheckForAccount AccountUnavailableComponent={AccountUnavailableComponent}
                                         LoadingComponent={AccountLoadingComponent}
                                         fetchAccount={fetchAccount}
                                         onAccountChange={onAccountChange}>
                            {this.props.children}
                        </CheckForAccount>
                    </CheckForNetwork>
                </CheckForWeb3>
            </CheckForBrowser> : this.props.children}
        </React.Fragment>;
    }
}


export default DappRequirements
