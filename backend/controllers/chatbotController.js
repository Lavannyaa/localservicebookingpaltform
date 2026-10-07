const { processMessage } = require('../services/chatbotService');

/**
 * Handle incoming chatbot conversation message
 * POST /api/chatbot/message
 */
const handleMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(422).json({
        success: false,
        message: 'Message text is required.',
      });
    }

    const response = await processMessage({
      message,
      user: req.user || null,
    });

    res.status(200).json({
      success: true,
      data: {
        reply: response.reply,
        actions: response.actions || [],
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { handleMessage };
