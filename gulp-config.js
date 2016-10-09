module.exports = {
  'autoprefixer': {
    'browsers': [
      'last 2 versions',
      'ie >= 8',
      'ff >= 5',
      'chrome >= 20',
      'opera >= 12',
      'safari >= 4',
      'ios >= 6',
      'android >= 2',
      'bb >= 6'
    ]
  },
  'css': {
    'destName': 'components',
    // SASS compiler
    'params': {
      'includePaths': [
        'bower_components/bourbon/app/assets/stylesheets/',
        'bower_components/breakpoint-sass/stylesheets/',
        'bower_components/mathsass/dist/',
        'bower_components/modernizr-mixin/stylesheets/',
        'bower_components/singularity/stylesheets/'
      ],
      'errLogToConsole': true
    }
  },
  'dist': {
    'css': 'css/',
    'js': 'js/'
  },
  'src': {
    'css': 'src/css/',
    'js': 'src/js/'
  },
  'watchTasks': [
    //
    {
      files: [
        'src/css/**/*.scss'
      ],
      tasks: [
        'css'
      ]
    },
    //
    {
      files: [
        'src/js/**/*.js'
      ],
      tasks: [
        'js'
      ]
    }
  ],
  'webserver': {
    'host': 'localhost',
    'port': 8000,
    'path': '/',
    'livereload': false,
    'directoryListing': false,
    'open': '/index.html',
    'https': false,
    'browsers': {
      'default': 'firefox',
      'darwin': 'google chrome',
      'linux': 'google-chrome',
      'win32': 'chrome'
    }
  }
};
