import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// main.js
import "@/assets/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "lightbox2/dist/css/lightbox.min.css";
import "lightbox2/dist/js/lightbox.min.js";
import AOS from "aos";
import "aos/dist/aos.css";
import "animate.css";
import "toastr/build/toastr.min.css";
import toastr from "toastr";

toastr.options.closeButton = true;
toastr.options.progressBar = true;
toastr.options.positionClass = "toast-top-right";

AOS.init();

createApp(App).use(router).mount("#app");
