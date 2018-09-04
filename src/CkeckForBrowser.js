import React, {Component} from 'react';
import PropTypes from "prop-types";

class BrowserUnsupportedScreen extends Component {
    render() {
        return <div>
            <h1>
                Your browser is not supported
            </h1>
            <p>
                To access the Centrifuge OS you need to install Chrome, Firefox, Opera, or Brave
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
