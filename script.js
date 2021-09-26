let storage = window.localStorage;

function addCard(json) {
  let div = document.createElement('div');
  div.classList.add('card');
  let inputs = document.createElement('div');
  inputs.classList.add('inputs')
  let display = document.createElement('div');
  display.classList.add('display')

  let delete_button = document.createElement('img');
  delete_button.classList.add('delete')
  delete_button.onclick = function(event) {
    if (event.shiftKey) {
      this.parentElement.remove();
      save();
      return;
    }
    const check = confirm("Are you sure that you want to delete this card?\nTip: You can skip this message by holding Shift");
    if (check) {
      this.parentElement.remove();
      save()
    }
  };
  delete_button.src = 'https://raw.githubusercontent.com/feathericons/feather/734f3f51144e383cfdc6d0916831be8d1ad2a749/icons/x.svg';
  div.append(delete_button);

  let img = document.createElement('img');
  img.onload = function() { this.style.borderLeft = '6px solid ' + colorHash[this.parentElement.parentElement.getElementsByClassName('inputs')[0].getElementsByTagName('select')[0].value] }

  let name = document.createElement('input');
  name.placeholder = 'name';
  if (json['name']) name.value = json['name'];

  let imageURL = document.createElement('input');
  imageURL.placeholder = 'imageURL';
  imageURL.onchange = function() { this.parentElement.parentElement.getElementsByClassName('display')[0].getElementsByTagName('img')[0].src = this.value }
  if (json['imageURL']) {
    img.src = json['imageURL'];
    imageURL.value = json['imageURL'];
  }

  let imageUpload = document.createElement('input');
  imageUpload.style.display = 'none';
  imageUpload.type = 'file';
  imageUpload.accept = 'image/*';
  imageUpload.onchange = function() {
    let APIkey = storage.getItem('APIkey')
    if (!APIkey) APIkey = prompt("You need an ImgBB API Key in order to upload images directly\nTo get one, go to https://api.imgbb.com/ and request one");
    if (APIkey && this.files) {
      storage.setItem('APIkey', APIkey);
      uploadFile(imageURL, this.files[0]);
    }
  }

  let imageUploadLable = document.createElement('label');
  let imageUploadIcon = document.createElement('img');

  imageUploadIcon.src = 'https://raw.githubusercontent.com/feathericons/feather/734f3f51144e383cfdc6d0916831be8d1ad2a749/icons/upload.svg';

  imageUploadLable.append(imageUploadIcon, imageUpload);

  let rarity = document.createElement('select');
  const options = ['COMMON', 'RARE', 'SUPER', 'ULTIMATE'];
  for (let i = 0; i < options.length; i++) {
    const val = options[i];
    let option = document.createElement('option');
    option.value = val;
    option.innerText = val;
    rarity.appendChild(option);
  }
  rarity.onchange = function() { this.parentElement.parentElement.getElementsByClassName('display')[0].getElementsByTagName('img')[0].style.borderLeft = '6px solid ' + colorHash[this.value] }
  if (json['rarity']) rarity.value = json['rarity'];

  let description = document.createElement('textarea')
  description.rows = 1;
  description.placeholder = 'description';
  if (json['description']) description.value = json['description'];

  let hp = document.createElement('input');
  hp.placeholder = 'hp';
  if (json['hp']) hp.value = json['hp'];

  let atk = document.createElement('input');
  atk.placeholder = 'atk';
  if (json['atk']) atk.value = json['atk'];

  inputs.append(name, description, imageUploadLable, imageURL, rarity, hp, atk);
  display.append(img);
  div.append(inputs, display);

  document.getElementById('container').append(div);

}

function uploadFile(target, file) {
  var reader = new FileReader();

  reader.onloadend = function() {
    let b64 = reader.result.replace(/^data:.+;base64,/, '').replaceAll('=', '%3D').replaceAll('+', '%2B');
    var xhr = new XMLHttpRequest();
    var url = 'https://api.imgbb.com/1/upload?key=' + storage.getItem('APIkey');

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status == 400) {
          switch(JSON.parse(xhr.response).error.code) {
            case 100:
              alert("Invalid API key");
              storage.removeItem('APIkey');
              return;
            case 102:
              alert("Invalid base64 string");
              return;
          }
        }
        else if (xhr.status == 200) {
          const url = JSON.parse(xhr.response).data.display_url.replace('+', '%2B')
          target.value = url;
          target.parentElement.parentElement.getElementsByClassName('display')[0].getElementsByTagName('img')[0].src = url;
          save();
        }
      }
    };

    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send('image=' + b64.replace('+', ' '));

  };
  
  reader.readAsDataURL(file);
}

function cardsToJSON() {
  const cards = document.getElementById('container').getElementsByClassName('card');
  let json = []
  for (let i = 0; i < cards.length; i++) {
    let card = cards[i];
    let inputs = card.getElementsByClassName('inputs')[0];
    const card_data = {
      'name': inputs.getElementsByTagName('input')[0].value,
      'imageURL': inputs.getElementsByTagName('input')[2].value,
      'rarity': inputs.getElementsByTagName('select')[0].value,
      'description': inputs.getElementsByTagName('textarea')[0].value,
      'hp': inputs.getElementsByTagName('input')[3].value,
      'atk': inputs.getElementsByTagName('input')[4].value
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
  if (check) {
    document.getElementById('container').innerHTML = '';
    save();
  }
}

const colorHash = {
  "COMMON": "#D8D8D8",
  "RARE": "#9FE5ED",
  "SUPER": "#D1A21F",
  "ULTIMATE": "#9E1E9C"
}

function save() {
  let json = JSON.stringify(cardsToJSON());
  storage.setItem('data', json);
}

function load() {
  const data = storage.getItem('data');
  if (data == null) {
    const URL = 'https://raw.githubusercontent.com/YoshiBleu9427/discord_ybot/master/DefaultCardDefinitions.json';
    return fetch(URL)
    .then(response => response.json())
    .then(data => {
      addCard(data[0]);
      storage.setItem('data', []);
    });
  }
  const json = JSON.parse(data);
  if (json) for (let i = 0; i < json.length; i++) addCard(json[i]);
}

function importCards(file) {
  var reader = new FileReader();
  reader.readAsText(file, "UTF-8");
  reader.onload = function (evt) {
    const data = evt.target.result;
    const json = JSON.parse(data);
    if (json) {
      const check = confirm("Do you want to reset your current cards?");
      if (check) document.getElementById('container').innerHTML = '';
      for (let i = 0; i < json.length; i++) addCard(json[i]);
    }
    save();
  }
  reader.onerror = function (evt) {
    console.log("error reading file");
  }
}