import "./sort_and_filter_container.css"
import { TestElement, getHighestZIndex } from "../../norman"

export default function _init_sort_and_filter_container() {
    if(!!document.querySelector(`.sort_and_filter_container[test="pah166"]`)) {
        return new TestElement(`.sort_and_filter_container[test="pah166"]`)
    }
    let zindex = getHighestZIndex("*") + 1
    let container = new TestElement(`<div class="sort_and_filter_container" test="pah166" style="z-index:${zindex}"></div>`)
    container._insert("#searchBasedNavigation_widget", "beforeBegin")
    return container
}