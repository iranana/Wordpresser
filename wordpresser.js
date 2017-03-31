/*
Utility to fetch data from Wordpress API.

var wordpress = new Wordpresser({ baseUrl: 'http://mywebsite.com' });
wordpress.get('posts').then((data) => {
  console.log(data);
});
*/
(() => {
  "use strict";

  function Wordpresser (settings) {
    this.settings = {
      'baseUrl': settings.baseUrl
    };
    this.endpoints = {
      'pages': '/pages',
      'posts': '/posts',
      'categories': '/categories',
      'tags': '/tags',
      'media': '/media'
    };
    this.data = {
      'pages': [],
      'posts': [],
      'categories': [],
      'tags': [],
      'media': []
    };
  }

  /*
  GET
  */
  Wordpresser.prototype.fetch = function (endpoint) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest(),
      url = this.settings.baseUrl + endpoint;

      console.log('-- fetching from ' + url + ' --');

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            console.log('--- response from ' + endpoint + ' received ---');
            resolve(data);
          }
          if (xhr.status === 500) {
            reject();
          }
        }
      };

      xhr.open('GET', url, true);
      xhr.send();
    });
  };

  /*
  Pages
  */
  Wordpresser.prototype.fetchData = function (type) {
    return this.fetch(this.endpoints[type]).then((data) => {
      this.data[type] = data;
      localStorage.setItem('wp-' + type, JSON.stringify(data));
    }).then(() => {
      return this.data[type];
    });
  };

  /*
  Return posts
  */
  Wordpresser.prototype.get = function (type) {
    return new Promise((resolve) => {
      var data = localStorage.getItem('wp-' + type);

      if (data) {
        console.log('- ' + type + ' were in localStorage -');
        resolve(JSON.parse(data));
        this.fetchData(type);
      } else {
        console.log('- ' + type + ' were not in localStorage -');
        this.fetchData(type).then((json) => {
          resolve(json);
        });
      }
    });
  };

  window.Wordpresser = Wordpresser;
})();
