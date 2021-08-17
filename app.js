let box = document.querySelector('.search-box');
let btn = document.querySelector('.search-box__button');
let input = document.querySelector('.search-box__input');
let link = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
let fetchedData = document.querySelector('.fetched-data');

async function getData(url) {
  try {
    let response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data = await response.json();
    console.log(data[0]);
    // fetchedData.innerHTML = data[0].origin;
  } catch (e) {
    console.error(e);
  }
}

btn.addEventListener('click', () => {
  link += input.value;
  getData(link);
  link = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
});
