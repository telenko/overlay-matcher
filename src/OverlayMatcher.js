import { defineMatcher } from '@telenko/matcher';

const CONTAINER = Symbol();
const ON_RESIZE = Symbol();

class Overlay {

    connectedCallback() {
        this[ON_RESIZE] = e => {
            applyDimensions.call(this, e.detail);
        };
        this.element.addEventListener("resize", this[ON_RESIZE]);

        this[CONTAINER] = document.createElement("div");
        this[CONTAINER].setAttribute("overlay-matcher", "");
        this[CONTAINER].style.position = "absolute";
        this[CONTAINER].style.zIndex = new String((+window.getComputedStyle(this.element).zIndex || 0) + 1);
        document.body.appendChild(this[CONTAINER]);

        applyStyle.call(this);
        applyDimensions.call(this, this.element.getBoundingClientRect());
    }

    disconnectedCallback() {
        this[CONTAINER].remove();
        this.element.removeEventListener("resize", this[ON_RESIZE]);
    }

    attributeChangedCallback() {
        applyStyle.call(this);
    }

    static get observedAttributes() {
        return ["overlay-class"];
    }

}

function applyStyle() {
    const style = this.element.getAttribute("overlay-class") || "";
    this[CONTAINER].setAttribute("class", style);
}

function applyDimensions({ left, top, width, height }) {
    this[CONTAINER].style.left = `${left + (window.scrolX || 0)}px`;
    this[CONTAINER].style.top = `${top + (window.scrollY || 0)}px`;
    this[CONTAINER].style.width = `${width}px`;
    this[CONTAINER].style.height = `${height}px`;
}

defineMatcher("[show-overlay]", Overlay);