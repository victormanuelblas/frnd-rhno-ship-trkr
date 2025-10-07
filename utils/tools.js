
const isArrayEqual = (a, b) => a.length === b.length && [...a].every(value => b.includes(value))

const parseMoney = (numberValue, numDecimals = 2) => {
    return numberValue.toFixed(numDecimals).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

const formatDate = (isoDate)  => {
  if (!isoDate) return "";

  const dateOnlyMatch = isoDate.match(/^(\d{4}-\d{2}-\d{2})(?:T00:00:00(?:\.0+)?Z)?$/);
  if (dateOnlyMatch) {
    const [year, month, day] = dateOnlyMatch[1].split("-");
    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
  }

  const d = new Date(isoDate);
  return d.toLocaleDateString("es-PE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

const toLocalISODate = (date) => {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().split("T")[0];
};

/**
 * Devuelve la fecha actual local (sin desfase)
 */
export const getCurrentDate = () => {
  return toLocalISODate(new Date());
};

/**
 * Devuelve la fecha mínima restando "days" días desde hoy
 */
export const getMinDate = (days = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return toLocalISODate(date);
};

/**
 * Devuelve la fecha máxima sumando "days" días desde hoy
 */
export const getMaxDate = (days = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toLocalISODate(date);
};
const formatDateYMD = (date) => {
  const thisDate = new Date(date);
  return thisDate.toISOString().split("T")[0];
}

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      alert("Código copiado al portapapeles: " + text);
    })
    .catch(() => {
      alert("No se pudo copiar al portapapeles");
    });
};

export {
    isArrayEqual,
    parseMoney,
    formatDate,
    getCurrentDate,
    getMinDate,
    getMaxDate,
    formatDateYMD,
    copyToClipboard,
}