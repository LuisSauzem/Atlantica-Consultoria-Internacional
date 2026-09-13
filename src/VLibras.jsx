import { useEffect } from 'react';

export default function VLibras() {
  useEffect(() => {
    // 1. Evita duplicar o script se o componente remontar
    const existingScript = document.getElementById('vlibras-script');
    
    const initVLibras = () => {
      if (window.VLibras && window.VLibras.Widget) {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
      }
    };

    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'vlibras-script';
      script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
      script.async = true;
      script.onload = initVLibras;
      document.body.appendChild(script);
    } else {
      // Se o script já existe (ex: mudou de rota), reinicializa o widget
      initVLibras();
    }
  }, []);

  return (
    // Atributos customizados como "vw" precisam ser passados como strings vazias no React
    <div vw="" className="enabled">
      <div vw-access-button="" className="active"></div>
      <div vw-plugin-wrapper="">
        <div className="vw-plugin-top-wrapper"></div>
      </div>
    </div>
  );
}
