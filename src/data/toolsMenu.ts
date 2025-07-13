import {
  Globe,
  Layers,
  Percent,
  TrendingUp,
  Equal,
  BarChart3,
} from "lucide-vue-next";

export interface ToolMenuItem {
  label: string;
  icon: any;
  iconColor?: string;
  route: string;
  description: string;
  linkText: string;
  linkColor: string;
  category: string;
}

export const toolsMenu: ToolMenuItem[] = [
  {
    label: "Mercados",
    icon: Globe,
    iconColor: "text-blue-600",
    route: "/mercados",
    description:
      "Consulta los principales mercados y pares de trading disponibles.",
    linkText: "Ir a Mercados",
    linkColor: "text-blue-600 hover:text-blue-800",
    category: "Trading",
  },
  {
    label: "Lote",
    icon: Layers,
    iconColor: "text-amber-600",
    route: "/lote",
    description:
      "Calcula el tamaño de lote óptimo para tus operaciones de trading.",
    linkText: "Ir a la calculadora de Lote",
    linkColor: "text-amber-600 hover:text-amber-800",
    category: "Trading",
  },
  {
    label: "Margen",
    icon: Percent,
    iconColor: "text-green-600",
    route: "/margen",
    description:
      "Calcula el margen requerido para abrir una posición en el mercado.",
    linkText: "Ir a la calculadora de Margen",
    linkColor: "text-green-600 hover:text-green-800",
    category: "Trading",
  },
  {
    label: "Ganancia",
    icon: TrendingUp,
    iconColor: "text-emerald-600",
    route: "/ganancia",
    description: "Calcula la ganancia o pérdida potencial de una operación.",
    linkText: "Ir a la calculadora de Ganancia",
    linkColor: "text-emerald-600 hover:text-emerald-800",
    category: "Trading",
  },
  {
    label: "Break-even",
    icon: Equal,
    iconColor: "text-indigo-600",
    route: "/breakeven",
    description: "Calcula el punto de equilibrio (break-even) de tu operación.",
    linkText: "Ir a la calculadora Break-even",
    linkColor: "text-indigo-600 hover:text-indigo-800",
    category: "Trading",
  },
  {
    label: "Simulador R:R",
    icon: BarChart3,
    iconColor: "text-fuchsia-600",
    route: "/simulador",
    description: "Simula escenarios de riesgo/beneficio (R:R) para tus trades.",
    linkText: "Ir al Simulador R:R",
    linkColor: "text-fuchsia-600 hover:text-fuchsia-800",
    category: "Trading",
  },
];
