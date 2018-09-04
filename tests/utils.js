import {Component} from "react";
import React from "react";

export class UnsupportedScreen extends Component {
    render() {
        return <div>
            <p className="unsupported">
                Usupported
            </p>
        </div>
    }
}

export class LoadingScreen extends Component {
    render() {
        return <div>
            <p className="loading">
                Loading
            </p>
        </div>
    }
}

export class NotFoundScreen extends Component {
    render() {
        return <div>
            <p className="not found">
                Not Found
            </p>
        </div>
    }
}

export class ChildToRender extends  Component {
    render() {
        return <p className="child">Render</p>
    }
}

