import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import MedicineView from "../views/MedicineView.vue";
import DoctorView from "@/views/Doctoreview.vue";
import AppointView from "@/views/AppointView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/medicine",
    name: "medicine",
    component: MedicineView,
  },
  {
    path: "/vaccine",
    name: "vaccine",
    component: AppointView,
  },
  {
    path: "/doctor",
    name: "doctor",
    component: DoctorView,
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
