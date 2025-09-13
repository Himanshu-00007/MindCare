import express from "express";
import {
  createBooking,
  listBookings,
  getBooking,
  cancelBooking,
  getMyBooking
} from "../controllers/booking.controllers.js";
import { verifyJWT } from "../middlewares/studentAuth.js";

const router = express.Router();

router.post("/create-booking", verifyJWT, createBooking);
router.get("/list-bookings", verifyJWT, listBookings);
router.get("/get-booking/:id", verifyJWT, getBooking);
router.delete("/cancel-booking/:id", verifyJWT, cancelBooking);
router.get("/my-booking", verifyJWT, getMyBooking);

export default router;
