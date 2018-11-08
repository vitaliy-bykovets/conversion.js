// init conversion.js
var conversion = new Conversion();
conversion.init();

// get elements for animations
var transition = document.querySelector('.transition');
var transitionAnimLayer = transition.querySelector('.transition__anim');

// listen when click is executed
conversion.on('click.executed', function() {
  console.info('Conversion.js: click.executed');

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


// listen when request is successful
conversion.on('request.success', function() {
  console.info('Conversion.js: request.success');
});


// listen when content inserting is started
conversion.on('content.insert-started', function(oldContent) {
  console.info('Conversion.js: content.insert-started');
});


// listen when content is inserted
conversion.on('content.inserted', function(newContent) {
  console.info('Conversion.js: content.inserted');

  // set new classes for body
  document.getElementsByTagName('body')[0].classList = newContent.getElementsByTagName('body')[0].classList;

  // replace header for active link
  document.querySelector('.header').innerHTML = newContent.querySelector('.header').innerHTML;

  // research all links
  conversion.updateLinks();

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