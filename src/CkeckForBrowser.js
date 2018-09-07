import React, {Component} from 'react';
import PropTypes from "prop-types";
import {centeredStyle} from "./utils";

class BrowserUnsupportedScreen extends Component {
    render() {
        return <div style={centeredStyle}>
            <h1>
                Your browser is not supported
            </h1>
            <p>
                To access the application you need to install Chrome, Firefox, Opera, or Brave
            </p>
        </div>
    }
}

class CheckForBrowser extends Component {
    static propTypes = {
        isBrowserSupported: PropTypes.func.isRequired,
        BrowserUnsupportedComponent: PropTypes.func,
    };

    static defaultPros = {
        BrowserUnsupportedComponent: BrowserUnsupportedScreen
    };

    render() {
        const {BrowserUnsupportedComponent, isBrowserSupported} = this.props;
        if (!isBrowserSupported()) {
            return <BrowserUnsupportedComponent/>
        }
        return this.props.children;
    }
}

export default CheckForBrowser;
