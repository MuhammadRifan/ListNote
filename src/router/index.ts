import MainLayout from "@/layouts/MainLayout.vue";
import NoteView from "@/views/NoteView.vue";
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
      meta: {
        layout: MainLayout,
      },
    },
    {
      path: "/note",
      name: "Note",
      component: NoteView,
      meta: {
        layout: MainLayout,
      },
    },
  ],
});

export default router;
