import React, {Component} from 'react';
import PropTypes from "prop-types";
import {centeredStyle, promiseWithTimeout} from "./utils";


class NetworkNotSupportedScreen extends Component {
    render() {
        const {currentNetwork, supportedNetworks} = this.props;
        return <div style={centeredStyle}>
            <h1>
                {currentNetwork}  is not supported
            </h1>
            <p>
                You must switch to : {supportedNetworks.join(',')}
            </p>
        </div>
    }
}

class NetworkNotFoundScreen extends Component {
    render() {
        return <div style={centeredStyle}>
            <h1>
                Ethereum network not found
            </h1>
            <p>
                Check your internet connection and your Metamask and the reload the application
            </p>

        </div>
    }
}

class LoadingScreen extends Component {
    render() {
        return <div style={centeredStyle}>
            <p>Checking network information</p>
        </div>
    }
}


class CheckForNetwork extends Component {

    static propTypes = {
        fetchNetwork: PropTypes.func.isRequired,
        networkMap: PropTypes.object.isRequired,
        supportedNetworks: function (props, propName) {
            if (!Array.isArray(props.supportedNetworks) || !props.supportedNetworks.every((prop) => typeof prop === "string")) {
                return new Error(`${propName} needs to be an array and contain at least one ETH network id`);
            }
            return null
        },
        onNetworkIdReceived: PropTypes.func,
        NetworkNotSupportedComponent: PropTypes.func,
        LoadingComponent: PropTypes.func,
        NetworkNotFoundComponent: PropTypes.func,
    };

    static defaultProps = {
        NetworkNotSupportedComponent: NetworkNotSupportedScreen,
        LoadingComponent: LoadingScreen,
        NetworkNotFoundComponent: NetworkNotFoundScreen,
        numberOfRetries: 3,
    };


    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            hasNetworkConnection: true,
            retries: 0,
            networkId: null
        }
    }

    getNetworkById = (networkId) => {
        if (!this.props.networkMap.hasOwnProperty(networkId)) return `PRIVATE:${networkId}`;
        return this.props.networkMap[networkId];
    };

    componentWillMount() {
        this.fetchData();
    }

    onNetworkIdReceived = (networkId) => {
        if (this.props.onNetworkIdReceived) this.props.onNetworkIdReceived(networkId);
    };

    fetchData = () => {
        try {
            promiseWithTimeout(500, this.props.fetchNetwork()).then((result) => {
                const networkId = result;
                this.setState({
                    loading: false,
                    networkId,
                });
                this.onNetworkIdReceived(networkId);
            }).catch(e => {
                if (this.state.retries >= this.props.numberOfRetries) {
                    this.setState({
                        loading: false,
                        hasNetworkConnection: false
                    });
                    this.onNetworkIdReceived(null);
                } else {
                    console.log('retry');
                    this.setState({retries: this.state.retries + 1});
                    this.fetchData();
                }

            });
        } catch (e) {
            throw new Error("this.props.fetchNetwork does not return a prommise!")
        }
    };


    render() {
        const {
            NetworkNotSupportedComponent,
            NetworkNotFoundComponent,
            LoadingComponent,
            supportedNetworks
        } = this.props;
        const isSupportedNetwork = supportedNetworks.length === 0 || supportedNetworks.indexOf(this.state.networkId) >= 0;
        const labelsForSupportedNetworks = supportedNetworks.map((networkId) => {
            return this.getNetworkById(networkId)
        });
        if (this.state.loading) {
            return <LoadingComponent/>
        }

        if (!this.state.hasNetworkConnection) {
            return <NetworkNotFoundComponent/>
        }

        if (!isSupportedNetwork) {
            return <NetworkNotSupportedComponent currentNetwork={this.getNetworkById(this.state.networkId)}
                                                 supportedNetworks={labelsForSupportedNetworks}/>
        }
        return this.props.children;
    }
}

export default CheckForNetwork;
