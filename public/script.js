const fearDropdown = document.querySelector(".dropdown");
const fearDropdownBtn = document.querySelector(".dropdown-trigger");

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
  });
});