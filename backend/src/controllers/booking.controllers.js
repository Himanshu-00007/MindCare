
import Booking from "../models/booking.model.js";
import Student from "../models/student.model.js";
import Counsellor from "../models/Counsellor.model.js";

/**
 * Helper: check overlapping bookings for counsellor
 * returns true if there is a conflict
 */
async function hasOverlap(counsellorId, start, end) {
  const conflict = await Booking.findOne({
    counsellor: counsellorId,
    status: { $in: ["pending", "confirmed"] },
    $or: [
      // booking starts inside an existing booking
      { start: { $lt: end, $gte: start } },
      // booking ends inside an existing booking
      { end: { $gt: start, $lte: end } },
      // existing booking fully contains requested slot
      { start: { $lte: start }, end: { $gte: end } }
    ]
  });
  return !!conflict;
}

/**
 * Create booking:
 * Body: { counsellorId, start (ISO), durationMinutes (optional), notes }
 */
export const createBooking = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { counsellorId, start, durationMinutes = 60, notes } = req.body;

    if (!counsellorId || !start) {
      return res.status(400).json({ message: "counsellorId and start time are required" });
    }

    const startDate = new Date(start);
    if (isNaN(startDate)) return res.status(400).json({ message: "Invalid start time" });
    if (startDate < new Date()) return res.status(400).json({ message: "Cannot book past times" });

    const counsellor = await Counsellor.findById(counsellorId).select("name email");
    if (!counsellor) return res.status(404).json({ message: "Counsellor not found" });

    const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

    // availability / overlap check
    const conflict = await hasOverlap(counsellorId, startDate, endDate);
    if (conflict) {
      return res.status(409).json({ message: "Selected slot not available. Choose another time." });
    }

    const booking = await Booking.create({
      student: studentId,
      counsellor: counsellorId,
      start: startDate,
      end: endDate,
      durationMinutes,
      notes,
      status: "confirmed" // you can change to "pending" if you want admin approval
    });

    const populated = await Booking.findById(booking._id)
      .populate("student", "name email institution")
      .populate("counsellor", "name email");

    // optionally: send notification email to counsellor / student here (stub)
    // notifyCounsellorEmail(counsellor.email, populated);

    return res.status(201).json({ message: "Booking created", booking: populated });
  } catch (err) {
    console.error("createBooking error:", err);
    return res.status(500).json({ message: "Error creating booking", error: err.message });
  }
};

/**
 * List bookings for logged user (student sees own, counsellor sees their bookings, admin sees all)
 * Optional query: ?counsellorId=... or ?studentId=...
 */
export const listBookings = async (req, res) => {
  try {
    const user = req.user;
    const { counsellorId, studentId } = req.query;

    let filter = {};
    if (user.role === "student") filter.student = user._id;
    else if (user.role === "counsellor") filter.counsellor = user._id;
    // admin or others can pass query params
    if (counsellorId) filter.counsellor = counsellorId;
    if (studentId) filter.student = studentId;

    const bookings = await Booking.find(filter)
      .sort({ start: 1 })
      .populate("student", "name email institution")
      .populate("counsellor", "name email");

    return res.status(200).json({ bookings });
  } catch (err) {
    console.error("listBookings error:", err);
    return res.status(500).json({ message: "Error listing bookings", error: err.message });
  }
};

/**
 * Get single booking by id
 */
export const getBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate("student", "name email institution")
      .populate("counsellor", "name email");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    // permission check (student/counsellor/admin)
    const user = req.user;
    if (user.role === "student" && booking.student._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (user.role === "counsellor" && booking.counsellor._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    return res.status(200).json({ booking });
  } catch (err) {
    console.error("getBooking error:", err);
    return res.status(500).json({ message: "Error fetching booking", error: err.message });
  }
};

/**
 * Cancel booking:
 * - allowed: booking owner (student) or counsellor or admin
 */
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const user = req.user;
    const isOwner = booking.student.toString() === user._id.toString();
    const isCounsellor = booking.counsellor.toString() === user._id.toString();
    const isAdmin = user.role && user.role === "institution_admin" || user.role === "super_admin";

    if (!isOwner && !isCounsellor && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    booking.status = "cancelled";
    await booking.save();

    // optionally: send cancel notifications
    // notifyCancellation(...)

    return res.status(200).json({ message: "Booking cancelled", booking });
  } catch (err) {
    console.error("cancelBooking error:", err);
    return res.status(500).json({ message: "Error cancelling booking", error: err.message });
  }
};
