const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(authenticateUser);

router.post('/tickets', supportController.createTicket);
router.get('/tickets', supportController.getTickets);
router.get('/tickets/:id', supportController.getTicketById);
router.post('/tickets/:id/respond', supportController.respondTicket);

// Status updates restricted to Support Staff & Admin
router.put(
  '/tickets/:id',
  authorizeRoles('SUPPORT_STAFF', 'ADMIN'),
  supportController.updateTicket
);

module.exports = router;
