require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const authMiddleware = require("./middleware/auth");
const itemRoutes = require("./routes/items");

const app = express();

app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/items", itemRoutes);

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar: avatar || ""
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
});

app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
});

app.get("/users/me", authMiddleware, (req, res) => {
  res.json(req.user);
});

app.patch("/users/me", authMiddleware, async (req, res) => {
  try {
    const { name, avatar } = req.body;

    if (typeof name === "string") {
      req.user.name = name.trim();
    }

    if (typeof avatar === "string") {
      req.user.avatar = avatar.trim();
    }

    await req.user.save();

    res.json(req.user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Profile update failed" });
  }
});

app.get("/weather", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    const latitude = Number(lat);
    const longitude = Number(lon);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({
        message: "Valid latitude and longitude are required",
      });
    }

    if (!process.env.OPENWEATHER_API_KEY) {
      return res.status(500).json({
        message: "OpenWeather API key is not configured",
      });
    }

    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
    );

    if (!weatherResponse.ok) {
      const errorBody = await weatherResponse.text();

      console.error("OpenWeather error:", errorBody);

      return res.status(weatherResponse.status).json({
        message: "Failed to fetch weather data",
      });
    }

    const weather = await weatherResponse.json();

    res.json({
      temp: {
        C: Math.round(weather.main.temp),
        F: Math.round((weather.main.temp * 9) / 5 + 32),
      },
      city: weather.name || "",
      country: weather.sys?.country || "",
      description: weather.weather?.[0]?.description || "",
      type: weather.main.temp >= 18 ? "hot" : "cold",
      coordinates: {
        latitude,
        longitude,
      },
    });
  } catch (error) {
    console.error("Weather endpoint error:", error);

    res.status(500).json({
      message: "Weather service failed",
    });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(process.env.PORT, () => {
  console.log(`WeatherFit API running on port ${process.env.PORT}`);
});
