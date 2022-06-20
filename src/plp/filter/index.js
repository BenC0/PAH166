import "./index.css"
import { TestElements, TestElement, getHighestZIndex } from "../../norman";

export class FacetOption {
    constructor(option) {
        this.original_node = option
        this.quantity = ""
        if (!!option.node.querySelector('.side-nav-level2__quantity')) {
            this.quantity = option.node.querySelector('.side-nav-level2__quantity').textContent
        }
        this.name = option.node.getAttribute("title")
    }
}

export class Facet {
    constructor(facet) {
        this.header = facet._find(".side-nav-level0__header").pop()
        this.header_name = this.header._text()
        this.values = []
        facet._find(`.side-nav-level2__header`).forEach(element => {
            this.values.push(new FacetOption(element))
        })
    }
}

export class Facets extends TestElements {
    constructor() {
        super(`#facetSection [data-module="side_nav_level0"]`)
        this._map_facets()
    }

    _map_facets() {
        this.facets = []
        this._loop(facet => {
            let fc = new Facet(facet)
            if (fc.header_name !== "Price") {
                this.facets.push(fc)
            }
        })
    }
}

export class FilterButton extends TestElement {
    constructor() {
        super(`<div test="pah166" class="filter_by">
            <p class="heading">
                <span class="label">Filter by</span>
            </p>
        </div>`)
    }
}

export class TestFilter {
    constructor(facets) {
        this.facets = facets.facets
        this.facets_html = []
        this.facets.forEach((facet, index) => {
            this.facets_html.push(this._create_facet_html(facet, index))
        })
        this.html = `<div test="pah166" class="filters" style="z-index: ${getHighestZIndex("*") + 1}">
            <div class="background"></div>
            <div class="facets">
                <header>
                    <p class="title">Filter by</p>
                    <span class="close">X</span>
                </header>
                ${this.facets_html.join("")}
            </div>
        </div>`
        this.element = new TestElement(this.html)
        this.element._insert("body", "afterBegin")
        this.facet_headers = this.element._find(".facet_header")
        this.facet_headers.forEach(header => {
            header.node.addEventListener("click", e => {
                this._toggle_facet(e.currentTarget)
            })
        })
        this.facet_options = this.element._find(".facet_option")
        this.facet_options.forEach(option => {
            option.node.addEventListener("click", e => {
                this._select_facet_option(e.currentTarget, this.facets)
                this.facets = new Facets().facets
            })
        })
    }

    _create_option_html(option, index) {
        return `<li class="facet_option" option-index="${index}">
            <span class="name">${option.name}</span>
            <span class="quantity">${option.quantity}</span>
        </li>`
    }
    
    _create_facet_html(facet, index) {
        let header_html = `<header class="facet_header">
            <span class="name">${facet.header_name}</span>
            <span class="chevron">></span>
        </header>`
        let options_html = `<ul class="facet_options" facet-index="${index}">
            ${facet.values.map((value, index) => this._create_option_html(value, index)).join("")}
        </ul>`
        return `<div class="facet">
            ${header_html}
            ${options_html}
        </div>`
    }

    _toggle_facet(node) {
        if (!node.classList.contains("active")) {
            node.classList.add("active")
        } else {
            node.classList.remove("active")
        }
    }

    _select_facet_option(target, facets) {
        let facet_index = parseInt(target.parentNode.getAttribute("facet-index"));
        let option_index = parseInt(target.getAttribute("option-index"));
        let selected_option = facets[facet_index].values[option_index]
        selected_option.original_node.node.click()
    }
}

export class Filter extends TestElement {
    constructor() {
        super(`#facetSection`)
        this.facets = new Facets()
        this.cta = new FilterButton()
        this.cta._insert(".sort_and_filter_container", "afterBegin")
        this.new_filters = new TestFilter(this.facets)
        this.cta.node.addEventListener("click", e => {
            this._toggle_filters()
        })
        this.filters_close = this.new_filters.element._find(".close")
        this.filters_close.forEach(close => {
            close.node.addEventListener("click", e => {
                this._hide_filters()
            })
        })
    }

    _toggle_filters() {
        if (this.new_filters.element._class().contains("active")) {
            this._hide_filters()
        } else {
            this._show_filters()
        }
    }

    _show_filters() {
        this.new_filters.element._class("active")
        document.querySelectorAll("body, html").forEach(el => el.style.overflow = "hidden")
    }
    
    _hide_filters() {
        this.new_filters.element._class("active", false)
        document.querySelectorAll("body, html").forEach(el => el.style.overflow = "auto")
    }
}
