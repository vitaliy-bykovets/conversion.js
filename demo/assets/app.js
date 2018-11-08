var conversion = new Conversion();
conversion.init();


var transition = document.querySelector('.transition');
var transitionAnimLayer = transition.querySelector('.transition__anim');

conversion.on('click.executed', function() {
  // listen when animation is ended
  var animationStart = function() {
    transition.classList.remove('is-processing', 'is-enter');
    transition.classList.add('is-stay');

    // insert content when animation has been finished
    setTimeout(function() {
      conversion.emit('request.activate');
    });

    transitionAnimLayer.removeEventListener('animationend', animationStart)
  };

  transitionAnimLayer.addEventListener('animationend', animationStart);
  transition.classList.add('is-processing', 'is-enter');
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

  // add class for second animation
  // listen when animation is ended
  var animationEnd = function() {
    transition.classList.remove('is-processing', 'is-leave');
    transition.classList.remove('is-stay');

    transitionAnimLayer.removeEventListener('animationend', animationEnd)
  };

  transitionAnimLayer.addEventListener('animationend', animationEnd);
  transition.classList.add('is-processing', 'is-leave');
});