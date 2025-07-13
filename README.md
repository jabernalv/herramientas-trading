# 🧠 Herramientas de Trading

Este repositorio reúne una colección de herramientas modernas diseñadas para **traders que piensan**, no que adivinan. Cada utilidad fue creada con el objetivo de facilitar cálculos clave en la operativa diaria, mejorar la gestión del riesgo y apoyar la toma de decisiones con precisión matemática.

## 🚀 ¿Qué contiene?

- **📏 Calculadora de tamaño de lote:**  
  Determina el lote adecuado para una operación según el par, el stop loss y el porcentaje de riesgo.

- **💰 Calculadora de ganancia:**  
  Calcula la ganancia o pérdida potencial de una operación con soporte para operaciones long y short.

- **📊 Calculadora de margen:**  
  Calcula el margen requerido para abrir una posición en el mercado.

- **⚖️ Calculadora de break-even:**  
  Determina el punto de equilibrio para mover el stop loss según el porcentaje de recorrido.

- **🎯 Simulador de riesgo-recompensa:**  
  Analiza y valida operaciones según su relación riesgo-recompensa con recomendaciones automáticas.

- **🌍 Estado de mercados globales:**  
  Monitorea en tiempo real el estado de los principales mercados bursátiles con horarios locales y del mercado.

## 🎯 Enfoque

Estas herramientas no son para vender humo ni prometer rentabilidad garantizada.  
Fueron diseñadas con una sola idea en mente:

> 💡 _La precisión no es opcional cuando tu dinero está en juego._

## 🛠️ Tecnologías utilizadas

- **Vue 3** con Composition API y `<script setup>`
- **TypeScript** para tipado estático
- **Vite** para desarrollo y build optimizado
- **PrimeVue** para componentes UI modernos
- **TailwindCSS** para estilos utilitarios
- **MathJax** para renderizado de fórmulas matemáticas
- **Lucide Icons** para iconografía
- **Pinia** para gestión de estado
- **Vue Router** para navegación

## 📦 Estructura del proyecto

```
herramientas-trading/
├── public/                       # Assets estáticos
│   ├── favicon.ico              # Favicons PWA
│   ├── manifest.json            # Manifiesto PWA
│   └── assets/                  # Recursos públicos
├── src/                         # Código fuente
│   ├── components/              # Componentes Vue
│   │   ├── Index.vue           # Página principal con Fieldset
│   │   ├── NavHeader.vue       # Barra de navegación
│   │   ├── FooterComponent.vue # Pie de página
│   │   ├── LotSizeCalculator.vue    # Calculadora de lote
│   │   ├── ProfitCalculator.vue     # Calculadora de ganancia
│   │   ├── MarginCalculator.vue     # Calculadora de margen
│   │   ├── BreakevenCalculator.vue  # Calculadora de break-even
│   │   ├── ForexSimulator.vue       # Simulador R:R
│   │   └── MarketOverview.vue       # Estado de mercados
│   ├── data/                    # Datos de la aplicación
│   │   ├── trading-pairs.ts     # Configuración de pares
│   │   └── toolsMenu.ts         # Menú de herramientas
│   ├── router/                  # Configuración de rutas
│   │   └── index.ts            # Router principal
│   ├── assets/                  # Assets del proyecto
│   │   └── flags/              # Banderas de países
│   ├── utils/                   # Utilidades
│   │   └── mathjax.ts          # Configuración MathJax
│   ├── types/                   # Tipos TypeScript
│   │   └── global.d.ts         # Tipos globales
│   ├── App.vue                  # Componente raíz
│   ├── main.ts                  # Punto de entrada
│   └── style.css               # Estilos globales
├── index.html                   # HTML principal
├── vite.config.ts              # Configuración Vite
├── tsconfig.json               # Configuración TypeScript
└── package.json                # Dependencias y scripts
```

## 🚀 Instalación y desarrollo

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/jabernalv/herramientas-trading.git
   cd herramientas-trading
   ```

2. **Instala las dependencias:**

   ```bash
   pnpm install
   ```

3. **Ejecuta en modo desarrollo:**

   ```bash
   pnpm dev
   ```

4. **Construye para producción:**

   ```bash
   pnpm build
   ```

5. **Despliega a GitHub Pages:**
   ```bash
   ./deploy.sh
   ```

## 🌐 Demo en vivo

La aplicación está disponible en: **https://jabernalv.github.io/herramientas-trading/**

## ⚡ Características técnicas

- **Chunks optimizados** para carga rápida
- **Lazy loading** de componentes
- **PWA ready** con manifest y favicons
- **Responsive design** para móviles y desktop
- **TypeScript** para mejor experiencia de desarrollo
- **Componentes modernos** con PrimeVue
- **Fórmulas matemáticas** renderizadas con MathJax
- **Persistencia local** de configuraciones

## 🎨 Interfaz moderna

- **Fieldset con íconos** para organización visual
- **Cards interactivas** con hover effects
- **Componentes PrimeVue** para mejor UX
- **Notificaciones** integradas
- **Ayuda contextual** en cada herramienta
- **Validación en tiempo real**

## 👨‍💻 Autor

Desarrollado por **Jairo Bernal**, como parte de un enfoque integral para formar traders con pensamiento crítico, gestión monetaria sólida y autonomía técnica.

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - vea el archivo [LICENSE](LICENSE) para más detalles.

La Licencia MIT es una licencia de software permisiva que permite:

- ✅ Uso comercial
- ✅ Modificación
- ✅ Distribución
- ✅ Uso privado

Con las siguientes condiciones:

- ⚠️ Debe incluirse el aviso de licencia y copyright
- ⚠️ El software se proporciona "tal cual", sin garantías

---

> Si una herramienta no te ayuda a tomar mejores decisiones, es solo decoración.
