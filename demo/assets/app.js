var conversion = new Conversion();
conversion.init();

var bodyClasses = null;
conversion.on('content.start', function(oldContent) {
  bodyClasses = document.getElementsByTagName('body')[0].classList;
  console.log(document.getElementsByTagName('body')[0].classList);
});

conversion.on('content.inserted', function() {
  console.log(document.getElementsByTagName('body')[0].classList);
  document.getElementsByTagName('body')[0].classList = bodyClasses;
});