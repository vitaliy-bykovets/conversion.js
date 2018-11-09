export default  {
  /**
   * Class for container where to insert container.
   * This class also is used for searching new content in the response.
   *
   * @type {String}
   */
  containerToInsert: '.js-content-insert',

  /**
   * A container where to search links
   *
   * @type {String}
   */
  containerToSearchLinks: 'body',

  /**
   * An attribute for disabling ajax request
   *
   * @type {String}
   */
  disableAttribute: 'data-ajax-disabled',

  /**
   * Handle browser history.
   * Run a request when user click Back button
   *
   * @type {Boolean}
   */
  saveBack: true,

  /**
   * Scroll a page to top after a request
   *
   * @type {Boolean}
   */
  scrollToTop: true,

  /**
   * If a content should be inserted with delay.
   * In this case content should be inserting using .emit('request.activate')
   *
   * @type {Boolean}
   */
  delayContentInsert: false
}