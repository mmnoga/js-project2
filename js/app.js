const apiCurrencies = axios.create({
  baseURL: "https://api.nbp.pl/api/exchangerates/rates/a",

  onDownloadProgress: (progressEvent) => {
    let percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    console.log(percentCompleted);
  },
});

const init = () => {
  formSend();
};

const formSend = () => {
  const form = document.querySelector(".js-calculate");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    makeProgress();

    const plnValueToConvert = document.getElementById("amountInput");
    const selectedCurrency = document.getElementById("currenciesList");

    if (plnValueToConvert.value) {
      const data = await getCurrencyValue(selectedCurrency.value);
      const result = document.getElementById("result");

      const calculatedValue = convertToPLN(
        plnValueToConvert.value,
        data.rates[0].mid
      );

      if (calculatedValue >= 0) {
        result.innerHTML = `${calculatedValue} PLN`;
      } else {
        result.innerHTML = `0 PLN`;
      }
    }
    return false;
  });
};

const convertToPLN = (plnValue, rate) => {
  if (plnValue < 0) {
    alert("Podaj wartość większą od zera!");
    return -1;
  }
  return (plnValue * rate).toFixed(2);
};

const getCurrencyValue = async (currency) => {
  if (currency) {
    const response = await apiCurrencies(`/${currency}/`).catch((error) => {
      console.log("Error");
      return false;
    });

    if (response) {
      const { data } = response;
      return data;
    }
  } else {
    return false;
  }
};

if (document.readyState !== "loading") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init());
}

//progress bar

function makeProgress() {
  const bar = document.querySelector(".progress-bar");

  bar.style.transition = "none";
  bar.style.width = 0;
  bar.innerText = 0;

  for (let i = 0; i <= 100; i = i + 1) {
    setTimeout(function timer() {
      bar.style.width = i + "%";
      bar.innerText = i + "%";
    }, 200);
  }
}
