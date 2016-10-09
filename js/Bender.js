/**
 * Bender
 *
 * @author Hein Bekker <hein@netbek.co.za>
 * @copyright (c) 2015 Hein Bekker
 * @license http://www.gnu.org/licenses/agpl-3.0.txt AGPLv3
 */

(function (name, definition) {
  var theModule = new(definition())();
  var hasDefine = typeof define === 'function' && define.amd;
  var hasExports = typeof module !== 'undefined' && module.exports;

  // AMD Module
  if (hasDefine) {
    define(theModule);
  }
  // Node.js Module
  else if (hasExports) {
    module.exports = theModule;
  }
  // Assign to common namespaces or simply the global object (window)
  else {
    // (this.Namespace = this.Namespace || {})[name] = theModule;
    this[name] = theModule;
  }
})('Bender', function () {
  var moduleName = 'Bender';

  function Bender() {
    this.flags = {
      init: false
    };

    this.config = {};
    this.ratios = [];
    this.url = undefined; // {String} Current URL
    this.$frames = undefined; // {jQuery} iframe elements

    // Build list of recognised ratios.
    var arr = [
      [10, 16],
      [10, 15],
      [9, 16],
      [3, 4]
    ];
    var value;
    for (var i = 0, il = arr.length; i < il; i++) {
      value = arr[i];
      this.ratios.push({
        width: value[0],
        height: value[1],
        ratio: value[0] / value[1],
        name: value[0] + ':' + value[1]
      });
      if (value[0] !== value[1]) {
        this.ratios.push({
          width: value[1],
          height: value[0],
          ratio: value[1] / value[0],
          name: value[1] + ':' + value[0]
        });
      }
    }
  }

  Bender.prototype = {
    prototype: Bender,
    /**
     *
     * @param {Number} width
     * @param {Number} height
     * @returns {String}
     */
    getRatioName: function (width, height) {
      var ratio = Number(width) / Number(height),
        value;
      for (var i = 0, il = this.ratios.length; i < il; i++) {
        value = this.ratios[i];
        if (value.ratio === ratio) {
          return value.name;
        }
      }
      return undefined;
    },
    /**
     *
     * @param {Object} options
     */
    init: function (options) {
      if (this.flags.init) {
        return;
      }

      var self = this;

      this.flags.init = true;

      var defaultOptions = {
        debug: false,
        sitemap: undefined,
        sitemapUrl: undefined,
        sitemapBaseUrl: undefined,
        baseUrl: '',
        cache: true,
        cacheQueryParam: 'ts',
        screens: []
      };

      _.defaults(this.config, options, defaultOptions);

      // Append iframes.
      var $ul = jQuery('#frames > ul');
      var screen, dims, ratioName;
      var html = '';
      for (var i = 0, il = this.config.screens.length; i < il; i++) {
        screen = this.config.screens[i];
        dims = screen.split('-');
        ratioName = self.getRatioName(dims[0], dims[1]);
        html += '<li><p>' + dims[0] + ' x ' + dims[1] + (ratioName ? ', ' + ratioName : '') + '</p><iframe class="f f-' + dims[0] + '-' + dims[1] + '"></iframe></li>';
      }
      $ul.append(html);

      this.$frames = jQuery('iframe');

      if (!_.isNil(this.config.sitemap)) {
        // Load frames.
        this.loadFrames();
      }
      else if (!_.isNil(this.config.sitemapUrl)) {
        // Load sitemap.
        jQuery.ajax({
          cache: false,
          method: 'GET',
          dataType: 'xml',
          url: this.config.sitemapUrl,
          error: function () {
            throw new Error('Could not load sitemap.');
          },
          success: function (data, textStatus, jqXHR) {
            self.config.sitemap = {};

            jQuery(data).find('url').each(function () {
              var url = jQuery(this).find('loc').text();

              if (url.substr(0, self.config.sitemapBaseUrl.length) === self.config.sitemapBaseUrl) {
                var title = url = url.substr(self.config.sitemapBaseUrl.length);

                if (title === '') {
                  title = '/';
                }

                url = self.config.baseUrl + url;
                self.config.sitemap[url] = title;
              }
            });

            // Load frames.
            self.loadFrames();
          }
        });
      }
      else {
        throw new Error('Either `sitemap` or `sitemapUrl` should be defined in config.');
      }
    },
    /**
     *
     */
    loadFrames: function () {
      if (!this.flags.init) {
        return;
      }

      var self = this;
      var $sf = jQuery('#menu');
      var $list = jQuery('<ul />');
      var keys = [],
        k, i, len;

      for (k in this.config.sitemap) {
        if (this.config.sitemap.hasOwnProperty(k)) {
          keys.push(k);
        }
      }

      keys.sort();
      len = keys.length;

      for (i = 0; i < len; i++) {
        k = keys[i];

        if (_.isNil(this.config.firstUrl)) {
          this.config.firstUrl = k;
        }

        var $a = jQuery('<a href="' + k + '">' + this.config.sitemap[k] + '</a>').on('click.bender', function (e) {
          self.setUrl(jQuery(this).attr('href'));
          e.preventDefault();
        });
        var $item = jQuery('<li />');
        $item.append($a);
        $list.append($item);
      }

      jQuery('a[href="#"]', $sf).on('click.bender', function (e) {
        e.preventDefault();
      });

      if (len) {
        jQuery('li.sitemap', $sf).append($list);
        self.setUrl(this.config.firstUrl);
      }

      $sf.removeClass('hidden').superfish({
        delay: 100,
        speed: 100
      });
    },
    /**
     *
     * @param {String} url
     */
    setUrl: function (url) {
      if (!this.flags.init) {
        return;
      }

      if (_.isNil(url)) {
        throw new Error('`url` is required');
      }

      // Whether to force a reload of iframes (used for cache busting).
      var reload = (false === this.config.cache);

      // Set current URL.
      this.url = this.setCacheQueryParam(url, this.config.cache);

      if (reload) {
        // Unbind previous binding that might not have been removed because the window did not finish loading.
        this.$frames.off('load.bender');
        // On load, force a reload of the iframe to reload CSS and JS.
        this.$frames.on('load.bender', function () {
          jQuery(this).off('load.bender');
          this.contentWindow.location.reload(true);
        });
      }

      // Load URL in frames.
      this.$frames.attr('src', this.url);
    },
    /**
     *
     * @param {String} a
     * @param {String} b
     * @returns {Boolean}
     */
    isEqualUrl: function (a, b) {
      var aCompare = this.removeCacheQueryParam(a);
      var bCompare = this.removeCacheQueryParam(b);

      return _.isEqual(aCompare, bCompare);
    },
    /**
     *
     * @param {String} url
     * @returns {Url}
     */
    removeCacheQueryParam: function (url) {
      var parse = new Url(url);

      if (!_.isFunction(parse.query[this.config.cacheQueryParam])) {
        delete parse.query[this.config.cacheQueryParam];
      }

      return parse;
    },
    /**
     * Sets value of cache query string parameter.
     *
     * @param {String} url
     * @param {mixed} cache
     * @returns {String}
     */
    setCacheQueryParam: function (url, cache) {
      var value;

      if (false === cache) {
        value = Date.now();
      }
      else {
        return url;
      }

      var parse = new Url(url);
      parse.query[this.config.cacheQueryParam] = value;

      return parse.toString();
    }
  };

  return Bender;
});
