// src/services/config.js

// export const Base_URI = "http://localhost:8000/api";
export const Base_URI = "https://Backend.priyansh.site/api";

export const config = {
    // imageurl:'http://localhost:8000',
    imageurl:'https://Backend.priyansh.site/api',
    RegisterUser: `${Base_URI}/users/register`,
    Login: `${Base_URI}/users/login`,
    GetUserProfile: `${Base_URI}/users/profile`,
    GetAllUsers: `${Base_URI}/users/all`,
    DeleteUser: `${Base_URI}/users/delete`,
    GetUserDetails: `${Base_URI}/users/details`,
    GetFacilities:`${Base_URI}/dropdowns/facilities`,
    AddFacility:`${Base_URI}/dropdowns/facilities`,
    AddBooking:`${Base_URI}/bookings`,
     GetEvents: `${Base_URI}/dropdowns/event-types`,
  AddEvents: `${Base_URI}/dropdowns/event-types`,
  DeleteEvent: (id) => `${Base_URI}/dropdowns/event-types/${id}`,
  DeleteFacility: (id) => `${Base_URI}/dropdowns/facilities/${id}`,
  OccasionTypes: `${Base_URI}/dropdowns/occasion-types`,
  DeleteOccasionTypes: (id) => `${Base_URI}/dropdowns/occasion-types/${id}`,
  ServingTypes: `${Base_URI}/dropdowns/serving-types`,
  DeleteServingTypes: (id) => `${Base_URI}/dropdowns/serving-types/${id}`,
    CreateEvent: (occasionId) => `${Base_URI}/occasions/${occasionId}/events`,
    GetOccasionsEvent: (occasionId) => `${Base_URI}/occasions/${occasionId}/events`,
     DeleteEventFromOccasion: (id) => `${Base_URI}/events/${id}`,
    GetBookingType: `${Base_URI}/dropdowns/booking-types`,
  AddBookingType: `${Base_URI}/dropdowns/booking-types`,
  DeleteBookingType: (id) => `${Base_URI}/dropdowns/booking-types/${id}`,
  GetDishCategories: `${Base_URI}/dropdowns/dish-categories`,
  AddDishCategories: `${Base_URI}/dropdowns/dish-categories`,
  DeleteDishCategories: (id) => `${Base_URI}/dropdowns/dish-categories/${id}`,
  GetDishSubCategories: `${Base_URI}/dropdowns/dish-subcategories`,
  AddDishSubCategories: `${Base_URI}/dropdowns/dish-subcategories`,
  DeleteDishSubCategories: (id) => `${Base_URI}/dropdowns/dish-subcategories/${id}`,
  GetIngredientTypes: `${Base_URI}/dropdowns/ingredient-types`,
  AddIngredientTypes: `${Base_URI}/dropdowns/ingredient-types`,
  DeleteIngredientTypes: (id) => `${Base_URI}/dropdowns/ingredient-types/${id}`,
   GetUnitTypes: `${Base_URI}/dropdowns/unit-types`,
  AddUnitTypes: `${Base_URI}/dropdowns/unit-types`,
  DeleteUnitTypes: (id) => `${Base_URI}/dropdowns/unit-types/${id}`,
   GetIngredients: `${Base_URI}/ingredients`,
   AddIngredients: `${Base_URI}/ingredients`,
   AddDish: `${Base_URI}/dishes`,
   GetDishes: `${Base_URI}/dishes`,
   SaveEventDishIngredient: (eventId, dishId) =>
  `${Base_URI}/events/${eventId}/dishes/${dishId}/ingredients`,
    GenerateList: (id) => `${Base_URI}/reports/booking/${id}/ingredients`,
    GenerateEventList: (eventId) => `${Base_URI}/reports/event/${eventId}/ingredients`,


};
