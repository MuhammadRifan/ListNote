import MainLayout from "@/layouts/MainLayout.vue";
import NoteView from "../views/NoteView.vue";
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import RoutingUtil from "@/util/RoutingUtil";
import { ePage } from "@/util/NoteEnum";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: RoutingUtil.getPageRouting(ePage.eHome).path,
      name: RoutingUtil.getPageRouting(ePage.eHome).name,
      component: HomeView,
      meta: {
        layout: MainLayout,
      },
    },
    {
      path: RoutingUtil.getPageRouting(ePage.eNote).path,
      name: RoutingUtil.getPageRouting(ePage.eNote).name,
      component: NoteView,
      meta: {
        layout: MainLayout,
      },
    },
  ],
});

export default router;
