import "./index.css"
import { TestElement, TestElements } from "../../norman";

export default class Browse extends TestElement {
    constructor() {
        super(`[data-module="side_nav_category"]`)
        this.original_links = this._get_original_links()
        this.new_links_html = []
        this.original_links._loop((link, index) => {
            let link_html = this._format_link(link, index)
            this.new_links_html.push(link_html)
        })
        this.new_links_element = new TestElement(this._create_new_link_element_html())
    }

    _create_new_link_element_html() {
        return `<div test="pah166" class="browse_links">
            ${this.new_links_html.join("")}
            <a href="#toggle_links" test="pah166" class="browse_link" tabindex=${this.new_links_html.length}>
                <span class="show_links">+</span>
                <span class="hide_links">-</span>
            </a>
        </div>`
    }

    _get_original_links() {
        return new TestElements(`${this.selector} .side-nav-category__item-link`)
    }

    _format_link(link, index) {
        return `<a href="${link.node.getAttribute("href")}" test="pah166" class="browse_link" tabindex=${index}>${link._text()}</a>`
    }

    _toggle_links() {
        if(this.new_links_element._class().contains("show_all")) {
            this._hide_links()
        } else {
            this._show_links()
        }
    }

    _show_links() {
        this.new_links_element._class("show_all")
    }

    _hide_links() {
        this.new_links_element._class("show_all", false)
    }

    format_px_as_x(px) {
        return parseInt(px.replace(/[a-zA-Z]/g, ""))
    }

    calc_cutoff() {
        let total_width = this.new_links_element.node.offsetWidth
        let links = this.new_links_element.node.querySelectorAll(".browse_link")
        let link_widths = [...links].map(a => {
            let width = a.offsetWidth
            let marginRight = this.format_px_as_x(getComputedStyle(a).marginRight)
            return width + marginRight
        })
        let x = 0
        let linkCount = 0
        while (x <= total_width) {
            x += link_widths[linkCount]
            linkCount++
        }
        return linkCount - 1
    }
}