# bender

Responsive design tester

## Installation

### Step 1

Install global dependencies:

```
sudo npm install -g gulp-cli bower
```

### Step 2

Install local dependencies:

```
cd /path/to/repository
npm install
```

### Step 3

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
