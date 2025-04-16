import { createRouter, createWebHistory } from "vue-router";
import IndexBook from "@/pages/book/IndexBook.vue";
import IndexDashboard from "@/pages/dashboard/IndexDashboard.vue";
import IndexStudent from "@/pages/student/IndexStudent.vue";
import IndexInventory from "@/pages/inventory/IndexInventory.vue";
import IndexTransaction from "@/pages/transactions/IndexTransaction.vue";
const routes = [
  { path: "/", component: IndexDashboard },
  { path: "/books", component: IndexBook },
  { path: "/students", component: IndexStudent },
  { path: "/inventory", component: IndexInventory },
  { path: "/transactions", component: IndexTransaction },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
