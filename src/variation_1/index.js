import "./index.css"
import test_config from "../test_config.js"
import { Variant, TestElement, TestElements, watchForChange } from "../norman"
import Browse from "../plp/browse"
import Sort from "../plp/sort"
import { Filter, FilterButton } from "../plp/filter"
import _init_sort_and_filter_container from "../plp/common/init_sort_and_filter_container"

const conditions = _ => {
    return !!document.querySelector("body")
}

function update_layout() {
    const layout = new TestElement(`[data-module="container_80"]`)
    layout._class("container-100")
    layout._class("container-80", false)
}

function add_filter(variation) {
    const filter = new Filter(variation)
    variation.log(filter)
}

function add_sort_by(variation) {
    const sort_by = new Sort()
    variation.log(sort_by)
    sort_by.new_sort._insert(`.sort_and_filter_container[test="pah166"]`, "beforeEnd")
    sort_by.new_sort.node.addEventListener("click", e => {
        let t = e.path[0]
        if(!t.classList.contains("sort_option")) {
            if(sort_by.new_sort._class().contains("active")) {
                sort_by.new_sort._class("active", false)
            } else {
                sort_by.new_sort._class("active")
            }
        }
    })
    document.body.addEventListener("click", e => {
        if(e.target.closest(".sort_by") == null && sort_by.new_sort._class().contains("active")) {
            sort_by.new_sort._class("active", false)
        }
    })
    sort_by.new_sort._find("li.sort_option").forEach(element => {
        element.node.addEventListener("click", e => {
            sort_by._update_old(e, sort_by)
        })
    })
    return sort_by
}

function add_browse_by(variation) {
    const browse_by = new Browse()
    variation.log(browse_by)
    browse_by.new_links_element._insert(`.sort_and_filter_container[test="pah166"]`, "beforeBegin")
    browse_by.new_links = new TestElements(`${browse_by.new_links_element.selector} .browse_link:not([href="#toggle_links"])`)
    browse_by.new_links._loop(element => {
        element.node.addEventListener("click", e => {
            variation.track_event(`Clicked Browse Link`)
            variation.track_event(`Clicked Browse Link: ${e.target.getAttribute("href")}`)
        })
    })
    
    browse_by.new_links_toggle = new TestElement(`${browse_by.new_links_element.selector} [href="#toggle_links"]`)
    let cutoff = browse_by.calc_cutoff()
    if (browse_by.original_links.nodes.length > cutoff) {
        browse_by.new_links._loop((element, index) => {
            if (index <= cutoff) {
                element.node.style.display = "block"
            } else {
                element.node.style.display = "none"
            }
        })
        browse_by.new_links_toggle.node.addEventListener("click", e => {
            browse_by._toggle_links()
        })
    } else {
        browse_by.new_links_toggle.node.remove()
    }
}

function watch_and_update(sort_by) {
    let target = document.querySelector("#searchBasedNavigation_widget")
    watchForChange(target, _ => {
        sort_by._update_sort_title()
        sort_by.new_sort._class("active", false)
    }, {
        subtree: true,
        childList: true,
        attributes: false,
    }, "main_observer")
}

function action() {
    this.log("Action loaded")
    let sort_and_filter_container = _init_sort_and_filter_container()
    sort_and_filter_container._mask()
    update_layout()
    add_browse_by(this)
    add_filter(this)
    
    let sort_by = add_sort_by(this)
    watch_and_update(sort_by)

    sort_and_filter_container._mask(false)
}

function fallback() {
    this.log("Test can't run, fallback loaded", true)
}

const variation = new Variant(test_config, "Variation 1", conditions, action, fallback)
variation.run()