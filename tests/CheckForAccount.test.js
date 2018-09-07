import React, {Component} from 'react';
import {mount} from 'enzyme';
import CheckForAccount from "../src/CheckForAccount";
import {ChildToRender, UnsupportedScreen, LoadingScreen} from "./utils";


const fetchAccountSuccess = (account) => () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([account]);
        }, 200);
    });
}

const fetchAccountFailure = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([]);
        }, 200);
    });
}

describe('<CheckForAccount />', () => {

    it("should render loading state", () => {
        const wrapper = mount(
            <CheckForAccount AccountUnvailableComponent={UnsupportedScreen} LoadingComponent={LoadingScreen}
                             fetchAccount={() => true}>
                <ChildToRender/>
            </CheckForAccount>
        );
        expect(wrapper.find(LoadingScreen).length).toEqual(1);

    });

    it("should receive an account and render the supplied children", (done) => {

        const onAccountChange = (account) => {
            expect(account).toEqual(2);
            wrapper.update();
            expect(wrapper.find(ChildToRender).length).toEqual(1);
            done()
        }

        const wrapper = mount(
            <CheckForAccount AccountUnvailableComponent={UnsupportedScreen} LoadingComponent={LoadingScreen}
                             fetchAccount={fetchAccountSuccess(2)} onAccountChange={onAccountChange}>
                <ChildToRender/>
            </CheckForAccount>
        );

    });


    it("should not receive an account and render the unsupported screen", (done) => {

        const onAccountChange = (account) => {
            expect(account).toEqual(null);
            wrapper.update();
            expect(wrapper.find(UnsupportedScreen).length).toEqual(1);
            done()
        }

        const wrapper = mount(
            <CheckForAccount AccountUnvailableComponent={UnsupportedScreen} LoadingComponent={LoadingScreen}
                             fetchAccount={fetchAccountFailure} onAccountChange={onAccountChange}>
                <ChildToRender/>
            </CheckForAccount>
        );

    });
});


