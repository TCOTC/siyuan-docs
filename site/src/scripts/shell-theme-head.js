// @ts-nocheck
(function () {
				function systemTheme() {
					try {
						return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
					} catch (e) {
						return 'light';
					}
				}
				try {
					var t = localStorage.getItem('siyuan-docs-theme');
					// 仅当用户曾手动切换过时写入有效值；否则跟随系统（清除站点数据后即恢复跟随系统）
					if (t !== 'light' && t !== 'dark') t = systemTheme();
					document.documentElement.setAttribute('data-theme', t);
				} catch (e) {
					document.documentElement.setAttribute('data-theme', systemTheme());
				}
			})();
