import React, {Component} from 'react';
import {centeredStyle, promiseWithTimeout} from "./utils";
import PropTypes from "prop-types";


class AccountUnavailableScreen extends Component {
    render() {
        return <div style={centeredStyle}>
            <h1>
                Your Metamask is locked
            </h1>
            <p>
                Simply open Metamask and follow the instructions to unlock it.
            </p>
        </div>
    }
}

class LoadingScreen extends Component {
    render() {
        return <div style={centeredStyle}>
            <p>Checking account information</p>
        </div>
    }

}

class CheckForAccount extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            selectedAccount: null,
        };
    }

    static propTypes = {
        fetchAccount: PropTypes.func.isRequired,
        pullInterval: PropTypes.number,
        onAccountChange: PropTypes.func,
        AccountUnavailableComponent: PropTypes.func,
        LoadingComponent: PropTypes.func,
    };

    static defaultProps = {
        AccountUnavailableComponent: AccountUnavailableScreen,
        LoadingComponent: LoadingScreen,
        pullInterval: 500,
    };

    componentDidMount() {
        this.fetchData();
        this.startPulling();
    }

    componentWillUnmount() {
        this.stopPulling();
    }

    stopPulling = () => {
        clearInterval(this.interval);
        this.interval = null;
    };

    startPulling = () => {
        if (this.interval) return;
        this.interval = setInterval(this.fetchData, this.props.pullInterval)
    };

    onAccountChange = (account) => {
        if (this.props.onAccountChange) this.props.onAccountChange(account);
    };

    fetchData = () => {
        try {
            promiseWithTimeout(this.props.pullInterval - 50, this.props.fetchAccount()).then((result) => {
                const selectedAccount = result.shift();
                if (selectedAccount !== this.state.selectedAccount) {
                    this.setState({
                        selectedAccount,
                        loading: false
                    });
                    this.onAccountChange(selectedAccount);
                }
            }).catch(e => {
                // ignore timeout. We only care about web3 errors
                if(e !== 'promise.timeout') {
                    this.setState({
                        selectedAccount: null,
                        loading: false
                    });
                    this.onAccountChange(null);
                }

            });
        } catch (e) {
            throw new Error("this.props.fetchAccount does not return a prommise!")
        }
    };

    render() {
        const {AccountUnavailableComponent, LoadingComponent} = this.props;

        if (this.state.loading) {
            return <LoadingComponent/>;
        }

        if (!this.state.selectedAccount) {
            return <AccountUnavailableComponent/>
        }
        return this.props.children;
    }
}

export default CheckForAccount;
