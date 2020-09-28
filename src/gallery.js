import galleryData from './gallery-items.js';

const refs = {
  galleryList: document.querySelector('.js-gallery'),
  lightbox: document.querySelector('.js-lightbox'),
  closeModalBtn: document.querySelector('[data-action="close-lightbox"]'),
  openedImage: document.querySelector('.lightbox__image'),
  overlayModal: document.querySelector('.lightbox__overlay'),
};

const gallery = createGallery(galleryData);

refs.galleryList.insertAdjacentHTML('beforeend', gallery);
refs.galleryList.addEventListener('click', onGalleryListClick);
refs.closeModalBtn.addEventListener('click', openCloseModal);
refs.overlayModal.addEventListener('click', openCloseModal);

function createGallery(galleryData) {
  return galleryData
    .map(({ preview, original, description }) => {
      return `
    <li class="gallery__item">
  <a
    class="gallery__link"
    href="${original}"
  >
    <img
      class="gallery__image"
      src="${preview}"
      data-source="${original}"
      alt="${description}"
    />
  </a>
</li>
    `;
    })
    .join('');
}

function onGalleryListClick(evt) {
  if (!evt.target.classList.contains('gallery__item')) {
    return;
  }

  openCloseModal();
  replaceSrcImg(evt.target);
}

function openCloseModal() {
  refs.openedImage.setAttribute('src', '');
  refs.lightbox.classList.toggle('is-open');
  refs.lightbox.classList.contains('is-open')
    ? window.addEventListener('keydown', controlView)
    : window.removeEventListener('keydown', controlView);
}

function pressEsc(evt) {
  if (refs.lightbox.classList.contains('is-open') && evt.code === 'Escape') {
    openCloseModal();
  }
}

function slideImages(evt) {
  if (!refs.lightbox.classList.contains('is-open')) {
    return;
  }

  const currentListItem = document
    .querySelector(`[data-source="${refs.openedImage.getAttribute('src')}"]`)
    .closest('.gallery__item');

  if (evt.code === 'ArrowRight' || evt.code === 'PageDown') {
    if (currentListItem !== refs.galleryList.lastElementChild) {
      refs.openedImage.setAttribute(
        'src',
        currentListItem.nextElementSibling
          .querySelector('.gallery__image')
          .getAttribute('data-source'),
      );
    } else {
      refs.openedImage.setAttribute(
        'src',
        refs.galleryList.firstElementChild
          .querySelector('.gallery__image')
          .getAttribute('data-source'),
      );
    }
  }

  if (evt.code === 'ArrowLeft' || evt.code === 'PageUp') {
    if (currentListItem !== refs.galleryList.firstElementChild) {
      refs.openedImage.setAttribute(
        'src',
        currentListItem.previousElementSibling
          .querySelector('.gallery__image')
          .getAttribute('data-source'),
      );
    } else {
      refs.openedImage.setAttribute(
        'src',
        refs.galleryList.lastElementChild
          .querySelector('.gallery__image')
          .getAttribute('data-source'),
      );
    }
  }

  if (evt.code === 'End') {
    refs.openedImage.setAttribute(
      'src',
      refs.galleryList.lastElementChild
        .querySelector('.gallery__image')
        .getAttribute('data-source'),
    );
  }

  if (evt.code === 'Home') {
    refs.openedImage.setAttribute(
      'src',
      refs.galleryList.firstElementChild
        .querySelector('.gallery__image')
        .getAttribute('data-source'),
    );
  }
}

function controlView(evt) {
  pressEsc(evt);
  slideImages(evt);
}

function replaceSrcImg(obj) {
  refs.openedImage.setAttribute(
    'src',
    obj.querySelector('.gallery__image').getAttribute('data-source'),
  );
}
