var conversion = new Conversion();
conversion.init();


var transition = document.querySelector('.transition');
var transitionAnimLayer = transition.querySelector('.transition__anim');

transitionAnimLayer.addEventListener('animationend', function() {
  transition.classList.remove('is-action');
  transition.classList.add('is-stay');
});

conversion.on('request.start', function(oldContent) {
  transition.classList.add('is-action');
});


conversion.on('request.success', function(oldContent) {

});


// listen when content inserting is started
conversion.on('content.start', function(oldContent) {
});


// listen when content is inserted
conversion.on('content.inserted', function(newContent) {

  // set new classes for body
  document.getElementsByTagName('body')[0].classList = newContent.getElementsByTagName('body')[0].classList;

  // replace content which outside inserting container
  document.querySelector('.header').rem = newContent.getElementsByTagName('body')[0].classList;
});