const FooterComponent = {
  template: `
    <footer class="bg-white py-4 px-4 text-gray-600 border-t fixed bottom-0 w-full z-50 text-sm flex justify-between items-center">
      <p>Liberado bajo licencia MIT | Jairo Bernal, 2025</p>
      <span id="visitas" class="text-gray-400 text-xs">Visitas: ...</span>
    </footer>
  `,
  mounted() {
    fetch("https://intranet.dirigiendoproyectos.com/contador-trading.php")
      .then((res) => res.json())
      .then((data) => {
        const span = document.getElementById("visitas");
        if (span) {
          span.innerText = `Visitas: ${data.visitas}`;
        }
      })
      .catch((err) => {
        const span = document.getElementById("visitas");
        if (span) {
          span.innerText = "Visitas: error";
        }
      });
  },
};
