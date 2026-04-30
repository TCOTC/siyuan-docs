// @ts-nocheck
(function () {
	function localeFromStorage() {
		try {
			var v = localStorage.getItem('siyuan-docs-locale');
			if (v === 'zh' || v === 'en') return v;
		} catch (e) {}
		return null;
	}
	function localeFromNavigator() {
		try {
			var nav = typeof navigator !== 'undefined' ? navigator : null;
			if (!nav) return null;
			var list = nav.languages && nav.languages.length ? nav.languages : [nav.language];
			for (var i = 0; i < list.length; i++) {
				var raw = (list[i] || '').trim();
				if (!raw) continue;
				var primary = raw.split('-')[0].toLowerCase();
				if (primary === 'zh') return 'zh';
			}
		} catch (e) {}
		return null;
	}
	function detectRootLocale() {
		var fromStore = localeFromStorage();
		if (fromStore) return fromStore;
		var fromNav = localeFromNavigator();
		if (fromNav) return fromNav;
		return 'en';
	}
	var root = document.documentElement;
	var zhWelcome = root.getAttribute('data-index-zh');
	var enWelcome = root.getAttribute('data-index-en');
	var loc = detectRootLocale();
	location.replace(loc === 'zh' ? zhWelcome : enWelcome);
})();
