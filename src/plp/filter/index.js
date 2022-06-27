import "./index.css"
import { TestElements, TestElement, getHighestZIndex, watchForChange } from "../../norman";
import Draggabilly from "draggabilly"

export class PriceFacet {
    constructor(facet) {
        this.original_node = facet.node
        this.header = facet._find(".side-nav-level0__header").pop()
        this.header_name = this.header._text()
        this.formatted_name = formatFacetName(this.header_name)
        this.data_attr = JSON.parse(this.original_node.querySelector(`[data-module="range_slider"]`).getAttribute("data-data"))
        this.is_active = false
        this.index = 0
        this.html = this.build_template()
        this.global_min = this.data_attr.min
        this.global_max = this.data_attr.max
    }

    build_template() {
        return `<li class="facet_option" option="${this.formatted_name}" is_active="${this.is_active}">
            <div class="slider">
                <input type="hidden" name="pah166_price_global_min" id="pah166_price_global_min" value="${this.global_min}">
                <input type="hidden" name="pah166_price_global_max" id="pah166_price_global_max" value="${this.global_max}">
                <input type="hidden" name="pah166_price_min" id="pah166_price_min" value="${this.global_min}">
                <input type="hidden" name="pah166_price_max" id="pah166_price_max" value="${this.global_max}">
                <div class="slider_track">
                    <span class="track"></span>
                    <div class="slider_handle" for="min" value="0"></div>
                    <div class="slider_handle" for="max" value="100"></div>
                </div>
            </div>
        </li>`
    }

    calc_x_offset_as_percent(x = 0, handle_width) {
        let maxX = this.element.node.querySelector(`.slider_track .track`).offsetWidth - handle_width
        return x / maxX
    }

    convert_percent_to_price(perc) {
        return parseFloat(this.global_max * perc).toFixed(2)
    }

    init() {
        this.element = new TestElement(`.facet_option[option="Price"]`)
        this.handles = []
        this.draggie_options = {
            axis: "x",
            containment: true,
        }
        this.element._find(".slider_handle").forEach(handle => {
            console.warn(handle)
            let draggie = new Draggabilly(handle.node, this.draggie_options)
            draggie.on("dragMove", e => {
                // console.warn("dragMove", e)
            })
            draggie.on("dragEnd", e => {
                // console.warn("dragEnd", e)
                // Update original and new inputs
                this.handles.forEach(h => {
                    let relevant_input = this.element.node.querySelector(`[name="pah166_price_${h.handle.node.getAttribute("for")}"]`)
                    if(!!relevant_input) {
                        let x = draggie.position.x
                        let percent_offset = this.calc_x_offset_as_percent(x, h.handle.node.offsetWidth)
                        let converted = this.convert_percent_to_price(percent_offset)
                        relevant_input.value = converted
                        h.handle.node.setAttribute("value", converted)
                    }
                })
            })
            this.handles.push({
                draggie, 
                handle,
            })
        })
    }
}

export function formatFacetName(name) { 
    name = name.trim()
    name = name.replace(/  /g, " ");
    name = name.replace(/ /g, "_");
    name = name.replace(/&/g, "and");
    name = name.replace(/"|\<|\>|&/g, "");
    return name
}

export class FacetOption {
    constructor(option) {
        this.original_node = option.node
        this.quantity = ""
        if (!!option.node.querySelector('.side-nav-level2__quantity')) {
            this.quantity = option.node.querySelector('.side-nav-level2__quantity').textContent
        }
        this.is_active = option.node.querySelector('.side-nav-level2__box').classList.contains('active')
        this.name = option.node.getAttribute("title")
        this.formatted_name = formatFacetName(this.name)
        this.original_node.setAttribute("option", this.formatted_name)
    }
}

export class Facet {
    constructor(facet) {
        this.header = facet._find(".side-nav-level0__header").pop()
        this.header_name = this.header._text()
        this.formatted_name = formatFacetName(this.header_name)
        this.values = []
        this.active_values = []
        facet.node.setAttribute("facet", this.formatted_name)
        facet._find(`.side-nav-level2__header`).forEach(element => {
            let fO = new FacetOption(element)
            this.values.push(fO)
            if (fO.is_active) {
                this.active_values.push(fO.name)
            }
        })
        this.active_count = this.active_values.length
        this.quick_facet = new TestQuickFacet(this)
    }
}

export class Facets extends TestElements {
    constructor() {
        super(`#facetSection [data-module="side_nav_level0"]`)
        this._map_facets()
    }

    _map_facets() {
        this.facets = []
        this.facets_active = false
        this._loop(facet => {
            let fc = new Facet(facet)
            if(fc.active_values.length !== 0) {
                this.facets_active = true
            }
            if (fc.header_name !== "Price") {
                this.facets.push(fc)
            } else {
                this.facets.push(new PriceFacet(facet))
            }
        })
    }
}

export class FilterButton extends TestElement {
    constructor() {
        super(`<div test="pah166" class="filter_by">
            <p class="heading">
                <span class="icon">
                    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="1.03223" y1="1.25" x2="14.0322" y2="1.25" stroke="black" stroke-linecap="round"/>
                        <line x1="1.03223" y1="6.69434" x2="14.0322" y2="6.69434" stroke="black" stroke-linecap="round"/>
                        <line x1="1.03223" y1="12.0741" x2="14.0322" y2="12.0741" stroke="black" stroke-linecap="round"/>
                        <path d="M11.8782 7C11.8782 7.72879 11.3419 8.25 10.7628 8.25C10.1838 8.25 9.64746 7.72879 9.64746 7C9.64746 6.27121 10.1838 5.75 10.7628 5.75C11.3419 5.75 11.8782 6.27121 11.8782 7Z" fill="#F5F5F5" stroke="black"/>
                        <path d="M5.4168 1.75C5.4168 2.47879 4.88049 3 4.30142 3C3.72234 3 3.18604 2.47879 3.18604 1.75C3.18604 1.02121 3.72234 0.5 4.30142 0.5C4.88049 0.5 5.4168 1.02121 5.4168 1.75Z" fill="#F5F5F5" stroke="black"/>
                        <path d="M5.4168 12.25C5.4168 12.9788 4.88049 13.5 4.30142 13.5C3.72234 13.5 3.18604 12.9788 3.18604 12.25C3.18604 11.5212 3.72234 11 4.30142 11C4.88049 11 5.4168 11.5212 5.4168 12.25Z" fill="#F5F5F5" stroke="black"/>
                    </svg>
                </span>
                <span class="label">Filter by</span>
            </p>
        </div>`)
    }
}

export class TestQuickFacet extends TestElement {
    constructor(facet) {
        super(`<a href="facet#${facet.formatted_name}" test="pah166" class="facet_link" active_count="${facet.active_count}">${facet.header_name} <span class="count">${facet.active_count}</span></a>`)
    }
}

export class TestFilter {
    constructor(facets, state) {
        this.facets = facets
        this.state = state
        this.facets_html = []
        this.price_facet = null
        this.facets.facets.forEach((facet, index) => {
            this.facets_html.push(this._create_facet_html(facet, index))
            if(facet.header_name == "Price") {
                this.price_facet = facet
            }
        })
        this._init_quick_facets()
        this.html = `<div test="pah166" class="filters ${this.state}" style="z-index: ${getHighestZIndex("*") + 1}">
            <div class="background"></div>
            <div class="facets">
                <header>
                    <p class="title">Filter by</p>
                    <span class="close">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L14 14M14 1L1 14" stroke="black" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </span>
                </header>
                ${this.facets_html.join("")}
                <footer class="cta_container">
                    <a href="#" class="cta clear ghost${this.facets.facets_active ?  " active": ""}">Clear all</a>
                    <a href="#" class="cta view primary">View</a>
                </footer>
            </div>
        </div>`
        this.element = new TestElement(this.html)
        this.element._insert("body", "afterBegin")
        if(!!this.price_facet) {
            this.price_facet.init()
        }
        this._update_cta_count()
        this.facet_headers = this.element._find(".facet_header")
        this.facet_headers.forEach(header => {
            header.node.addEventListener("click", e => {
                this._toggle_facet(e.currentTarget)
            })
        })
        this.facet_options = this.element._find(".facet_option")
        this.facet_options.forEach(option => {
            if(option.node.getAttribute("option") !== "Price") {
                option.node.addEventListener("click", e => {
                    this._select_facet_option(e.currentTarget, this.facets.facets)
                    this._refresh_facets()
                })
            }
        })
        this.product_count = this._get_product_count()

        this.plp_section = new TestElement("#searchBasedNavigation_widget")
        watchForChange(this.plp_section.node, (MutationRecords) => {
            let ready_to_refresh = false
            if(!!MutationRecords) {
                MutationRecords.forEach(record => {
                    record.addedNodes.forEach(addedNode => {
                        if(!!addedNode.classList) {
                            if(addedNode.classList.contains("layout-product-tile-holder")) {
                                ready_to_refresh = true
                            }
                        }
                    })
                })
            }
            if(ready_to_refresh) {
                this._refresh_facets()
                this._update_cta_count()
            }
        }, { subtree: true, childList: true, attributes: false})
    }

    _update_cta_count() {
        this.product_count = this._get_product_count()
        let cta = this.element._find(".cta_container .view")
        cta.forEach(c => c._text(`View (${this.product_count})`))
    }

    _get_product_count() {
        let el = new TestElement(`[data-module="results_view_showing_items"] .showing-items__paragraph`)
        let output = el._text()
        output = output.match(/[0-9]* items/g)
        output = output.pop()
        output = output.replace(/[a-zA-Z]| /g, "")
        return output
    }

    _init_quick_facets() {
        document.querySelector(`.sort_and_filter_container[test="pah166"] .quick_filters`).innerHTML = ""
        this.facets.facets.forEach((facet, index) => {
            if(index < 5) {
                facet.quick_facet._insert(`.sort_and_filter_container[test="pah166"] .quick_filters`, "beforeEnd")
                facet.quick_facet.node.addEventListener("click", e=> {
                    e.preventDefault()
                    let target_facet_selector = `.facet_header[facet="${e.target.getAttribute("href").split("#").pop()}"]`
                    let target_facet = document.querySelector(target_facet_selector)
                    if(!!target_facet) {
                        document.querySelectorAll(".facet_header").forEach(el => el.classList.remove("active"))
                        target_facet.classList.add("active")
                        this.element._class("active")
                    }
                })
            }
        })
    }

    _refresh_facets() {
        this.facets = new Facets()
        this._init_quick_facets()
        let filters_clear = this.element._find(".cta_container .clear")
        if (this.facets.facets_active) {
            filters_clear.forEach(el => el._class("active", true))
        } else {
            filters_clear.forEach(el => el._class("active", false))
        }
        // loop through facets
        this.facets.facets.forEach(facet => {
            // loop through options
            let facet_name = facet.formatted_name
            let facet_el = document.querySelector(`.facet_options[facet="${facet_name}"]`)
            if(!!facet_el) {
                let facet_container = new TestElement(`.facet_options[facet="${facet_name}"]`)
                facet.values.forEach(value => {
                    let option_name = value.formatted_name
                    let preexisting = facet_el.querySelector(`.facet_option[option="${option_name}"]`)
                    let exists = !!preexisting
                    if(exists) {
                        // if option already exists
                        // update quantity & active state
                        preexisting.querySelector(".quantity").textContent = value.quantity
                        preexisting.setAttribute("is_active", value.is_active)
                    } else {
                        // if option not exists
                        // create option and add to facet
                        let value_html = this._create_option_html(value)
                        facet_container._append(value_html)
                    }
                })
            } else {
                // if facet doesn't already exist, create it
                let new_facet_html = this._create_facet_html(facet)
                let container = new TestElement(".filters[test=pah166] .facets")
                container._append(new_facet_html)
            }
        })
    }

    _create_option_html(option, index) {
        return `<li class="facet_option" option="${option.formatted_name}" is_active="${option.is_active}">
            <span class="checkbox"></span>
            <span class="name">${option.name}</span>
            <span class="quantity">${option.quantity}</span>
        </li>`
    }
    
    _create_facet_html(facet, index) {
        let header_html = `<header class="facet_header" facet="${facet.formatted_name}">
            <span class="name">${facet.header_name}</span>
            <div class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20.6 8.3c0 .1-.1.3-.2.4l-8.2 8.2c-.1 0-.2.1-.4.1s-.3-.1-.4-.2L3.3 8.7c-.1-.1-.2-.3-.2-.4 0-.1.1-.3.2-.4l.8-.9c.1-.1.3-.2.4-.2.2 0 .4.1.5.2l6.9 6.9L18.7 7c.1-.1.3-.2.4-.2s.3.1.4.2l.9.9c.1.1.2.2.2.4z" fill="#000"/></svg>
            </div>
        </header>`
        let options_html = ``
        if(facet.header_name == "Price") {
            options_html = `<ul class="facet_options" facet="${facet.formatted_name}">
                ${facet.html}
            </ul>`
        } else {
            options_html = `<ul class="facet_options" facet="${facet.formatted_name}">
                ${facet.values.map((value, index) => this._create_option_html(value, index)).join("")}
            </ul>`
        }
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

    _find_facet_option(target) {
        let facet_index = target.parentNode.getAttribute("facet");
        let target_facet = document.querySelector(`.side-nav-level0[facet="${facet_index}"]`)
        if(!!target_facet) {
            let option_index = target.getAttribute("option");
            let target_option = target_facet.querySelector(`[option="${option_index}"]`)
            return target_option
        } else {
            return null
        }
    }

    _select_facet_option(target, facets) {
        let selected_option = this._find_facet_option(target)
        selected_option.click()
    }
}

export class Filter extends TestElement {
    constructor() {
        super(`#facetSection`)
        this.facets = new Facets()
        this.new_filters = new TestFilter(this.facets, "")
        this.cta = new FilterButton()
        this.filters_close = this.new_filters.element._find(".close, .background, .cta.view")
        this.filters_close.forEach(close => {
            close.node.addEventListener("click", e => {
                this._hide_filters()
            })
        })
        this.filters_clear = this.new_filters.element._find(".cta.clear")
        this.filters_clear.forEach(el => {
            el.node.addEventListener("click", SearchBasedNavigationDisplayJS.clearSearchFilter)
        })
        this.cta._insert(`.sort_and_filter_container[test="pah166"]`, "beforeEnd")
        this.cta.node.addEventListener("click", e => {
            this._toggle_filters()
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
