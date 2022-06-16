import { Variant, TestElement, TestElements } from "../norman"

const test_config = {
    id: "ex002",
    google_analytics: 29,
    hotjar: true
}

const conditions = _ => {
    return !!document.querySelector("body")
}

function action() {
    this.log("Action loaded")
}

function fallback() {
    this.log("Test can't run, fallback loaded", true)
}

const variation = new Variant(test_config, "Variation 1", conditions, action, fallback)
variation.run()