import express from "express";
import {
  createBooking,
  listBookings,
  getBooking,
  cancelBooking,
  getMyBooking,
  getMyBookingsForCounsellor,
  cancelMyBookingAsCounsellor,
  confirmBookingAsCounsellor
} from "../controllers/booking.controllers.js";
import { verifyJWT} from "../middlewares/studentAuth.js";
import { verifyJWT as counsellorAuth } from "../middlewares/counsellorAuth.js";

const router = express.Router();

router.post("/create-booking", verifyJWT, createBooking);
router.get("/list-bookings", verifyJWT, listBookings);
router.get("/get-booking/:id", verifyJWT, getBooking);
router.delete("/cancel-booking/:id", verifyJWT, cancelBooking);
router.get("/my-booking", verifyJWT, getMyBooking);
router.get("/counsellor-bookings", counsellorAuth, getMyBookingsForCounsellor);
router.delete("/counsellor-cancel-booking/:id", counsellorAuth, cancelMyBookingAsCounsellor);
router.patch(
  "/confirm/:id",
  counsellorAuth, // ensure user is logged in
  confirmBookingAsCounsellor
);

export default router;
