const fearDropdown = document.querySelector(".dropdown");
const fearDropdownBtn = document.querySelector(".dropdown-trigger");
const fear = document.querySelector("#fear");
const fearImg = document.querySelector("#fear-img");

let googleUserId;

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
      setFearDb(fear.innerText);
    } else {
      console.log(snapshot.val());
      fear.innerText = snapshot.val()['fear'];
    }
  });
}

document.querySelector("#fear-btn").addEventListener('click', e => {
  let myKey = "06qB4LQYg6mmyGufbjVkBL8Z8uimWUVY";
  let topic;

  let num = getRandom(2); // 50/50
  if (num == 0) {
    topic = "scary " + fear.innerText;
  } else {
    topic = "cute " + fear.innerText;
  }
  
  let query = `https://api.giphy.com/v1/gifs/search?api_key=${myKey}&q=${topic}`;
  
  fetch(query)
    .then(response => response.json())
    .then(json => {
      let gif = json.data[getRandom(json.data.length)];
      fearImg.setAttribute('src', gif.images.original.url);
    })
    .catch(error => {
      console.log(error);
    });
});


function getRandom(max) {
  return Math.floor(Math.random() * Math.floor(max));
}




document.querySelectorAll(".dropdown").forEach(dropdown => {
  dropdown.addEventListener('click', e => {
    if (dropdown.classList.contains("is-active")) {
      dropdown.classList.remove("is-active");
    } else {
      dropdown.classList.add("is-active")
    }
  });
});

document.querySelectorAll(".dropdown-item").forEach(item => {
  item.addEventListener('click', e => {
    fearDropdown.querySelector("button > span").innerText = item.innerText;
    setFearDb(item.innerText)
  });
});

function setFearDb(val) {
  firebase.database().ref(`users/${googleUserId}`).set({
    fear: val
  });
}