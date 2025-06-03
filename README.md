# 🧠 Herramientas de trading

Este repositorio reúne una colección de herramientas diseñadas para **traders que piensan**, no que adivinan. Cada utilidad fue creada con el objetivo de facilitar cálculos clave en la operativa diaria, mejorar la gestión del riesgo y apoyar la toma de decisiones con precisión matemática.

## 🚀 ¿Qué contiene?

- **📏 Calculadora de tamaño de lote:**  
  Determina el lote adecuado para una operación según el par, el stop loss y el porcentaje de riesgo.

  - Soporte para pares principales y metales
  - Validación de datos en tiempo real
  - Ayuda contextual integrada
  - Persistencia de últimos valores usados

- **📊 Simulador de riesgo-recompensa:**  
  Analiza y valida operaciones según su relación riesgo-recompensa.
  - Soporte para operaciones long y short
  - Validación según dirección de la operación
  - Cálculo automático de relación R:R
  - Recomendaciones según la relación obtenida
  - Historial de últimas 10 simulaciones
  - Sistema de notificaciones integrado

## 🎯 Enfoque

Estas herramientas no son para vender humo ni prometer rentabilidad garantizada.  
Fueron diseñadas con una sola idea en mente:

> 💡 _La precisión no es opcional cuando tu dinero está en juego._

Cada herramienta está desarrollada con **Vue 3 + TailwindCSS**, es completamente autoejecutable en HTML y puede integrarse fácilmente en cualquier entorno o academia de formación.

## 📚 Uso

Puedes abrir directamente los archivos `.html` en tu navegador. No requieren backend, no almacenan datos en servidores externos, y funcionan offline. Los datos se guardan localmente en tu navegador usando localStorage.

## 📦 Estructura del repositorio

```
herramientas-trading/
├── index.html                 # Página de inicio
├── lote.html                  # Calculadora de tamaño de lote
├── simulador.html             # Simulador de riesgo-recompensa
├── components/                # Componentes Vue reutilizables
│   ├── NavHeader.js           # Barra de navegación
│   └── FooterComponent.js     # Pie de página
└── README.md
```

## 🧩 Próximas herramientas

- Calculadora de break-even
- Simulador de riesgo-recompensa

---

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
