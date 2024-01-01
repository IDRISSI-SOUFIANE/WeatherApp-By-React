import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material";

// MUI
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CloudIcon from "@mui/icons-material/Cloud";
import Button from "@mui/material/Button";

// HOOKS
import { useEffect, useState } from "react";

// EXTERNAL LIBRARYS

// TRANSLATION
import { useTranslation } from "react-i18next";

//  AXIOS
import axios from "axios";

// MOMENT
import moment from "moment/moment";
import "moment/min/locales";
moment.locale("ar");

// === EXTERNAL LIBRARYS ===

// ================== //

const theme = createTheme({
  typography: {
    fontFamily: ["IBM"],
  },
});

let canselAxios = null;

function App() {
  const { t, i18n } = useTranslation();

  // ===== STATES =====

  const [dateAndTime, setDateAndTime] = useState("");
  const [temp, setTemp] = useState({
    number: null,
    description: "",
    min: null,
    max: null,
    icon: null,
  });

  const [locale, setLocale] = useState("ar");

  const direction = locale == "ar" ? "rtl" : "ltr";

  // ===== STATES =====

  // ===== EVENT HANDLERS =====
  function handleLanguageClick() {
    if (locale == "en") {
      setLocale("ar");
      i18n.changeLanguage("ar");
      moment.locale("ar");
    } else {
      setLocale("en");
      i18n.changeLanguage("en");
      moment.locale("en");
    }

    setDateAndTime(moment().format("MMM / Do / YY"));
  }
  // ===== EVENT HANDLERS =====

  useEffect(() => {
    i18n.changeLanguage(locale);
    setDateAndTime(moment().format("MMM / Do / YY"));
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=3.71&lon=59.83&appid=1eaa0da69294e1486ea57ea85614c09d",
        {
          canselToken: new axios.CancelToken((c) => {
            canselAxios = c;
          }),
        }
      )
      .then(function (response) {
        console.log(response);
        // handle success
        const responseTemp = Math.round(response.data.main.temp - 272.15);
        const min = Math.round(response.data.main.temp_min - 272.15);
        const max = Math.round(response.data.main.temp_max - 272.15);
        const description = response.data.weather[0].description;
        const responseIcon = response.data.weather[0].icon;
        console.log(responseIcon);

        setTemp({
          number: responseTemp,
          min: min,
          max: max,
          description: description,
          icon: `https://openweathermap.org/img/wn/${responseIcon}@2x.png`,
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

    return () => {
      console.log("canseling");
      canselAxios();
    };
  }, []);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          {/* CONTENT CONTAINER */}
          <div
            style={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {/* CARD */}
            <div
              dir={direction}
              style={{
                width: "100%",
                background: "rgb(28 52 91 / 36%)",
                color: "white",
                padding: "10px",
                borderRadius: "15px",
                boxShadow: "0px 11px 1px rgba(0,0,0,0.5)",
              }}
            >
              {/* CONTENT */}
              <div>
                {/* CITY & TIME */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "start",
                  }}
                  dir={direction}
                >
                  <Typography variant="h2" style={{ marginRight: "20px" }}>
                    {/* الرياض */}
                    {t("Settat")}
                  </Typography>
                  <Typography variant="h5" style={{ marginRight: "20px" }}>
                    {dateAndTime}
                  </Typography>
                </div>
                {/* === CITY & TIME === */}

                <hr />

                {/* CONTAINER OF DEGRRE + LOUD ICON */}
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  {/* DEGREE & DESCRIPTION */}
                  <div>
                    {/* TEMP */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h1" style={{ textAlign: "right" }}>
                        {temp.number}
                      </Typography>

                      {/* TODO: TEMPRATION-IMAGE */}
                      <img src={temp.icon} alt="" />
                    </div>
                    {/* === TEMP === */}

                    <Typography variant="h6">{t(temp.description)}</Typography>

                    {/* MIN & MAX */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h5>
                        {temp.min} : {t("min")}
                      </h5>
                      <h5 style={{ margin: "0px 15px" }}>|</h5>
                      <h5>
                        {temp.max} : {t("max")}
                      </h5>
                    </div>
                  </div>
                  {/* === DEGREE & DESCRIPTION === */}

                  <CloudIcon style={{ fontSize: "200px", color: "white" }} />
                </div>
                {/* === CONTAINER OF DEGRRE + LOUD ICON === */}
              </div>
              {/* === CONTENT === */}
            </div>
            {/* === CARD === */}

            {/* TRANSLATION CONTAINER */}
            <div
              dir="rtl"
              style={{
                display: "flex",
                justifyContent: "end",
                width: "100%",
                marginTop: "20px",
              }}
            >
              <Button
                variant="text"
                style={{ color: "white" }}
                onClick={handleLanguageClick}
              >
                {locale == "en" ? "عر بي" : "English"}
              </Button>
            </div>
            {/* TRANSLATION CONTAINER */}
          </div>
          {/* === CONTENT CONTAINER === */}
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
