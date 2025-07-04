const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const protect = require('../middleware/appointmentMiddleware');

router.post('/',appointmentController.createappointment);

router.get('/appointment-info/:id',appointmentController.getAppointmentById);

router.get('/allAppointments', appointmentController.getAllAppointment);

router.get('/filter',appointmentController.filterAppointment);

router.put('/update/:id', protect, appointmentController.updateAppointment);

router.delete('/delete/:id', protect, appointmentController.deleteAppointment);

router.put('/status/:id', protect, appointmentController.updateAppointmentStatus);

router.put('/reschedule/:id', protect, appointmentController.rescheduleAppointment);

module.exports = router;
