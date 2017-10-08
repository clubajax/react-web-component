import React, { Component } from 'react';

export default class WebComponent extends Component {

	get value () {
		return this.node ? this.node.value : null;
	}

	shouldComponentUpdate (props) {
		const changed = {};
		Object.keys(props).forEach((key) => {
			if (!isEqual(props[key], this.props[key])) {
				changed[key] = props[key];
			}
		});

		if (Object.keys(changed).length) {
			this.update(changed);
		}
		return false;
	}

	componentWillUnmount () {
		this.removeListeners();
	}

	removeListeners () {
		if (this.listeners) {
			this.listeners.forEach((fn) => {
				fn();
			});
		}
	}

	listen (node) {
		if (!node) {
			return;
		}
		this.node = node;
		this.removeListeners();

		this.listeners = [];

		Object.keys(this.props).forEach((key) => {
			if (typeof this.props[key] === 'function') {
				const eventName = toEventName(key);
				this.node.addEventListener(eventName, this.props[key]);
				this.listeners.push(() => {
					this.node.removeEventListener(eventName, this.props[key]);
				});
			}
		});
	}

	update (props) {
		Object.keys(props).forEach((key) => {
			if (typeof props[key] !== 'function') {
				this.node[key] = props[key];
			}
		});
	}

	render () {
		const props = this.props;
		const attributes = {
			ref: (node) => {
				this.listen(node);
			}
		};
		Object.keys(props).forEach((key) => {
			if (typeof props[key] !== 'function') {
				attributes[key] = props[key];
			}
		});

		return React.createElement(this.props.component, attributes);
	}
}


function toEventName (word) {
	const onReg = /^on/;
	return word.replace(onReg, '').toLowerCase();
}

function isEqual (a, b) {
	return JSON.stringify(a) === JSON.stringify(b);
}