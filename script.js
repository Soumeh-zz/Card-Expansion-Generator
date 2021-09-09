function addCard(json) {
  let div = document.createElement('div');

  let img = document.createElement('img');
  img.onload = function() { this.style.borderLeft = '4px solid ' + colorHash[this.parentElement.getElementsByTagName('select')[0].value] }

  let name = document.createElement('input');
  name.placeholder = 'name';
  if (json['name']) name.value = json['name'];
  
  let imageURL = document.createElement('input');
  imageURL.placeholder = 'imageURL';
  imageURL.style.display = 'inline';
  imageURL.onchange = function() { this.parentElement.getElementsByTagName('img')[0].src = this.value }
  if (json['imageURL']) {
    img.src = json['imageURL'];
    imageURL.value = json['imageURL'];
  }

  let rarity = document.createElement('select');
  const options = ['COMMON', 'RARE', 'SUPER', 'ULTIMATE'];
  for (let i = 0; i < options.length; i++) {
    const val = options[i];
    let option = document.createElement('option');
    option.value = val;
    option.innerText = val;
    rarity.appendChild(option);
  }
  rarity.onchange = function() { this.parentElement.getElementsByTagName('img')[0].style.borderLeft = '4px solid ' + colorHash[this.value] }
  rarity.style.display = 'inline';
  if (json['rarity']) rarity.value = json['rarity'];

  let description = document.createElement('textarea')
  description.rows = 1;
  description.placeholder = 'description';
  description.style.display = 'block';
  if (json['description']) description.value = json['description'];

  let hp = document.createElement('input');
  hp.placeholder = 'hp';
  hp.style.display = 'inline';
  if (json['hp']) hp.value = json['hp'];

  let atk = document.createElement('input');
  atk.placeholder = 'atk';
  atk.style.display = 'inline';
  if (json['atk']) atk.value = json['atk'];

  div.appendChild(img);
  div.appendChild(name);
  div.appendChild(imageURL);
  div.appendChild(rarity);
  div.appendChild(description);
  div.appendChild(hp);
  div.appendChild(atk);

  document.getElementById('container').appendChild(div);

}

function cardsToJSON() {
  const cards = document.getElementById('container').getElementsByTagName('div');
  let json = []
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const card_data = {
      'name': card.getElementsByTagName('input')[0].value,
      'imageURL': card.getElementsByTagName('input')[1].value,
      'rarity': card.getElementsByTagName('select')[0].value,
      'description': card.getElementsByTagName('textarea')[0].value,
      'hp': card.getElementsByTagName('input')[2].value,
      'atk': card.getElementsByTagName('input')[3].value
    };
    json.push(card_data);
  }
  return json;
}

function downloadJSON() {
  const json = cardsToJSON();
  if (json.length) {
    const text = JSON.stringify(json, null, 2);
    let download = document.createElement('a');
    download.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
    download.setAttribute('download', 'cards.json');
    download.style.display = 'none';

    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);
  }
}

function resetCards() {
  const check = confirm("Are you sure that you want to reset your cards? \nThere is no way to recover them unless you saved them locally");
  if (check) document.getElementById('container').innerHTML = '';
}

const colorHash = {
  "COMMON": "#D8D8D8",
  "RARE": "#9FE5ED",
  "SUPER": "#D1A21F",
  "ULTIMATE": "#9E1E9C"
}

function imageRarityColor(image, rarity) {
  const color = colorHash[rarity];
  image.style.borderLeft = '4px solid ' + color;
}

let storage = window.localStorage;

function save() {
  let json = JSON.stringify(cardsToJSON());
  storage.setItem('data', json);
}

function load() {
  const json = JSON.parse(window.localStorage.getItem('data'));
  if (json) for (let i = 0; i < json.length; i++) addCard(json[i]);
}