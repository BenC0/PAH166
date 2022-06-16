import test_config from "../test_config.js"
import { Variant, TestElement, TestElements } from "../norman"
import Browse from "../plp/browse"

const conditions = _ => {
    return !!document.querySelector("body")
}

function action() {
    this.log("Action loaded")
    const browse_by = new Browse()
    this.log(browse_by, true)
    browse_by.new_links_element._insert("#searchBasedNavigation_widget", "beforeBegin")
    browse_by.new_links_toggle = new TestElement(`${browse_by.new_links_element.selector} [href="#toggle_links"]`)
    browse_by.new_links_toggle.node.addEventListener("click", e => {
        browse_by._toggle_links()
    })
}

function fallback() {
    this.log("Test can't run, fallback loaded", true)
}

const variation = new Variant(test_config, "Variation 1", conditions, action, fallback)
variation.run()