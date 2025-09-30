document.addEventListener("DOMContentLoaded", () => {
  // Spinner
  const spinner = document.getElementById("spinner");
  if (spinner) {
    setTimeout(() => {
      spinner.classList.remove("show");
    }, 1);
  }

  // Sticky Navbar
  const navbar = document.querySelector(".sticky-top");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      navbar.classList.add("bg-white", "shadow-sm");
      navbar.style.top = "0px";
    } else {
      navbar.classList.remove("bg-white", "shadow-sm");
      navbar.style.top = "-150px";
    }
  });

  // Back to top button
  const backToTop = document.querySelector(".back-to-top");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      backToTop.style.display = "block";
    } else {
      backToTop.style.display = "none";
    }
  });

  backToTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
