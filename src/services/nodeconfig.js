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
    GetFacilities:`${Base_URI}/dropdowns/facilities`,
    AddFacility:`${Base_URI}/dropdowns/facilities`,
    GetIngredients:`${Base_URI}/ingredients/all`,
    AddIngredient:`${Base_URI}/ingredients/add`,
    AddBooking:`${Base_URI}/bookings`,
     GetEvents: `${Base_URI}/dropdowns/event-types`,
  AddEvents: `${Base_URI}/dropdowns/event-types`,
  DeleteEvent: (id) => `${Base_URI}/dropdowns/event-types/${id}`,
  DeleteFacility: (id) => `${Base_URI}/dropdowns/facilities/${id}`,
  OccasionTypes: `${Base_URI}/dropdowns/occasion-types`,
  DeleteOccasionTypes: (id) => `${Base_URI}/dropdowns/occasion-types/${id}`,
  ServingTypes: `${Base_URI}/dropdowns/serving-types`,
  DeleteServingTypes: (id) => `${Base_URI}/dropdowns/serving-types/${id}`,
    

};
