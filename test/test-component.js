import BaseComponent from "@clubajax/base-component";
import dom from "@clubajax/dom";

class TestComponent extends BaseComponent {
    set data(data) {
        this.items = data;
    }

    constructor() {
        super();
    }

    domReady() {
        const style = {};
        if (this.border) {
            style.border = "1px solid #ccc";
        }
        dom(
            "div",
            {
                html: [
                    dom("label", {html: "Test Component"}),
                    dom("section", {
                        html: this.items.map(item => dom("div", {html: item.label}))
                    })
                ],
                style
            },
            this
        );

        const label = dom.query(this, 'label');
        const section = dom.query(this, 'section');

        this.on(label, 'click', () => {
            this.fire('label-click');
        });
        this.on(section, 'click', () => {
            this.fire('section-click');
        });
    }
}

export default BaseComponent.define("test-component", TestComponent, {
    bools: ["border"],
    props: []
});
