import './sass/index.scss';
import { getPhoto, itemPerPage } from './api/webApi';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// Variables
const galleryEl = document.querySelector('.gallery');
const formEl = document.querySelector('#search-form');
const moreBtn = document.querySelector('.load-more');

let page = 1;
let searchValue = '';

const totalPages = Math.ceil(500 / itemPerPage);
let lightbox = new SimpleLightbox('.photo-card a', {
    captionDelay: 250,
});
  
// Listeners
formEl.addEventListener('submit', onSubmit);

// Functions
async function loadMoreCards(searchValue) {
  page += 1;
  const data = await getPhoto(searchValue, page);
  const galleryMarkup = createGalleryMarkup(data.hits);
  galleryEl.insertAdjacentHTML('beforeend', galleryMarkup);
  if (page === totalPages) {
  // moreBtn.classList.add('visually-hidden');
  addClass('visually-hidden');
  }
  lightbox.refresh();
}

function onSubmit(event) {
  event.preventDefault();
  clearMarkup(galleryEl);
  searchValue = event.currentTarget.elements.searchQuery.value.trim();
  console.dir(event.currentTarget.elements);
   if (!searchValue) {
      console.log('no arg!');
      return;
    }
  mountData(searchValue);
}

async function mountData(searchValue) {
  try {
    const data = await getPhoto(searchValue, page);
    console.log('data', data);

    const moreBtnClbk = () => {
      loadMoreCards(searchValue);
    }
    // moreBtn.classList.remove('visually-hidden');
    removeClass('visually-hidden');
    
    if (data.hits.length === 0) {
      addClass('visually-hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`, 500);
    const galleryMarkup = createGalleryMarkup(data.hits);
    updateGallery(galleryMarkup);
    lightbox.refresh();
  } catch (error) {
    addClass('visually-hidden');
    Notiflix.Notify.failure(error.message);
  }
}

function createGalleryMarkup(photoArr) {
  return photoArr.map(({ webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads
  }) =>
    `<div class="photo-card">
    <a class='link-img' href=${largeImageURL}><img src=${webformatURL} alt=${tags} loading="lazy" class="card-img" width='100%' height='70%'/></a>
  <div class="info">
    <p class="info-item">
      <b class="info-label">Likes </b><span class="info-span">${likes}</span>
    </p>
    <p class="info-item">
      <b class="info-label">Views </b><span class="info-span">${views}</span>
    </p>
    <p class="info-item">
      <b class="info-label">Comments </b><span class="info-span">${comments}</span>
    </p>
    <p class="info-item">
      <b class="info-label">Downloads </b><span class="info-span">${downloads}</span>
    </p>
  </div>
</div>`).join(''); 
}

function clearMarkup(element) {
  element.innerHTML = '';
}

function addClass(className) {
  moreBtn.classList.add(className);
}

function removeClass(className) {
  moreBtn.classList.remove(className);
}

function updateGallery(galleryMarkup) {
   galleryEl.insertAdjacentHTML('beforeend', galleryMarkup);  
}