import React, {Component} from 'react';
import PropTypes from "prop-types";


class Web3UnvailableScreen extends Component {
    render() {
        return <div>
            <h1>
                No connection to Ethereum
            </h1>
            <p>
                You will need a way to connect and interact with Ethereum throw the Browser. The perfect way is
                Metamask.

            </p>
            <a href="https://metamask.io" rel="noopener noreferrer" target="_blank">
                Install Metamask
            </a>
            <p>
                or <a rel="noopener noreferrer"
                      href="https://consensys.zendesk.com/hc/en-us/categories/360000441452-Using-MetaMask"
                      target="_blank">learn
                more</a> about Metamask
            </p>
        </div>
    }
}

class CheckForWeb3 extends Component {

    static propTypes = {
        web3Provided: PropTypes.func.isRequired,
        Web3UnvailableComponent: PropTypes.func,
    };

    static defaultProps = {
        Web3UnvailableComponent: Web3UnvailableScreen
    };

    render() {
        const {Web3UnvailableComponent, web3Provided} = this.props;
        if (!web3Provided()) {
            return <Web3UnvailableComponent/>
        }
        return this.props.children;
    }
}

export default CheckForWeb3;
