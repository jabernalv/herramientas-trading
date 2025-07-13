export interface TradingPair {
  valorPip: number;
  unidades: number;
  decimales: number;
  nombre: string;
  descripcion: string;
}

export const tradingPairs: Record<string, TradingPair> = {
  EURUSD: {
    valorPip: 10,
    unidades: 100000,
    decimales: 4,
    nombre: "Euro/Dólar",
    descripcion:
      "Par de divisas principal que relaciona el euro con el dólar estadounidense",
  },
  GBPUSD: {
    valorPip: 10,
    unidades: 100000,
    decimales: 4,
    nombre: "Libra/Dólar",
    descripcion:
      "Par de divisas que relaciona la libra esterlina con el dólar estadounidense",
  },
  USDJPY: {
    valorPip: 9.13,
    unidades: 100000,
    decimales: 2,
    nombre: "Dólar/Yen",
    descripcion:
      "Par de divisas que relaciona el dólar estadounidense con el yen japonés",
  },
  GBPJPY: {
    valorPip: 9.13,
    unidades: 100000,
    decimales: 2,
    nombre: "Libra/Yen",
    descripcion:
      "Par de divisas que relaciona la libra esterlina con el yen japonés",
  },
  AUDUSD: {
    valorPip: 10,
    unidades: 100000,
    decimales: 4,
    nombre: "Dólar Australiano/Dólar",
    descripcion:
      "Par de divisas que relaciona el dólar australiano con el dólar estadounidense",
  },
  NZDUSD: {
    valorPip: 10,
    unidades: 100000,
    decimales: 4,
    nombre: "Dólar Neozelandés/Dólar",
    descripcion:
      "Par de divisas que relaciona el dólar neozelandés con el dólar estadounidense",
  },
  USDCHF: {
    valorPip: 10,
    unidades: 100000,
    decimales: 4,
    nombre: "Dólar/Franco Suizo",
    descripcion:
      "Par de divisas que relaciona el dólar estadounidense con el franco suizo",
  },
  USDCAD: {
    valorPip: 10,
    unidades: 100000,
    decimales: 4,
    nombre: "Dólar/Dólar Canadiense",
    descripcion:
      "Par de divisas que relaciona el dólar estadounidense con el dólar canadiense",
  },
  XAUUSD: {
    valorPip: 1,
    unidades: 100,
    decimales: 2,
    nombre: "Oro/Dólar",
    descripcion: "Oro contra dólar estadounidense, medido en onzas troy",
  },
  XAGUSD: {
    valorPip: 5,
    unidades: 5000,
    decimales: 3,
    nombre: "Plata/Dólar",
    descripcion: "Plata contra dólar estadounidense, medido en onzas troy",
  },
  XAUEUR: {
    valorPip: 1,
    unidades: 100,
    decimales: 2,
    nombre: "Oro/Euro",
    descripcion: "Oro contra euro, medido en onzas troy",
  },
  XAGEUR: {
    valorPip: 5,
    unidades: 5000,
    decimales: 3,
    nombre: "Plata/Euro",
    descripcion: "Plata contra euro, medido en onzas troy",
  },
};

// Funciones helper
export const helpers = {
  /**
   * Obtiene el valor del pip para un par específico
   * @param pair - El par de trading
   * @returns El valor del pip
   */
  getPipValue: (pair: string): number | undefined =>
    tradingPairs[pair]?.valorPip,

  /**
   * Obtiene las unidades por lote para un par específico
   * @param pair - El par de trading
   * @returns Las unidades por lote
   */
  getUnits: (pair: string): number | undefined => tradingPairs[pair]?.unidades,

  /**
   * Obtiene el número de decimales para un par específico
   * @param pair - El par de trading
   * @returns El número de decimales
   */
  getDecimals: (pair: string): number | undefined =>
    tradingPairs[pair]?.decimales,

  /**
   * Obtiene el tamaño del pip basado en los decimales
   * @param pair - El par de trading
   * @returns El tamaño del pip como string decimal
   */
  getPipSize: (pair: string): string => {
    const decimals = tradingPairs[pair]?.decimales;
    return decimals ? Math.pow(10, -decimals).toString() : "0.0001";
  },

  /**
   * Formatea un número a la cantidad correcta de decimales para un par
   * @param pair - El par de trading
   * @param value - El valor a formatear
   * @returns El valor formateado
   */
  formatNumber: (pair: string, value: number): string => {
    const decimals = tradingPairs[pair]?.decimales;
    return decimals ? value.toFixed(decimals) : value.toString();
  },
};
