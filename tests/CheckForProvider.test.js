import React from 'react';
import {mount} from 'enzyme';
import CheckForProvider from "../src/CheckForProvider";
import {ChildToRender, UnsupportedScreen, LoadingScreen} from "./utils";


const fetchProviderSuccess = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("ethereum");
        }, 200);
    });
}

const fetchProviderFailure = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject("No provider");
        }, 200);
    });
}



describe('<CheckForProvider />', () => {

    it("should render loading state", () => {
        const wrapper = mount(
            <CheckForProvider ProviderUnavailableComponent={UnsupportedScreen} LoadingComponent={LoadingScreen}
                              fetchProvider={fetchProviderSuccess}>
                <ChildToRender/>
            </CheckForProvider>
        );
        expect(wrapper.find(LoadingScreen).length).toEqual(1);

    });

    it("should receive a web3 provider and render the supplied children", (done) => {

        const onProviderReceived = (provider) => {
            expect(provider).toEqual("ethereum");
            wrapper.update();
            expect(wrapper.find(ChildToRender).length).toEqual(1);
            done()
        }

        const wrapper = mount(
            <CheckForProvider ProviderUnavailableComponent={UnsupportedScreen}
                              LoadingComponent={LoadingScreen}
                              fetchProvider={fetchProviderSuccess}
                              onProviderReceived={onProviderReceived}>
                <ChildToRender/>
            </CheckForProvider>
        );

    });

    it("should not receive a provider and render the not unavailable screen", (done) => {

        const onProviderReceived = (provider) => {
            expect(provider).toEqual(null);
            wrapper.update();
            expect(wrapper.find(UnsupportedScreen).length).toEqual(1);
            done()
        }

        const wrapper = mount(
            <CheckForProvider ProviderUnavailableComponent={UnsupportedScreen}
                              onProviderReceived={LoadingScreen}
                              fetchProvider={fetchProviderFailure}
                              onProviderReceived={onProviderReceived}>
                <ChildToRender/>
            </CheckForProvider>
        );

    });






});


