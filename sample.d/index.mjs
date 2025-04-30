/**
 * @import { IO } from "./io.mjs"
 */

import { url2zcat2jsonObject } from "./zcat2json2parsed.mjs"

/**
 * @typedef {function(string): IO<Void>} WriteText
 */

/**
 * @param {HTMLElement} el
 * @returns {WriteText}
 */
const text2element = (el) => (text) => {
  return () => {
    el.textContent = text
    return Promise.resolve()
  }
}

/**
 * @param {string} divid The id of the div.
 * @returns {WriteText}
 */
const text2divNew = (divid) => (text) => {
  return () => {
    /** @type HTMLElement? */
    const odiv = document.getElementById(divid)

    /** @type WriteText */
    const wtxt = odiv
      ? text2element(odiv)
      : (_txt) => () => Promise.reject(`element ${divid} not found`)

    /** @type IO<Void> */
    const write = wtxt(text)

    return write()
  }
}

/** @type IO<Void> */
function main() {
  /** @type string */
  const sampleUrl = "sample.json.gz"

  /** @type IO<object> */
  const iparsed = url2zcat2jsonObject(sampleUrl)

  /** @type string */
  const divid = "rt"

  /** @type WriteText */
  const wtxt = text2divNew(divid)

  return iparsed()
    .then((obj) => JSON.stringify(obj))
    .then((txt) => wtxt(txt)())
}

main().catch(console.error)
