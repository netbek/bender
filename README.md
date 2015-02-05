# bender

Responsive design tester

## Installation

`npm install -g grunt-cli`

`npm install -g bower`

`npm install`

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
