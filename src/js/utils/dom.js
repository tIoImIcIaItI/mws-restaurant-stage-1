/*globals document, scroll, Element */

// Derived from my earlier project at https://github.com/tIoImIcIaItI/Restaurant-Reviews-App

(function (global) {
	'use strict';

	// DOM helper to remove an element from the tree
	// ADAPTED FROM: http://stackoverflow.com/questions/3387427/remove-element-by-id
	Element.prototype.remove = function () {
		this.parentElement.removeChild(this);
	};

	// DOM helper analogous to appendChild()
	// ADAPTED FROM: http://callmenick.com/post/prepend-child-javascript
	Element.prototype.prependChild = Element.prototype.prependChild || function (newChild) {

		this.insertBefore(newChild, this.firstChild);
	};

	// ADAPTED FROM: http://stackoverflow.com/a/4793630/6452184
	Element.prototype.insertAfter = function (newNode) {
		this.parentNode.insertBefore(newNode, this.nextSibling);
	}

	// NORMALIZATION for browsers that don't support second argument to classList.toggle()
	Element.prototype.addOrRemoveClass = function (className, add) {

		if (add)
			this.classList.add(className);
		else
			this.classList.remove(className);
	};

	// Add an attribute without a value to this DOM element
	Element.prototype.addAttribute = function (attributeName) {

		this.setAttribute(attributeName, '');
	};

	// DOM helper for creating a new element by tag name and
	// immediately setting its textContent
	global.newTextElement = function (tag, textContent) {

		var elem = document.createElement(tag);
		elem.textContent = textContent;
		return elem;
	};

	// Trivial wrapper in case we want to do more later, ex. animation
	global.scrollToTop = function () {

		scroll(0, 0);
	};

	// Trivial wrapper in case we want to do more later, ex. animation
	global.scrollToId = function (id) {

		document.getElementById(id).scrollIntoView();
	};

	// Creates a fully-configured element from a Font Awesome glyph
	global.newLabelGlyph = function (faName, title, customClass) {

		var glyph = newTextElement('i', '');

		glyph.classList.add('fa');
		glyph.classList.add(faName);

		if (customClass)
			glyph.classList.add(customClass);

		if (title)
			glyph.title = title;

		return glyph;
	};

	// Creates and appends a Font Awesome glyph as a child of the given element
	global.appendGlyph = function (parent, faName, title) {

		var glyph = newLabelGlyph(faName, title);
		parent.appendChild(glyph);

		return glyph;
	};

	// Creates and prepends a Font Awesome glyph as a child of the given element
	global.prependGlyph = function (parent, faName, title) {

		var glyph = newLabelGlyph(faName, title);
		parent.insertBefore(glyph, parent.firstChild);

		return glyph;
	};

	// While the internet debates the multitude of ways to accomplish this,
	// we'll choose the simplest solution for now.
	global.removeAllChildren = function (el) {

		el.innerHTML = '';
	};

	// ReSharper disable once InconsistentNaming
	global.SeekOrigin = {
		begin: 0,
		current: 1,
		end: 2
	};

	// TODO: filter, begin, end support
	global.seekSiblingOf = function (el, origin, offset/*, filter*/) {

		if (!el) throw new Error('Must supply an element');
		if (!el.parentNode) throw new Error('Must supply an element that is a child of some other element');

		origin = origin || SeekOrigin.begin;

		var res = null;

		// TODO: filter

		switch (origin) {
			case SeekOrigin.begin:
				// TODO
				break;

			case SeekOrigin.current:
				if (offset > 0) {

					do {
						res = el.nextSibling;
					} while (res && offset-- > 1);

				} else {

					offset *= -1;
					do {
						res = el.previousSibling;
					} while (res && offset-- > 1);

				}
				break;

			case SeekOrigin.end:
				// TODO
				break;

			default:
				break;
		}

		return res;
	};

	// Returns the previous sibling of a wrapped element
	global.previousWrappedSiblingOf = function (el, filter) {
		var res = seekSiblingOf(el, SeekOrigin.current, -1, filter);
		return res ? res.firstElementChild : null;
	};

	// Returns the next sibling of a wrapped element
	global.nextWrappedSiblingOf = function (el, filter) {
		var res = seekSiblingOf(el, SeekOrigin.current, 1, filter);
		return res ? res.firstElementChild : null;
	};

	// ReSharper disable once ThisInGlobalContext
}(window));
