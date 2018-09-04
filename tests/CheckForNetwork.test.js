import React from 'react';
import {mount} from 'enzyme';
import CheckForNetwork from "../src/CheckForNetwork";
import {ChildToRender, UnsupportedScreen, NotFoundScreen, LoadingScreen} from "./utils";


const fetchNetworkSuccess = (networkId) => () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(networkId);
        }, 200);
    });
}

const fetchNetworkFailure = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject("fail");
        }, 200);
    });
}

const networkMap = {
    "1": 'MAINNET',
    "2": 'MORDEN',
    "3": 'ROPSTEN',
    "4": 'RINKEBY',
    "42": 'KOVAN',
}
const supportedNetworks = ["4"];

describe('<CheckForNetwork />', () => {

    it("should render loading state", () => {
        const wrapper = mount(
            <CheckForNetwork NetworkNotFoundComponent={NotFoundScreen} supportedNetworks={supportedNetworks}
                             NetworkNotSupportedComponent={UnsupportedScreen} LoadingComponent={LoadingScreen}
                             fetchNetwork={() => true} networkMap={networkMap}>
                <ChildToRender/>
            </CheckForNetwork>
        );
        expect(wrapper.find(LoadingScreen).length).toEqual(1);

    });

    it("should receive a supported network and render the supplied children", (done) => {

        const onNetworkIdReceived = (networkId) => {
            expect(networkId).toEqual("4");
            wrapper.update();
            expect(wrapper.find(ChildToRender).length).toEqual(1);
            done()
        }

        const wrapper = mount(
            <CheckForNetwork NetworkNotFoundComponent={NotFoundScreen} supportedNetworks={supportedNetworks}
                             NetworkNotSupportedComponent={UnsupportedScreen} LoadingComponent={LoadingScreen}
                             fetchNetwork={fetchNetworkSuccess("4")} onNetworkIdReceived={onNetworkIdReceived}
                             networkMap={networkMap}>
                <ChildToRender/>
            </CheckForNetwork>
        );

    });

    it("should not receive a networkId and render the not found screen", (done) => {

        const onNetworkIdReceived = (networkId) => {
            expect(networkId).toEqual(null);
            wrapper.update();
            expect(wrapper.find(NotFoundScreen).length).toEqual(1);
            done()
        }

        const wrapper = mount(
            <CheckForNetwork NetworkNotFoundComponent={NotFoundScreen} supportedNetworks={supportedNetworks}
                             NetworkNotSupportedComponent={UnsupportedScreen} LoadingComponent={LoadingScreen}
                             fetchNetwork={fetchNetworkFailure} onNetworkIdReceived={onNetworkIdReceived}
                             networkMap={networkMap} numberOfRetries={0}>
                <ChildToRender/>
            </CheckForNetwork>
        );

    });





    it("should receive a supported network and render the unsupported screen ", (done) => {

        const onNetworkIdReceived = (networkId) => {
            expect(networkId).toEqual("1");
            wrapper.update();
            expect(wrapper.find(UnsupportedScreen).length).toEqual(1);
            done()
        }

        const wrapper = mount(
            <CheckForNetwork NetworkNotFoundComponent={NotFoundScreen} supportedNetworks={supportedNetworks}
                             NetworkNotSupportedComponent={UnsupportedScreen} LoadingComponent={LoadingScreen}
                             fetchNetwork={fetchNetworkSuccess("1")} onNetworkIdReceived={onNetworkIdReceived}
                             networkMap={networkMap}>
                <ChildToRender/>
            </CheckForNetwork>
        );

    });
});


