(function () {
  var galleries = document.querySelectorAll('.attraction-gallery[data-gallery-modal]');

  galleries.forEach(function (gallery) {
    var modal = document.querySelector(gallery.getAttribute('data-gallery-modal'));
    var carousel = modal && modal.querySelector('.carousel');
    var carouselInner = carousel && carousel.querySelector('.carousel-inner');
    var images = Array.prototype.slice.call(gallery.querySelectorAll('img'));

    if (!modal || !carousel || !carouselInner || images.length === 0) {
      return;
    }

    images.forEach(function (image, index) {
      var slide = document.createElement('div');
      var enlargedImage = document.createElement('img');

      slide.className = 'carousel-item' + (index === 0 ? ' active' : '');
      enlargedImage.src = image.currentSrc || image.src;
      enlargedImage.alt = image.alt;
      slide.appendChild(enlargedImage);
      carouselInner.appendChild(slide);

      image.setAttribute('role', 'button');
      image.setAttribute('tabindex', '0');
      image.setAttribute('aria-label', 'Uvećaj fotografiju: ' + image.alt);

      function openImage(event) {
        if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') {
          return;
        }

        if (event.type === 'keydown') {
          event.preventDefault();
        }

        $(carousel).carousel(index);
        $(modal).modal('show');
      }

      image.addEventListener('click', openImage);
      image.addEventListener('keydown', openImage);
    });

    if (modal.parentElement !== document.body) {
      document.body.appendChild(modal);
    }
  });
})();
