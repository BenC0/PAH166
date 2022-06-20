import "./index.css"
import { TestElements, TestElement, getHighestZIndex, watchForChange, debounce, Test } from "../../norman";

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
    constructor(facets, state) {
        this.facets = facets
        this.state = state
        this.facets_html = []
        this.facets.facets.forEach((facet, index) => {
            this.facets_html.push(this._create_facet_html(facet, index))
        })
        this.html = `<div test="pah166" class="filters ${this.state}" style="z-index: ${getHighestZIndex("*") + 1}">
            <div class="background"></div>
            <div class="facets">
                <header>
                    <p class="title">Filter by</p>
                    <span class="close">X</span>
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
        this._update_cta_count()
        this.facet_headers = this.element._find(".facet_header")
        this.facet_headers.forEach(header => {
            header.node.addEventListener("click", e => {
                this._toggle_facet(e.currentTarget)
            })
        })
        this.facet_options = this.element._find(".facet_option")
        this.facet_options.forEach(option => {
            option.node.addEventListener("click", e => {
                this._select_facet_option(e.currentTarget, this.facets.facets)
                this._refresh_facets()
            })
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

    _refresh_facets() {
        this.facets = new Facets()
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
            <span class="chevron">></span>
        </header>`
        let options_html = `<ul class="facet_options" facet="${facet.formatted_name}">
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
        this.cta = new FilterButton()
        this.cta._insert(".sort_and_filter_container", "afterBegin")
        this.new_filters = new TestFilter(this.facets, "")
        this.cta.node.addEventListener("click", e => {
            this._toggle_filters()
        })
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
