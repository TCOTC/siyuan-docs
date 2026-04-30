---
title: Theme overview
description: Theme package layout, loading, and customization
order: 10
---

SiYuan themes usually bundle CSS and assets, overriding UI styles via CSS variables and selectors. This page is a placeholder to show the “Themes” group and layout.

## Typical package contents

- `theme.json` or the agreed manifest at the package root (per real spec)
- Style entry and splits (e.g. by component)
- Static assets such as fonts and icons

## Difference from plugins

Themes focus on **presentation** and **CSS variables**; plugins focus on **behavior** and **APIs**. They can work together: a theme exposes variable names while a plugin tweaks DOM or classes at the right time (watch for conflicts when the theme updates).
