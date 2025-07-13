# 🧠 Herramientas de trading

Este repositorio reúne una colección de herramientas diseñadas para **traders que piensan**, no que adivinan. Cada utilidad fue creada con el objetivo de facilitar cálculos clave en la operativa diaria, mejorar la gestión del riesgo y apoyar la toma de decisiones con precisión matemática.

## 🚀 ¿Qué contiene?

- **📏 Calculadora de tamaño de lote:**  
  Determina el lote adecuado para una operación según el par, el stop loss y el porcentaje de riesgo.

  - Soporte para pares principales y metales
  - Validación de datos en tiempo real
  - Ayuda contextual integrada
  - Persistencia de últimos valores usados

- **💰 Calculadora de ganancia:**  
  Calcula la ganancia o pérdida potencial de una operación.

  - Soporte para operaciones long y short
  - Cálculo preciso según el tipo de operación
  - Consideración del apalancamiento
  - Resultados en tiempo real

- **⚖️ Calculadora de break-even:**  
  Determina el punto de equilibrio para mover el stop loss.

  - Cálculo basado en el porcentaje de recorrido
  - Validación según dirección de la operación
  - Recomendaciones de gestión
  - Interfaz intuitiva

- **📊 Simulador de riesgo-recompensa:**  
  Analiza y valida operaciones según su relación riesgo-recompensa.

  - Soporte para operaciones long y short
  - Validación según dirección de la operación
  - Cálculo automático de relación R:R
  - Recomendaciones según la relación obtenida
  - Sistema de notificaciones integrado

- **🌍 Estado de mercados globales:**  
  Monitorea en tiempo real el estado de los principales mercados bursátiles.
  - Horarios de apertura y cierre en hora local y del mercado
  - Estado actual (abierto/cerrado)
  - Tiempo transcurrido y restante
  - Soporte para horario de verano
  - Actualización automática cada minuto
  - Banderas de países

## 🎯 Enfoque

Estas herramientas no son para vender humo ni prometer rentabilidad garantizada.  
Fueron diseñadas con una sola idea en mente:

> 💡 _La precisión no es opcional cuando tu dinero está en juego._

Cada herramienta está desarrollada con **Vue 3 + TailwindCSS**, utiliza una arquitectura basada en componentes y puede integrarse fácilmente en cualquier entorno o academia de formación.

## 🛠️ Tecnologías utilizadas

- Vue 3 (CDN)
- TailwindCSS (CDN)
- MathJax para renderizado de fórmulas matemáticas
- Lucide Icons para iconografía
- LocalStorage para persistencia de datos

## 📦 Estructura del repositorio

```
herramientas-trading/
├── index.html                    # Aplicación principal
├── components/                   # Componentes Vue
│   ├── NavHeader.js             # Barra de navegación
│   ├── FooterComponent.js       # Pie de página
│   ├── HomeContent.js           # Contenido principal y router
│   ├── LoteCalculator.js        # Calculadora de lote
│   ├── GananciaCalculator.js    # Calculadora de ganancia
│   ├── BreakevenCalculator.js   # Calculadora de break-even
│   ├── SimuladorCalculator.js   # Simulador R:R
│   ├── MargenCalculator.js      # Calculadora de margen
│   └── MercadosCalculator.js    # Estado de mercados
├── data/                        # Datos de la aplicación
│   └── trading-pairs.js         # Configuración de pares de trading
└── assets/                      # Recursos estáticos
    ├── trading_tools.svg        # Logo de la aplicación
    └── flags/                   # Banderas de países
        ├── us.svg              # Estados Unidos
        ├── gb.svg              # Reino Unido
        ├── jp.svg              # Japón
        ├── cn.svg              # China
        ├── hk.svg              # Hong Kong
        └── au.svg              # Australia
```

## 🚀 Instalación y uso

1. Clona este repositorio:

   ```bash
   git clone https://github.com/jabernalv/herramientas-trading.git
   ```

2. Abre `index.html` en tu navegador o sirve los archivos a través de un servidor web.

3. No requiere instalación de dependencias ni configuración adicional.

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
