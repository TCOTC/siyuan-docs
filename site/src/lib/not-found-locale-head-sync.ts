import {
	appI18nLocales,
	localeHtmlLang,
	localePreferenceFallback,
} from './appLocale';
import type { NotFoundLocalePatch } from './notFoundLocale';

export type NotFoundLocaleWindowConfig = {
	base: string;
	patchZh: NotFoundLocalePatch;
};

/**
 * 404 head 内联同步脚本：在解析到 `<body>` 之前写入 `window.__NF_LOCALE__`、`data-doc-locale`、
 * `lang` 与中文 title / description，避免首屏英文闪现。检测顺序与 `localePreference.detectLocale` 一致。
 */
export function buildInlineNotFoundLocaleHeadScriptContent(cfg: NotFoundLocaleWindowConfig): string {
	const payload = JSON.stringify(cfg).replace(/</g, '\\u003c');
	return `window.__NF_LOCALE__=${payload};${notFoundDocLocaleAndHeadFromCfgIife()}`;
}

/** 内嵌于上式之后；勿引用外部标识符（语言列表等与 `appLocale` / `localePreference` 同源） */
function notFoundDocLocaleAndHeadFromCfgIife(): string {
	const siteJson = JSON.stringify([...appI18nLocales]);
	const htmlLangJson = JSON.stringify(localeHtmlLang);
	const fallbackJson = JSON.stringify(localePreferenceFallback);
	return [
		'(function(){',
		'var cfg=window.__NF_LOCALE__;',
		'if(!cfg)return;',
		`var SITE=${siteJson};`,
		`var HTML_LANG=${htmlLangJson};`,
		`var FALLBACK=${fallbackJson};`,
		'var base=cfg.base;',
		'function isSiteLocale(v){return SITE.indexOf(v)!==-1;}',
		'function stripBase(pathname,baseStr){',
		'var b=baseStr.replace(new RegExp("/$"),"");',
		'if(!b)return pathname;',
		'if(pathname.indexOf(b)===0){',
		'var rest=pathname.slice(b.length);',
		'return rest||"/";',
		'}',
		'return pathname;',
		'}',
		'function localeFromPath(pathname,baseStr){',
		'var p=stripBase(pathname,baseStr);',
		'if(!p||p.charAt(0)!=="/"){',
		'p="/"+(p||"");',
		'}',
		'var seg=p.split("/").filter(Boolean)[0];',
		'if(seg&&isSiteLocale(seg))return seg;',
		'return null;',
		'}',
		'function localeFromStorage(){',
		'try{',
		'var v=localStorage.getItem("siyuan-docs-locale");',
		'if(v&&isSiteLocale(v))return v;',
		'}catch(e){}',
		'return null;',
		'}',
		'function localeFromNavigator(){',
		'try{',
		'var nav=typeof navigator!=="undefined"?navigator:null;',
		'if(!nav)return null;',
		'var list=nav.languages&&nav.languages.length?nav.languages:[nav.language];',
		'for(var i=0;i<list.length;i++){',
		'var raw=(list[i]||"").trim();',
		'if(!raw)continue;',
		'var primary=(raw.split("-")[0]||"").toLowerCase();',
		'if(primary&&isSiteLocale(primary))return primary;',
		'}',
		'}catch(e){}',
		'return null;',
		'}',
		'function detectLocale(pathname,baseStr){',
		'var fp=localeFromPath(pathname,baseStr);',
		'if(fp)return fp;',
		'var fs=localeFromStorage();',
		'if(fs)return fs;',
		'var fn=localeFromNavigator();',
		'if(fn)return fn;',
		'return FALLBACK;',
		'}',
		'var loc=detectLocale(typeof location!=="undefined"?location.pathname:"/",base);',
		'document.documentElement.setAttribute("data-doc-locale",loc);',
		'document.documentElement.setAttribute("lang",HTML_LANG[loc]||loc);',
		'if(loc==="zh"){',
		'var p=cfg.patchZh;',
		'document.title=p.title;',
		'var m=document.querySelector(\'meta[name="description"]\');',
		'if(m)m.setAttribute("content",p.description);',
		'}',
		'})();',
	].join('');
}
