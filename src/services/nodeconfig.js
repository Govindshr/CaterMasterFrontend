// src/services/config.js

export const Base_URI = "http://localhost:8000/api";
// export const Base_URI = "https://backend.thetrippingtales.com";

export const config = {
    imageurl:'http://localhost:8000',
    // imageurl:'https://backend.thetrippingtales.com',
    RegisterUser: `${Base_URI}/users/register`,
    Login: `${Base_URI}/users/login`,
    GetUserProfile: `${Base_URI}/users/profile`,
    GetAllUsers: `${Base_URI}/users/all`,
    DeleteUser: `${Base_URI}/users/delete`,
    GetUserDetails: `${Base_URI}/users/details`,
    GetEvents:`${Base_URI}/events/`,
    AddEvents:`${Base_URI}/events/`,
    GetFacilities:`${Base_URI}/facilities/all`,
    AddFacility:`${Base_URI}/facilities/add`,
    GetIngredients:`${Base_URI}/ingredients/all`,
    AddIngredient:`${Base_URI}/ingredients/add`,

};
