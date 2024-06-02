import express, { response } from "express";
import axios from "axios";
import loger from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const { PORT, BASE_URL, API_KEY } = process.env;
const httpserver = createServer(app);
const io = new Server(httpserver, {
  cors: {
    origin: "*",
  },
});

app.use(loger("dev"));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const getCryptos = async (req, res) => {
  try {
    const cryptos = [
      "BTC",
      "ETH",
      "LTC",
      "XRP",
      "BCH",
      "XMR",
      "EOS",
      "ETC",
      "XLM",
      "DOGE",
      "ADA",
      "AVAX",
      "BAT",
      "BNB",
      "BSV",
      "COMP",
      "DAI",
      "DASH",
      "FIL",
      "IOTX",
      "LINK",
      "LSK",
      "LUNA",
      "MATIC",
      "MIOTA",
      "MKR",
      "NAV",
      "NEO",
      "NMC",
      "OMG",
      "PPC",
      "RDD",
      "RVN",
      "SOL",
      "STEEM",
      "THETA",
      "TRX",
      "UNI",
      "USDC",
      "USDT",
      "XNO",
      "XPM",
      "XZC",
    ];
    const response = await axios.get("https://api.coincap.io/v2/assets", {
      headers: {
        "Accept-Encoding": "gzip",
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    const data = response.data.data;

    const filterData = [];

    data.forEach((element) => {
      filterData.push({
        name: element.name,
        symbol: element.symbol,
        priceUsd: element.priceUsd,
        marketCapUsd: element.marketCapUsd,
      });
    });
    return (filterData);
  } catch (error) {
    console.log("Error: ", error.message);
    return ({ error: error.message });
  }
};

setInterval(async () => {
  const data = await getCryptos();
  io.emit("crypto", data);
}, 10000);


//configurar socket.io
io.on("connection", (socket) => {
  console.log("new user connected");

  socket.on("requestPrices", async () => {
    const data = await getCryptos();
    socket.emit("CryptoPrice", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("message", (message) => {
    console.log("Mensaje: ", message);
  });
})

httpserver.listen(PORT, () => {
  console.log(`Server runng on port ${PORT}`);
});

// app.listen(PORT, () => {
//   console.log(`Server runng on port ${PORT}`);
// });
