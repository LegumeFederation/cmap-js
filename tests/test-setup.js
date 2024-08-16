import o from "ospec";
import { JSDOM } from "jsdom";
import m from "mithril";

const dom = new JSDOM("", {
    // So we can get `requestAnimationFrame`
    pretendToBeVisual: true,
});
global.navigator = {
    userAgent: 'node.js',
};

// Fill in the globals Mithril.js needs to operate.
global.window = dom.window;
global.document = dom.window.document;
global.requestAnimationFrame = dom.window.requestAnimationFrame;

// Ensure JSDOM ends when the tests end.
o.after(() => {
    dom.window.close();
});

export { m };
