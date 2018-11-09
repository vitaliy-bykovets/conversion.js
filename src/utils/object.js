/**
 * Merge options
 *
 * @param {Object} defaults
 * @param {Object} settings
 * @returns {Object}
 */
export function mergeOptions (defaults, settings) {
  return Object.assign({}, defaults, settings)
}