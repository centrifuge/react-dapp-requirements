import React from 'react';
import {mount} from 'enzyme';
import CheckForWeb3 from "../src/CheckForWeb3";
import {UnsupportedScreen, ChildToRender} from "./utils";


const hasWeb3 = () => true;
const noWeb3 = () => false;

describe('<CheckForWeb3 />', () => {

    it("should render the supplied child", () => {
        const wrapper = mount(
            <CheckForWeb3 Web3UnvailableComponent={UnsupportedScreen} web3Provided={hasWeb3}>
                <ChildToRender/>
            </CheckForWeb3>
        );
        expect(wrapper.find(ChildToRender).length).toEqual(1);
        expect(wrapper.find(UnsupportedScreen).length).toEqual(0);
    });

    it("should should  render the unsupported screen", () => {
        const wrapper = mount(
            <CheckForWeb3 Web3UnvailableComponent={UnsupportedScreen} web3Provided={noWeb3}>
                <ChildToRender/>
            </CheckForWeb3>
        );
        expect(wrapper.find(ChildToRender).length).toEqual(0);
        expect(wrapper.find(UnsupportedScreen).length).toEqual(1);
    });


});


