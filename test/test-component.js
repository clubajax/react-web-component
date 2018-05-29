import BaseComponent from '@clubajax/base-component';
import dom from '@clubajax/dom';

class TestComponent extends BaseComponent {

	set data (data) {
		this.items = data;
	}

	constructor () {
		super();
	}

	domReady () {
		const style = {};
		if (this.border) {
			style.border = '1px solid #ccc';
		}
		dom('div', { html: [
			dom('section', {
				html: this.items.map(item => dom('div', { html: item.label }))
			})
		], style }, this);
	}
}

export default BaseComponent.define('test-component', TestComponent, {
	bools: ['border'],
	props: []
});
