(function () {
  var modals = document.querySelectorAll('.modal');

  modals.forEach(function (modal) {
    var carousel = modal.querySelector('.carousel');
    var dialog = modal.querySelector('.modal-dialog');
    var body = modal.querySelector('.modal-body');

    if (!dialog || !body) {
      return;
    }

    var image = carousel
      ? carousel.querySelector('.carousel-item.active img') ||
        carousel.querySelector('.carousel-item img')
      : body.querySelector('img');

    if (!image) {
      return;
    }

    var hasCarousel = Boolean(carousel && carousel.querySelector('.carousel-item img'));
    var hasTextContent = Boolean(body.textContent.trim());

    if (!hasCarousel && hasTextContent) {
      modal.classList.add('image-contained-modal');
      return;
    }

    modal.classList.add(hasCarousel ? 'image-fit-gallery-modal' : 'image-fit-single-modal');

    function fitImage() {
      if (!modal.classList.contains('show')) {
        return;
      }

      var activeImage = hasCarousel
        ? carousel.querySelector('.carousel-item.active img')
        : image;

      if (!activeImage) {
        return;
      }

      if (!activeImage.complete || !activeImage.naturalWidth || !body.clientHeight) {
        activeImage.addEventListener('load', fitImage, { once: true });
        return;
      }

      var bodyStyles = window.getComputedStyle(body);
      var horizontalPadding =
        parseFloat(bodyStyles.paddingLeft) + parseFloat(bodyStyles.paddingRight);
      var verticalPadding =
        parseFloat(bodyStyles.paddingTop) + parseFloat(bodyStyles.paddingBottom);
      var isMobile = window.innerWidth <= 575.98;
      var viewportMargin = isMobile ? 20 : 32;
      var maxDialogWidth = window.innerWidth - viewportMargin;
      var header = modal.querySelector('.modal-header');
      var footer = modal.querySelector('.modal-footer');
      var modalChromeHeight =
        (header ? header.getBoundingClientRect().height : 0) +
        (footer ? footer.getBoundingClientRect().height : 0);
      var maxImageWidth = Math.max(1, maxDialogWidth - horizontalPadding);
      var maxImageHeight = Math.max(
        1,
        window.innerHeight - modalChromeHeight - verticalPadding - viewportMargin
      );
      var aspectRatio = activeImage.naturalWidth / activeImage.naturalHeight;
      var imageWidth = Math.min(maxImageWidth, aspectRatio * maxImageHeight);
      var imageHeight = imageWidth / aspectRatio;

      dialog.style.setProperty(
        '--image-dialog-width',
        imageWidth + horizontalPadding + 'px'
      );
      if (hasCarousel) {
        carousel.style.setProperty('--image-stage-width', imageWidth + 'px');
        carousel.style.setProperty('--image-stage-height', imageHeight + 'px');
      }
      activeImage.style.setProperty('--image-stage-width', imageWidth + 'px');
      activeImage.style.setProperty('--image-stage-height', imageHeight + 'px');
    }

    $(modal).on('shown.bs.modal', fitImage);
    if (hasCarousel) {
      $(carousel).on('slid.bs.carousel', fitImage);
    }
    window.addEventListener('resize', fitImage);
  });
})();
