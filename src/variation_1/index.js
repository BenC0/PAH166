import "./index.css"
import test_config from "../test_config.js"
import { Variant, TestElement, TestElements } from "../norman"
import Browse from "../plp/browse"

const conditions = _ => {
    return !!document.querySelector("body")
}

function add_browse_by(variation) {
    variation.log(browse_by, true)
    const browse_by = new Browse()
    browse_by.new_links_element._insert("#searchBasedNavigation_widget", "beforeBegin")
    browse_by.new_links_toggle = new TestElement(`${browse_by.new_links_element.selector} [href="#toggle_links"]`)
    if (browse_by.original_links.nodes.length > 5) {
        browse_by.new_links_toggle.node.addEventListener("click", e => {
            browse_by._toggle_links()
        })
    } else {
        browse_by.new_links_toggle.node.remove()
    }
}

function action() {
    this.log("Action loaded")
    add_browse_by(this)
}

function fallback() {
    this.log("Test can't run, fallback loaded", true)
}

const variation = new Variant(test_config, "Variation 1", conditions, action, fallback)
variation.run()