
const isArrayEqual = (a, b) => a.length === b.length && [...a].every(value => b.includes(value))

const parseMoney = (numberValue, numDecimals = 2) => {
    return numberValue.toFixed(numDecimals).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

const formatDate = (isoDate)  => {
  if (!isoDate) return "";

  const date = new Date(isoDate);

  return date.toLocaleDateString("es-PE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

const getMinDate = (days) => {
  const today = new Date();
  const minDate = new Date();
  minDate.setDate(today.getDate() - days);
  return minDate.toISOString().split("T")[0];
}

const getMaxDate = (days) => {
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + days);
  return maxDate.toISOString().split("T")[0];
}

const getCurrenDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0]
}

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
    getCurrenDate,
    getMinDate,
    getMaxDate,
    formatDateYMD,
    copyToClipboard,
}