import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/room360",
    name: "Room360",
    component: () => import("@/views/room360/index.vue"),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
