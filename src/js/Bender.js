import _ from 'lodash';
import Url from 'domurl';
import getRatioName from './getRatioName';

class Bender {
  constructor() {
    this.config = {};
    this.flags = {
      init: false
    };
    this.url = undefined; // {string} Current URL
    this.$frames = undefined; // {jQuery} iframe elements
  }

  /**
   *
   * @param   {Object} options
   * @returns {Bender}
   */
  init(options) {
    if (this.flags.init) {
      return this;
    }

    this.flags.init = true;

    const defaultOptions = {
      debug: false,
      sitemap: undefined,
      sitemapUrl: undefined,
      sitemapBaseUrl: undefined,
      baseUrl: '',
      cache: true,
      cacheQueryParam: 'ts',
      screens: []
    };

    this.config = _.defaults({}, options, defaultOptions);

    const self = this;
    const hasSitemap = !_.isNil(this.config.sitemap);
    const hasSitemapUrl = !_.isNil(this.config.sitemapUrl);

    if (!hasSitemap && !hasSitemapUrl) {
      throw new Error(
        'Either `sitemap` or `sitemapUrl` should be defined in config.'
      );
    }

    // Append iframes.
    const html = this.config.screens.reduce(function(result, screen) {
      const dims = screen.split('-');
      const ratioName = getRatioName(dims[0], dims[1]);

      return (
        result +
        '<li><p>' +
        dims[0] +
        ' x ' +
        dims[1] +
        (ratioName ? ', ' + ratioName : '') +
        '</p><iframe class="f f-' +
        dims[0] +
        '-' +
        dims[1] +
        '"></iframe></li>'
      );
    }, '');

    jQuery('#frames > ul').append(html);

    this.$frames = jQuery('iframe');

    if (hasSitemap) {
      // Load frames.
      return this.loadFrames();
    }

    // Load sitemap.
    jQuery.ajax({
      cache: false,
      method: 'GET',
      dataType: 'xml',
      url: this.config.sitemapUrl,
      error: function() {
        throw new Error('Could not load sitemap.');
      },
      success: function(data) {
        const entries = jQuery(data)
          .find('url')
          .filter(function() {
            const url = jQuery(this)
              .find('loc')
              .text();

            return (
              url.substr(0, self.config.sitemapBaseUrl.length) ===
              self.config.sitemapBaseUrl
            );
          })
          .toArray()
          .reduce(function(result, value) {
            const url = jQuery(value)
              .find('loc')
              .text();

            const path = url.substr(self.config.sitemapBaseUrl.length);
            const title = path === '' ? '/' : path;

            return result.concat({
              url: self.config.baseUrl + path,
              title: title
            });
          }, []);

        const urls = entries.map(v => v.url);
        const titles = entries.map(v => v.title);

        self.config.sitemap = _.zipObject(urls, titles);

        // Load frames.
        self.loadFrames();
      }
    });

    return this;
  }

  /**
   *
   */
  loadFrames() {
    if (!this.flags.init) {
      return this;
    }

    const self = this;
    const $sf = jQuery('#menu');
    const $list = jQuery('<ul />');
    const keys = _.keys(this.config.sitemap);

    keys.sort();

    if (_.isNil(this.config.firstUrl)) {
      this.config.firstUrl = _.first(keys);
    }

    keys.forEach(function(k) {
      const $a = jQuery(
        '<a href="' + k + '">' + self.config.sitemap[k] + '</a>'
      ).on('click.bender', function(e) {
        e.preventDefault();
        self.setUrl(jQuery(this).attr('href'));
      });
      const $item = jQuery('<li />');

      $item.append($a);
      $list.append($item);
    });

    jQuery('a[href="#"]', $sf).on('click.bender', function(e) {
      e.preventDefault();
    });

    if (keys.length) {
      jQuery('li.sitemap', $sf).append($list);
      this.setUrl(this.config.firstUrl);
    }

    $sf.removeClass('hidden').superfish({
      delay: 100,
      speed: 100
    });

    return this;
  }

  /**
   *
   * @param {string} url
   */
  setUrl(url) {
    if (!this.flags.init) {
      return;
    }

    if (_.isNil(url)) {
      throw new Error('`url` is required');
    }

    // Whether to force a reload of iframes (used for cache busting).
    const reload = this.config.cache === false;

    // Set current URL.
    this.url = this.setCacheQueryParam(url, this.config.cache);

    if (reload) {
      // Unbind previous binding that might not have been removed because the window did not finish loading.
      this.$frames.off('load.bender');
      // On load, force a reload of the iframe to reload CSS and JS.
      this.$frames.on('load.bender', function() {
        jQuery(this).off('load.bender');
        this.contentWindow.location.reload(true);
      });
    }

    // Load URL in frames.
    this.$frames.attr('src', this.url);
  }

  /**
   *
   * @param   {string} a
   * @param   {string} b
   * @returns {Bool}
   */
  isEqualUrl(a, b) {
    const aCompare = this.removeCacheQueryParam(a);
    const bCompare = this.removeCacheQueryParam(b);

    return _.isEqual(aCompare, bCompare);
  }

  /**
   *
   * @param   {string} url
   * @returns {Url}
   */
  removeCacheQueryParam(url) {
    const parse = new Url(url);

    if (!_.isFunction(parse.query[this.config.cacheQueryParam])) {
      delete parse.query[this.config.cacheQueryParam];
    }

    return parse;
  }

  /**
   * Sets value of cache query string parameter.
   *
   * @param   {string} url
   * @param   {Bool} cache
   * @returns {string}
   */
  setCacheQueryParam(url, cache) {
    if (cache !== false) {
      return url;
    }

    const parse = new Url(url);
    parse.query[this.config.cacheQueryParam] = Date.now();

    return parse.toString();
  }
}

export default Bender;
