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

	function Bender () {
		this.ratios = [];

		// Build list of recognised ratios.
		var arr = [
			[10, 16],
			[10, 15],
			[9, 16],
			[3, 4],
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
	 * @param {int} width
	 * @param {int} height
	 * @returns {string}
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
	 * @param {object} config
	 */
	Bender.prototype.init = function (config) {
		config = jQuery.extend({}, {
			sitemapUrl: undefined,
			sitemapBaseUrl: undefined,
			baseUrl: '',
			screens: []
		}, config);

		// Append iframes.
		var $ul = jQuery('#frames > ul');
		var screen, dims, ratioName;
		var html = '';
		for (var i = 0, il = config.screens.length; i < il; i++) {
			screen = config.screens[i];
			dims = screen.split('-');
			ratioName = bender.getRatioName(dims[0], dims[1]);
			html += '<li><p>' + dims[0] + ' x ' + dims[1] + (ratioName ? ', ' + ratioName : '') + '</p><iframe class="f f-' + dims[0] + '-' + dims[1] + '"></iframe></li>';
		}
		$ul.append(html);

		// Load sitemap.
		jQuery.ajax({
			cache: false,
			method: 'GET',
			dataType: 'xml',
			url: config.sitemapUrl,
			error: function () {
				alert('Could not load sitemap');
			},
			success: function (data, textStatus, jqXHR) {
				var $frames = jQuery('iframe');
				var $sfElm = jQuery('#menu');
				var $listElm = jQuery('<ul />');
				var urls = {};

				jQuery(data).find('url').each(function () {
					var url = jQuery(this).find('loc').text();

					if (url.substr(0, config.sitemapBaseUrl.length) === config.sitemapBaseUrl) {
						var title = url = url.substr(config.sitemapBaseUrl.length);

						if (title === '') {
							title = '/';
						}

						url = config.baseUrl + url;
						urls[url] = title;
					}
				});

				var keys = [], k, i, len;

				for (k in urls) {
					if (urls.hasOwnProperty(k)) {
						keys.push(k);
					}
				}

				keys.sort();
				len = keys.length;

				for (i = 0; i < len; i++) {
					k = keys[i];

					if (config.firstUrl === undefined) {
						config.firstUrl = k;
					}

					var $aElm = jQuery('<a href="' + k + '">' + urls[k] + '</a>').on('click', function () {
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
					$frames.attr('src', config.firstUrl);
				}

				$sfElm.removeClass('hidden').superfish({
					delay: 100,
					speed: 100
				});
			}
		});
	};

	var bender = new Bender;
	window.bender = bender;

})(this);

/**
 * init
 *
 * @author Hein Bekker <hein@netbek.co.za>
 * @copyright (c) 2015 Hein Bekker
 * @license http://www.gnu.org/licenses/agpl-3.0.txt AGPLv3
 */

(function (window, undefined) {
	var intv = setInterval(function () {
		if (window.bender && window.benderConfig && window.jQuery) {
			clearInterval(intv);
			intv = null;
			window.bender.init(window.benderConfig);
		}
	});
})(this);