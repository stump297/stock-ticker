require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const symbolSchema = new mongoose.Schema({
  name: { type: String, unique: true },
});

const Symbol = mongoose.model("Symbol", symbolSchema);

// Add a symbol
app.post("/api/symbols", async (req, res) => {
  try {
    const symbol = new Symbol({ name: req.body.name.toUpperCase() });
    await symbol.save();
    res.status(201).send(symbol);
  } catch (error) {
    res.status(400).send({ error: "Symbol already exists or invalid input" });
  }
});

// Get all symbols
app.get("/api/symbols", async (req, res) => {
  const symbols = await Symbol.find();
  res.send(symbols);
});

// Delete a symbol
app.delete("/api/symbols/:id", async (req, res) => {
  await Symbol.findByIdAndDelete(req.params.id);
  res.send({ message: "Symbol deleted" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

app.get("/api/prices", async (req, res) => {
  const symbols = await Symbol.find();
  const promises = symbols.map(async (symbol) => {
    // Replace with your API key
    const apiKey = "YOUR_API_KEY";
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol.name}&token=${apiKey}`
    );
    const data = await response.json();
    return { symbol: symbol.name, price: data.c };
  });
  const prices = await Promise.all(promises);
  res.send(prices);
});
