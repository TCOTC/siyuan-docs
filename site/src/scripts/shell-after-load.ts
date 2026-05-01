/**
 * 文档页 body 末尾唯一聚合入口：保证 Rollup 打成单块 .js，并固定执行顺序。
 * 顺序：浮动提示绑定 → Shell UI（主题 / TOC / 复制等）。
 */
import './anchored-floating-hint';
import './shell-ui';
