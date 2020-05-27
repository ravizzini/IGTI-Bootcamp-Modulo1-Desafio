let inputWord = null;
let searchButton = null;
let wordWanted = 'pesquisada';

let allPeople = [];
let wantedPeople = [];

let tabPeople = null;
let countPeople = 0;
let countMale = 0;
let countFemale = 0;
let agesSum = 0;
let agesAverage = 0;

window.addEventListener('load', () => {
  tabPeople = document.querySelector('#tabPeople');
  countMale = document.querySelector('#countMale');
  countFemale = document.querySelector('#countFemale');
  agesSum = document.querySelector('#agesSum');
  agesAverage = document.querySelector('#agesAverage');

  inputWord = document.querySelector('#inputWord');
  searchButton = document.querySelector('#searchButton');

  preventFormSubmit();
  inputWord.focus();
  inputWord.addEventListener('keyup', handleActivitButton);
  fetchPeople();
});

function preventFormSubmit() {
  function handleFormSubmit(event) {
    event.preventDefault();
  }

  var form = document.querySelector('form');
  form.addEventListener('submit', handleFormSubmit);
}

function handleActivitButton(event) {
  const activitButton = document.querySelector('#searchButton');
  if (inputWord.value !== '') {
    activitButton.disabled = false;
    if (event.key === 'Enter') {
      render();
      clearValues();
      clearInput();
      activitButton.disabled = true;
    }
    activitButton.addEventListener('click', searchPeople);
  } else {
    activitButton.disabled = true;
    alert('Insira um dado para pesquisa!');
    clearInput();
  }
}

async function fetchPeople() {
  try {
    const res = await fetch(
      'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
    );
    const json = await res.json();
    allPeople = json.results.map((person) => {
      const { login, name, picture, dob, gender } = person;

      return {
        id: login.uuid,
        name: name.first + ' ' + name.last,
        picture: picture.thumbnail,
        age: dob.age,
        gender,
      };
    });

    wantedPeople = allPeople;
  } catch (error) {
    console.error('Erro ao obter dados da API' + error);
  }
}

function render() {
  searchPeople();
  renderPeopleList();
  renderStatistics();
}

function renderPeopleList() {
  wantedPeople = wantedPeople.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  let peopleHTML = '<div>';

  wantedPeople.forEach((person) => {
    const { name, picture, age } = person;

    const personHTML = `
    <div class='person'>
      <div>
      <img id="image" src="${picture}" alt="${name}">
      </div>
      <div>
       <span id="name">${name},</span> 
      </div>
      <div>
      <span>${age} anos</span>
      </div>
    </div>
    `;

    peopleHTML += personHTML;
  });

  peopleHTML += '</div>';
  tabPeople.innerHTML = peopleHTML;
}

const searchPeople = () => {
  let wanted = inputWord.value;
  wantedPeople = allPeople.filter((person) =>
    person.name.toLowerCase().includes(wanted.toLowerCase())
  );
};

function renderStatistics() {
  countPeople = wantedPeople.length;
  countPeopleResult.innerHTML = countPeople;

  wordWanted = inputWord.value;
  wordWantedResult.innerHTML = wordWanted;

  const countMaleResult = wantedPeople.filter(
    (person) => person.gender === 'male'
  ).length;
  countMale.innerHTML = countMaleResult;

  const countFemaleResult = wantedPeople.filter(
    (person) => person.gender === 'female'
  ).length;
  countFemale.innerHTML = countFemaleResult;

  const agesSumResult = wantedPeople.reduce((accumulator, current) => {
    return accumulator + current.age;
  }, 0);
  agesSum.innerHTML = agesSumResult;
  const agesAverageResult = agesSumResult / wantedPeople.length;
  agesAverage.innerHTML = agesAverageResult.toFixed(2);
}

function clearValues() {
  countPeople = 0;
  countFemaleResult = 0;
  countMaleResult = 0;
  agesSumResult = 0;
  agesAverageResult = 0;
}

const clearInput = () => {
  inputWord.value = '';
  inputWord.focus();
};
