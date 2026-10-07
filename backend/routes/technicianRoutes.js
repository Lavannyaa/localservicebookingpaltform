const express = require('express');
const router = express.Router();
const technicianController = require('../controllers/technicianController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Technician & Admin authorization
router.use(authenticateUser);
router.use(authorizeRoles('TECHNICIAN', 'ADMIN'));

router.get('/profile', technicianController.getTechnicianProfile);
router.get('/jobs', technicianController.getTechnicianJobs);
router.get('/jobs/:id', technicianController.getJobById);
router.put('/jobs/:id/accept', technicianController.acceptJob);
router.put('/jobs/:id/status', technicianController.updateJobStatus);
router.put('/jobs/:id/checklist', technicianController.updateChecklist);
router.put('/jobs/:id/notes', technicianController.updateNotes);
router.put('/jobs/:id/complete', technicianController.completeJob);

module.exports = router;
