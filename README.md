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
	sitemapUrl: 'http://example.com/sitemap.xml',
	sitemapBaseUrl: 'http://example.com',
	baseUrl: '',
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
