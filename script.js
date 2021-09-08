function main() {
  // ???
}

function addCard() {
  let div = document.createElement('div');

  let img = document.createElement('img');
  div.appendChild(img);

  let name = document.createElement('input');
  name.placeholder = 'name';
  let imageURL = document.createElement('input');
  imageURL.placeholder = 'imageURL';
  imageURL.onchange = function() { this.parentElement.getElementsByTagName('img')[0].src = this.value };
  let description = document.createElement('input');
  description.placeholder = 'description';
  div.appendChild(name);
  div.appendChild(imageURL);
  div.appendChild(description);

  let select = document.createElement('select');
  const options = ['COMMON', 'RARE', 'SUPER', 'ULTIMATE'];
  for (let i = 0; i < options.length; i++) {
    const val = options[i];
    let option = document.createElement('option');
    option.value = val;
    option.innerText = val;
    select.appendChild(option);
  }
  div.appendChild(select);

  let hp = document.createElement('input');
  hp.placeholder = 'hp';
  let atk = document.createElement('input');
  atk.placeholder = 'atk';
  div.appendChild(hp);
  div.appendChild(atk);

  document.getElementById('container').appendChild(div);
}

function downloadJSON(element) {
  const cards = document.getElementById('container').getElementsByTagName('div');
  let json = []
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const card_data = {
      'name': card.getElementsByTagName('input')[0].value,
      'imageURL': card.getElementsByTagName('input')[1].value,
      'description': card.getElementsByTagName('input')[2].value,
      'rarity': card.getElementsByTagName('select')[0].value,
      'hp': card.getElementsByTagName('input')[3].value,
      'atk': card.getElementsByTagName('input')[4].value
    };
    json.push(card_data);
  }

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