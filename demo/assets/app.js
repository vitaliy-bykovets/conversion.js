var conversion = new Conversion();
conversion.init();


conversion.on('content.start', function(oldContent) {
});

conversion.on('content.inserted', function(newContent) {

  // set new classes for body
  document.getElementsByTagName('body')[0].classList = newContent.getElementsByTagName('body')[0].classList;
});