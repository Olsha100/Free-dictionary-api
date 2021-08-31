let btn = document.querySelector('.search-box__button');
let input = document.querySelector('.search-box__input');
let link = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
let content = document.querySelector('.content-container');
let searchContainer = document.querySelector('.search-container');
let mainContainer = document.querySelector('.main-container');

let wordContainer = document.querySelector('.content-container__searched-word');

let contentPhonetics = document.querySelector('.content-container__phonetics');
let contentPhoneticsPara = document.querySelector(
  '.content-container__phonetics > .container >.content-container__paragraph'
);

let contentOriginPara = document.querySelector(
  '.content-container__origin > .content-container__paragraph'
);

let contentMeanings = document.querySelector('.content-container__meanings');

let playIcon = document.querySelector('.content-container__play-icon');

//Creating an object Howl to then load audio in a phonetic section
var sound = new Howl({
  src: [''],
  html5: true,
});

async function fetchData(url) {
  //Removing potential error message thrown in a previous search
  let error = document.querySelector('#error');
  if (error) {
    error.remove();
  }

  try {
    let response = await fetch(url);

    if (response.status === 404) {
      throw new Error(
        `Could not find word <span>${input.value}</span> in the dictionary`
      );
    } else if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data = await response.json();

    //Displaying div with content (It's hidden in the first load and when error is thrown)
    content.classList.remove('content-container--hidden');
    mainContainer.classList.add('main-container--moved');

    //LOADING FETCHED DATA - SEARCHED WORD, PHONETICS, MEANINGS AND ORIGIN

    //SEARCHED WORD
    wordContainer.innerHTML = `Searched word:  <span>${data[0].word}</span>`;

    //PHONETICS

    //no phonetics data
    if (data[0].phonetics.length === 0) {
      contentPhonetics.classList.add('content-container__phonetics--hidden');
    }

    //phonetics data provided
    else {
      contentPhonetics.classList.remove('content-container__phonetics--hidden');
      contentPhoneticsPara.innerHTML = `/${data[0].phonetics[0].text}/`;

      //loading audio file to the Howl object
      sound.unload();
      sound._src = `https:${data[0].phonetics[0].audio}`;
    }

    //MEANINGS

    //Removing data from previous search
    contentMeanings.innerHTML = '';

    //Restoring header "Meanings"
    let header = document.createElement('h2');
    header.classList.add('content-container__header');
    header.innerHTML = 'Meanings';
    contentMeanings.appendChild(header);

    //Creating headers for parts of speech
    for (let i = 0; i < data[0].meanings.length; i++) {
      let header = document.createElement('h3');
      header.classList.add('content-container__header');
      header.innerHTML = data[0].meanings[i].partOfSpeech;
      contentMeanings.appendChild(header);

      //Creating paragraphs for storing definitions
      for (let j = 0; j < data[0].meanings[i].definitions.length; j++) {
        let paragraph = document.createElement('p');
        paragraph.classList.add('content-container__paragraph');
        paragraph.innerHTML = data[0].meanings[i].definitions[j].definition;
        contentMeanings.appendChild(paragraph);
      }
    }

    //ORIGIN
    contentOriginPara.innerHTML = data[0].origin;
  } catch (e) {
    //Hiding div with content
    content.classList.add('content-container--hidden');

    //Appedning error message to DOM
    let errorMessage = document.createElement('p');
    errorMessage.setAttribute('id', 'error');
    if (input.value == '') {
      errorMessage.innerHTML = `You haven't typed anything to the browser window`;
    } else {
      errorMessage.innerHTML = e;
    }
    searchContainer.appendChild(errorMessage);
  }
}

btn.addEventListener('click', () => {
  link += input.value;
  fetchData(link);

  OverlayScrollbars(document.querySelectorAll('body'), {});
  link = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
});

playIcon.addEventListener('click', () => {
  sound.play();
});
