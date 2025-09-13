// routes/booking.routes.js
import express from "express";
import { createBooking, listBookings, getBooking, cancelBooking } from "../controllers/booking.controllers.js";
import { verifyJWT } from "../middlewares/studentAuth.js";

const router = express.Router();

router.post("/create-booking", verifyJWT, createBooking);          // create booking (student)
router.get("/list-bookings", verifyJWT, listBookings);            // list booking    
router.get("get-booking/:id", verifyJWT, getBooking);           // get single booking
router.delete("cancel-booking/:id", verifyJWT, cancelBooking);     // cancel booking

export default router;
