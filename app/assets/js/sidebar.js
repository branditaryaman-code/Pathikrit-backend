// sidebar.js
document.addEventListener("DOMContentLoaded", function () {
  const parents = document.querySelectorAll(".has-sub > a");

  parents.forEach((parent) => {
    parent.addEventListener("click", function (e) {
      e.preventDefault();

      const submenu = parent.nextElementSibling;
      if (submenu) {
        submenu.classList.toggle("open");
      }
    });
  });
});
