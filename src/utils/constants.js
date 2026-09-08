import beanieImage from "../assets/clothing/beanie.jpg";
import winterJacketImage from "../assets/clothing/winter-jacket.jpg";
import sweaterImage from "../assets/clothing/sweater.jpg";
import sweatpantsImage from "../assets/clothing/sweatpants.jpg";
import scarfImage from "../assets/clothing/scarf.jpg";
import glovesImage from "../assets/clothing/gloves.jpg";
import tshirtImage from "../assets/clothing/t-shirt.jpg";
import tankTopImage from "../assets/clothing/tank-top.jpg";
import shortsImage from "../assets/clothing/shorts.jpg";
import capImage from "../assets/clothing/cap.jpg";
import sunglassesImage from "../assets/clothing/sunglasses.jpg";
import sneakersImage from "../assets/clothing/sneakers.jpg";

export const defaultClothingItems = [
  {
    _id: 1,
    name: "Beanie",
    weather: "cold",
    imageUrl: beanieImage,
  },
  {
    _id: 2,
    name: "Winter Jacket",
    weather: "cold",
    imageUrl: winterJacketImage,
  },
  {
    _id: 3,
    name: "Sweater",
    weather: "cold",
    imageUrl: sweaterImage,
  },
  {
    _id: 4,
    name: "Sweatpants",
    weather: "cold",
    imageUrl: sweatpantsImage,
  },
  {
    _id: 5,
    name: "Scarf",
    weather: "cold",
    imageUrl: scarfImage,
  },
  {
    _id: 6,
    name: "Gloves",
    weather: "cold",
    imageUrl: glovesImage,
  },
  {
    _id: 7,
    name: "T-shirt",
    weather: "hot",
    imageUrl: tshirtImage,
  },
  {
    _id: 8,
    name: "Tank Top",
    weather: "hot",
    imageUrl: tankTopImage,
  },
  {
    _id: 9,
    name: "Shorts",
    weather: "hot",
    imageUrl: shortsImage,
  },
  {
    _id: 10,
    name: "Cap",
    weather: "hot",
    imageUrl: capImage,
  },
  {
    _id: 11,
    name: "Sunglasses",
    weather: "hot",
    imageUrl: sunglassesImage,
  },
  {
    _id: 12,
    name: "Sneakers",
    weather: "hot",
    imageUrl: sneakersImage,
  },
];

export const demoUser = {
  _id: "weatherfit-demo-user",
  email: "demo@weatherfit.app",
  name: "Demo User",
  avatar: "",
};

export const demoClothingItems = defaultClothingItems.map((item, index) => ({
  ...item,
  _id: `demo-${item._id}`,
  owner: demoUser._id,
  likes: index % 4 === 0 ? [demoUser._id] : [],
}));

export const DEMO_SESSION_STORAGE_KEY = "weatherfit-demo-session";
export const LOCAL_ITEM_LIKES_STORAGE_KEY = "weatherfit-local-item-likes";

export const coordinates = {
  latitude: 40.779442,
  longitude: -74.023567,
};

export const BASE_URL =
  import.meta.env.VITE_API_URL ?? "/api";
