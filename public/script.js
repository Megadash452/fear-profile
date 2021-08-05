const fearDropdown = document.querySelector(".dropdown");
const fearDropdownBtn = document.querySelector(".dropdown-trigger");
const fearEl = document.querySelector("#fear");
const imgDiv = document.querySelector("#images");
const customFear = document.querySelector("#custom-fear");
const imgCounter = document.querySelector("#num-of-imgs");
// const fearImg = document.querySelector("#fear-img");

let googleUserId;
const giphyKey = "06qB4LQYg6mmyGufbjVkBL8Z8uimWUVY"

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUserId = user.uid;
      getFear(googleUserId);
            
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html';
    };
  });
};

function getFear(uid) {
  // get the value of "fear" from teh database and put it in the dropdown
  firebase.database().ref(`users/${uid}`).on('value', snapshot => {
    data = snapshot.val();

    if (!data) {
      setFearDb(fearEl.innerText);
    } else {
      console.log(snapshot.val());
      fearEl.innerText = snapshot.val()['fear'];
    }
  });
}

document.querySelector("#fear-btn").addEventListener('click', e => {
  let topic;
  let fear;

  if (fearEl.innerText == "Use Custom Fear")
    fear = "fear of " + customFear.value;
  else
    fear = "fear of " + fearEl.innerText;

  let randNum = getRandom(2); // 50/50
  if (randNum)
    topic = "scary " + fear; // scary
  else
    topic = "cute " + fear; // cute

  console.log(topic);
  
  let query = `https://api.giphy.com/v1/gifs/search?api_key=${giphyKey}&q=${topic}`;
  fetch(query)
    .then(response => response.json())
    .then(renderGifs)
    .catch(error => {
      console.log(error);
    });
});


function getRandom(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


function renderGifs(json) {
  let html = "";
  let numGifs = parseInt(imgCounter.value);

  if (numGifs == 0) {
    alert("You have made a terrible mistake");
    imgCounter.value = 10;
    console.log("jumpscare");
    
    fetch(`https://api.giphy.com/v1/gifs/search?api_key=${giphyKey}&q=${fearEl.innerText} jumpscare`)
      .then(response => response.json())
      .then(renderGifs)
      .catch(error => {
        console.log(error);
      });
    return;
  }

  try {      
    for (let i = 0; i < numGifs; i++)
      html += `<img src="${json.data[i].images.original.url}"></img>`;

    imgDiv.innerHTML = html;
  } catch {
    console.log("NO IMAGES FOUND")
    imgDiv.innerHTML = "";
  }
}


document.querySelectorAll(".dropdown").forEach(dropdown => {
  dropdown.addEventListener('click', e => {
    if (dropdown.classList.contains("is-active"))
      dropdown.classList.remove("is-active");
    else
      dropdown.classList.add("is-active");
  });
});

document.querySelectorAll(".dropdown-item").forEach(item => {
  item.addEventListener('click', e => {
    fearDropdown.querySelector("button > span").innerText = item.innerText;
    setFearDb(item.innerText)
  });
});

imgCounter.addEventListener('change', e=> {
  let val = parseInt(imgCounter.value);
  let min = parseInt(imgCounter.getAttribute("min"));
  let max = parseInt(imgCounter.getAttribute("max"));

  if (val < min)
    imgCounter.value = min;
  else if (val > max)
    imgCounter.value = max;
});

document.querySelector("#close-modal").addEventListener('click', e => {
  document.querySelector(".modal").classList.remove("is-active");
});

document.querySelector("#modal-btn").addEventListener('click', e => {
  document.querySelector(".modal").classList.add("is-active");
});

function setFearDb(val) {
  firebase.database().ref(`users/${googleUserId}`).set({
    fear: val
  });
}