import React, {Component} from 'react';
import {mount} from 'enzyme';
import CheckForBrowser from "../src/CkeckForBrowser";
import {ChildToRender, UnsupportedScreen} from "./utils";


const browserSupported = () => true;
const browserUnsupported = () => false;


describe('<CheckForBrowser />', () => {

    it("should render the supplied child", () => {
        const wrapper = mount(
            <CheckForBrowser BrowserUnsupportedComponent={UnsupportedScreen} isBrowserSupported={browserSupported}>
                <ChildToRender/>
            </CheckForBrowser>
        );
        expect(wrapper.find(ChildToRender).length).toEqual(1);
        expect(wrapper.find(UnsupportedScreen).length).toEqual(0);
    });

    it("should should  render the unsupported screen", () => {
        const wrapper = mount(
            <CheckForBrowser BrowserUnsupportedComponent={UnsupportedScreen} isBrowserSupported={browserUnsupported}>
                <ChildToRender/>
            </CheckForBrowser>
        );
        expect(wrapper.find(ChildToRender).length).toEqual(0);
        expect(wrapper.find(UnsupportedScreen).length).toEqual(1);
    });


});


