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
        return `<div test="pah166" class="browse_links">${this.new_links_html.join("")}</div>`
    }

    _get_original_links() {
        return new TestElements(`${this.selector} .side-nav-category__item-link`)
    }

    _format_link(link, index) {
        return `<a href="${link.node.getAttribute("href")}" test="pah166" class="browse_link" tabindex=${index}>${link._text()}</a>`
    }
}