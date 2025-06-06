// src/services/config.js

export const Base_URI = "http://localhost:5000/api";
// export const Base_URI = "https://backend.thetrippingtales.com";

export const config = {
    imageurl:'http://localhost:5000',
    // imageurl:'https://backend.thetrippingtales.com',
    RegisterUser: `${Base_URI}/users/register`,
    Login: `${Base_URI}/users/login`,
    GetEvents:`${Base_URI}/events/all`,
    AddEvents:`${Base_URI}/events/add`,
    GetFacilities:`${Base_URI}/facilities/all`,
    AddFacility:`${Base_URI}/facilities/add`,
    GetIngredients:`${Base_URI}/ingredients/all`,
    AddIngredient:`${Base_URI}/ingredients/add`,

};
