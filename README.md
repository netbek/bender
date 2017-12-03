# bender

Responsive design tester

## Installation

1. Install global Node dependencies:

    ```
    npm install -g gulp-cli yarn
    ```

2. Install local Node dependencies:

    ```
    cd /path/to/repository
    yarn install
    ```

3. Create `bender.config.js` in `/path/to/repository`:

    ```javascript
    var benderConfig = {
      // Option 1: Define sitemap
      sitemap: {
        'url': 'title',
        'another/url': 'another title'
      },

      // Option 2: Load sitemap from file
      sitemapUrl: 'http://example.com/sitemap.xml',
      sitemapBaseUrl: 'http://example.com',
      baseUrl: '',

      // Required
      screens: [
        '320-480',
        '768-1024',
        '1024-768',
        '1440-900',
        '1920-1080'
      ],

      // Optional
      cache: false, // Enable cache busting
      cacheQueryParam: 'ts', // Name of query string parameter used for cache busting
      debug: false, // Enable debugging
      firstUrl: '', // Initial URL to load. Defaults to first URL in sitemap
    };
    ```

## Usage

Open `index.html` in web browser
