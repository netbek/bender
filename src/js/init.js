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