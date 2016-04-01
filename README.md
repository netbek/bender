# bender

Responsive design tester

## Installation

Install bower:

`npm install -g bower`

Install dependencies:

`bower install`

Create `config.js`

```javascript
var benderConfig = {
	// Option 1: Define sitemap
	sitemap: {
		'url': 'title',
		'another/url': 'another title'
	},
	// Option 2: Load sitemap from file (set `sitemapUrl`, `sitemapBaseUrl`, `baseUrl`)
	sitemapUrl: 'http://example.com/sitemap.xml',
	sitemapBaseUrl: 'http://example.com',
	baseUrl: '',
	// Optional
  cache: false, // Cache busting.
  cacheQueryParam: 'ts', // Name of query string parameter used for cache busting.
  debug: false,
  firstUrl: '', // Initial URL to load. Defaults to first URL in sitemap,
  // Required
	screens: [
		'320-480',
		'768-1024',
		'1024-768',
		'1440-900',
		'1920-1080'
	]
};
```

## Usage

Open `index.html` in web browser

## Building from source

Install grunt and other dependencies:

`npm install -g grunt-cli`

`npm install`

Run grunt to build:

`grunt`
