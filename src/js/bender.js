/**
 * bender
 *
 * @author Hein Bekker <hein@netbek.co.za>
 * @copyright (c) 2015 Hein Bekker
 * @license http://www.gnu.org/licenses/agpl-3.0.txt AGPLv3
 */

(function (window, undefined) {

	if (window.bender) {
		return;
	}

	/**
	 *
	 * @returns {Bender}
	 */
	function Bender() {
		this.flags = {
			init: false
		};

		this.config = {};
		this.ratios = [];

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

	/**
	 *
	 * @param {Number} width
	 * @param {Number} height
	 * @returns {String}
	 */
	Bender.prototype.getRatioName = function (width, height) {
		var ratio = Number(width) / Number(height), value;
		for (var i = 0, il = this.ratios.length; i < il; i++) {
			value = this.ratios[i];
			if (value.ratio === ratio) {
				return value.name;
			}
		}
		return undefined;
	};

	/**
	 *
	 * @param {Object} options
	 */
	Bender.prototype.init = function (options) {
		if (this.flags.init) {
			return;
		}

		var self = this;

		this.flags.init = true;

		this.config = jQuery.extend({}, {
			sitemap: undefined,
			sitemapUrl: undefined,
			sitemapBaseUrl: undefined,
			baseUrl: '',
			screens: []
		}, options);

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

		if (this.config.sitemap !== undefined) {
			// Load frames.
			this.loadFrames();
		}
		else if (this.config.sitemapUrl !== undefined) {
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
	};

	/**
	 *
	 */
	Bender.prototype.loadFrames = function () {
		if (!this.flags.init) {
			return;
		}

		var $frames = jQuery('iframe');
		var $sfElm = jQuery('#menu');
		var $listElm = jQuery('<ul />');
		var keys = [], k, i, len;

		for (k in this.config.sitemap) {
			if (this.config.sitemap.hasOwnProperty(k)) {
				keys.push(k);
			}
		}

		keys.sort();
		len = keys.length;

		for (i = 0; i < len; i++) {
			k = keys[i];

			if (this.config.firstUrl === undefined) {
				this.config.firstUrl = k;
			}

			var $aElm = jQuery('<a href="' + k + '">' + this.config.sitemap[k] + '</a>').on('click', function () {
				$frames.attr('src', jQuery(this).attr('href'));
				return false;
			});
			var $itemElm = jQuery('<li />');
			$itemElm.append($aElm);
			$listElm.append($itemElm);
		}

		jQuery('a[href="#"]', $sfElm).on('click', function () {
			return false;
		});

		if (len) {
			jQuery('li.sitemap', $sfElm).append($listElm);
			$frames.attr('src', this.config.firstUrl);
		}

		$sfElm.removeClass('hidden').superfish({
			delay: 100,
			speed: 100
		});
	};

	window.bender = new Bender();

})(this);
