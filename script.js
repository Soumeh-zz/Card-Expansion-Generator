function main() {
  // ???
}

function addCard() {
  let div = document.createElement('div');
  div.classList.add("card");

  let img = document.createElement('img');
  div.appendChild(img);

  let name = document.createElement('input');
  name.placeholder = 'name';
  let imageURL = document.createElement('input');
  imageURL.placeholder = 'imageURL';
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
  // do shit
}