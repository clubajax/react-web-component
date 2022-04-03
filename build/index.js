import React, { Component } from 'react';

export default class WebComponent extends Component {

	get value () {
		return this.node ? this.node.value : null;
	}

	shouldComponentUpdate (props) {
		const changed = {};
		Object.keys(props).forEach((key) => {
			if (typeof props[key] !== 'function' && !isEqual(props[key], this.props[key], props.deep)) {
				changed[key] = props[key];
			}
		});

		if (Object.keys(changed).length) {
            setTimeout(() => {
                this.update(changed);
            }, 1);
		}
		return false;
	}

	componentWillUnmount () {
		this.removeListeners();
		if (this.props.onUnmount) {
			this.props.onUnmount(this.node);
		}
	}

	removeListeners () {
		if (this.listeners) {
			this.listeners.forEach((fn) => {
				fn();
			});
		}
	}

	connect (node) {
		if (!node) {
			return;
		}
		this.node = node;
		this.removeListeners();

		this.listeners = [];

        Object.keys(this.props).forEach((key) => {
            if (this.props[key] === null) {
                return;
            }
            if (typeof this.props[key] === 'function') {
                const eventName = toEventName(key);
                if (eventName) {
                    this.node.addEventListener(eventName, this.props[key]);
                    this.listeners.push(() => {
                        this.node.removeEventListener(eventName, this.props[key]);
                    });
                } else {
                    this.node[key] = this.props[key];
                }
			} else if (typeof this.props[key] === 'object' && key !== 'children') {
				this.node[key] = this.props[key];
			}
		});
	}

	update (props) {
		// update objects before properties
		// ergo, we want to set options before value
		Object.keys(props).forEach((key) => {
			if (typeof props[key] === 'object') {
				this.node[key] = props[key];
			}
		});

		Object.keys(props).forEach((key) => {
			if (typeof props[key] !== 'function' && typeof props[key] !== 'object') {
				this.node[key] = props[key];
			}
		});
	}

	render () {
		const props = this.props;
		const attributes = {
			ref: (node) => {
				this.connect(node);
			},
			class: props.className
		};
		Object.keys(props).forEach((key) => {
			if (typeof props[key] !== 'function' && typeof props[key] !== 'object' && key !== 'children') {
				attributes[key] = props[key];
			}
		});

		return React.createElement(this.props.component, attributes, props.children);
	}
}


function toEventName (word) {
    const onReg = /^on/;
    if (!onReg.test(word)) {
        return null;
    }
    return word.replace(onReg, '').replace( /([A-Z])/g, ' $1').trim().split(' ').join('-').toLowerCase();
}

function isEqual(a, b, deep) {
    const typeA = getType(a);
    const typeB = getType(b);
    if (typeA !== typeB) {
        return false;
    }
    if (typeA === 'array') {
        if (deep) {
            return equal(a, b);
        }
        return a.length === b.length;
    }

    if (typeA === 'object') {
        if (deep) {
            return equal(a, b);
        }
        return Object.keys(a).length === Object.keys(b).length;
    }

    return equal(a, b);
}

function equal (a, b) {
    const typeA = getType(a);
    const typeB = getType(b);
    if (typeA !== typeB) {
        return false;
    }
    const type = typeA;
    if (/number|string|boolean/.test(type)){
        return a === b;
    }

    if (type === 'date') {
        return a.getTime() === b.getTime();
    }

    if (type === 'nan') {
        return true;
    }

    if (type === 'array') {
        return a.length === b.length && a.every((item, i) => {
            return equal(item, b[i]);
        });
    }

    if (type === 'object' || type === 'map' || type === 'set') {
        return Object.keys(a).every((key) => {
            return equal(a[key], b[key]);
        })
    }

    return a === b;
}

function getType (item) {

    if (item === null) {
        return 'null';
    }
    if (typeof item === 'object') {
        if (Array.isArray(item)) {
            return 'array';
        }
        if (item instanceof Date) {
            return 'date';
        }
        if (item instanceof Promise) {
            return 'promise';
        }
        if (item instanceof Error) {
            return 'error';
        }
        if (item instanceof Map) {
            return 'map';
        }
        if (item instanceof WeakMap) {
            return 'weakmap';
        }
        if (item instanceof Set) {
            return 'set';
        }
        if (item instanceof WeakSet) {
            return 'weakset';
        }
        if (item === global) {
            if (typeof window !== undefined) {
                return 'window';
            }
            return 'global';
        }
        if (item.documentElement || item.innerHTML !== undefined) {
            return 'html';
        }
        if(item.length !== undefined && item.callee) {
            return 'arguments'
        }
    }
    if (typeof item === 'number' && isNaN(item)) {
        return 'nan';
    }
    return typeof item;
}