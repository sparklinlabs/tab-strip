# tab-strip

Robust, stylable tab strip widget for HTML5 apps.  
Features reorderable and closable tabs.

## How to install

```
npm install tab-strip
```

## Usage

Check out the [live demo](http://sparklinlabs.bitbucket.org/tab-strip/doc/demo/) and its [source code](https://bitbucket.org/sparklinlabs/tab-strip/src/tip/src/demo/).

 * Include ``TabStrip.js`` in your page.
 * Create a container element, call ``tabStrip = new TabStrip(container)``.
 * Create a list item element (``<li>``), put whatever you want inside.
 * Use ``tabStrip.tabsRoot.appendChild(item)``.

## Building from source

Make sure you have [Node.js](http://nodejs.org/) 0.10+ installed.

 * Clone the Mercurial repository from ``https://bitbucket.org/sparklinlabs/tab-strip`
 * Run ``npm install`` once
 * Run ``gulp`` to build ``lib/TabStrip.js`` from the TypeScript source.
 * Run ``gulp watch`` to start a watcher that will rebuild it anytime you make a change.
