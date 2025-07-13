import {
  createRouter,
  createWebHashHistory, // No cambiar a createWebHistory porque se rompe la navegación
  type RouteRecordRaw,
} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Index",
    component: () => import("@/components/Index.vue"),
  },
  {
    path: "/mercados",
    name: "Mercados",
    component: () => import("@/components/MarketOverview.vue"),
  },
  {
    path: "/lote",
    name: "Lote",
    component: () => import("@/components/LotSizeCalculator.vue"),
  },
  {
    path: "/margen",
    name: "Margen",
    component: () => import("@/components/MarginCalculator.vue"),
  },
  {
    path: "/ganancia",
    name: "Ganancia",
    component: () => import("@/components/ProfitCalculator.vue"),
  },
  {
    path: "/breakeven",
    name: "Breakeven",
    component: () => import("@/components/BreakevenCalculator.vue"),
  },
  {
    path: "/simulador",
    name: "Simulador",
    component: () => import("@/components/ForexSimulator.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
