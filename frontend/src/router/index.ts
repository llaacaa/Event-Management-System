import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import PopularView from "@/views/PopularView.vue";
import CategoriesView from "@/views/CategoriesView.vue";
import CategoryView from "@/views/CategoryView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/categories",
      name: "categories",
      component: CategoriesView,
    },
    {
      path: "/categories/:name",
      name: "category",
      component: CategoryView,
    },
    {
      path: "/popular",
      name: "popular",
      component: PopularView,
    },
    {
      path: "/events-by-tag",
      name: "eventsByTag",
      component: () => import("../views/EventsByTagView.vue"),
    },
    {
      path: "/events/:id",
      name: "details",
      component: () => import("../views/EventDetailsView.vue"),
    },
    {
      path: "/all-events",
      name: "allEvents",
      component: () => import("../views/AllEventsView.vue"),
    },
    {
      path: "/users",
      name: "users",
      component: () => import("../views/UsersView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
  ],
});

export default router;
