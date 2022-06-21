import "./index.css"
import { TestElement, TestElements } from "../../norman";

export default class Sort extends TestElement {
    constructor() {
        super(`#be-sortselector`)
        this.original_options = new TestElements(`${this.selector} option`)
        this.original_options_html = []
        this.new_options_html = []
        this.current_sorting = null
        this.original_options._loop((option, index) => {
            this.original_options_html.push(option._html())
            this.new_options_html.push(this._convert_html(option))
            if(option.node.hasAttribute("selected")) {
                this.current_sorting = option._text()
            }
        })
        this.new_sort_html = this._create_sort_html()
        this.new_sort = new TestElement(this.new_sort_html)
        this.original_custom_dropdown_els = this._get_original_custom_dropdown_els()
    }

    _create_sort_html() {
        return `<div class="sort_by" test="pah166">
            <p class="heading">Sort by${!!this.current_sorting ? `: ${this.current_sorting}` : ""}</p>
            <div class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20.6 8.3c0 .1-.1.3-.2.4l-8.2 8.2c-.1 0-.2.1-.4.1s-.3-.1-.4-.2L3.3 8.7c-.1-.1-.2-.3-.2-.4 0-.1.1-.3.2-.4l.8-.9c.1-.1.3-.2.4-.2.2 0 .4.1.5.2l6.9 6.9L18.7 7c.1-.1.3-.2.4-.2s.3.1.4.2l.9.9c.1.1.2.2.2.4z" fill="#000"/></svg>
            </div>
            <ul name="sort_by_select" id="sort_by_select">
                ${this.new_options_html.join("")}
            </ul>
        </div>`
    }

    _update_current_sorting() {
        this.original_options = new TestElements(`${this.selector} option`)
        this.original_options._loop((option, index) => {
            if(option.node.hasAttribute("selected")) {
                this.current_sorting = option._text()
            }
        })
    }

    _update_sort_title() {
        this._update_current_sorting()
        let title = `Sort by${!!this.current_sorting ? `: ${this.current_sorting}` : ""}`
        this.new_sort._find(".heading").forEach(element => element._text(title))
    }

    _convert_html(option) {
        return `<li value="${option.node.value}" class="sort_option">${option._text()}</li>`
    }

    _update_old(event, sort_by) {
        let new_sort_value = event.currentTarget.getAttribute("value")
        sort_by.node.value = new_sort_value
        let original_custom_dropdown_el = sort_by._get_original_custom_dropdown_option_el(new_sort_value)
        original_custom_dropdown_el.node.click()
    }

    _get_original_custom_dropdown_els() {
        let selectors = [
            `[data-module="input_select"]`,
            `[data-module="input_select"] .input-select__label`,
            `[data-module="input_select"] .input-select__list-wrapper`,
        ]
        let custom_dropdowns = new TestElements(selectors.join(","))
        return custom_dropdowns
    }

    _get_original_custom_dropdown_option_el(value) {
        return new TestElement(`[data-module="input_select"] .input-select__list-item-flat[data-value="${value}"]`)
    }
}