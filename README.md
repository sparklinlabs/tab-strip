# tab-strip

Robust, stylable tab strip widget for HTML5 apps.  
Features reorderable and closable tabs.

[![](http://i.imgur.com/eKh9szK.gif)](http://sparklinlabs.github.io/tab-strip/)

## How to install

    npm install tab-strip

## Usage

Check out the [live demo](http://sparklinlabs.github.io/tab-strip/) and its [source code](https://github.com/sparklinlabs/tab-strip/blob/master/src/index.jade).

 * Include ``TabStrip.js`` in your page.
 * Create a container element, call ``tabStrip = new TabStrip(container)``.
 * Create a list item element (``<li>``), put whatever you want inside.
 * Use ``tabStrip.tabsRoot.appendChild(item)``.

See [index.d.ts](https://github.com/sparklinlabs/tab-strip/blob/master/index.d.ts) for the full API.

## Building from source

 * Make sure you have a recent version of [Node.js](http://nodejs.org/) installed.
 * Clone the repository from `https://github.com/sparklinlabs/tab-strip` and run `npm install` once
 * Run `npm run build` to build once or `npm run watch` to start a watcher that will rebuild when changes are detecting
