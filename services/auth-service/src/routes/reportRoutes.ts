import { Router } from 'express';
import { ReportController } from '../controllers/reportController';
import { authenticate } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for reports
const reportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 reports per hour
  message: 'Too many reports, please try again later',
});

// ============================================
// REPORT ROUTES
// ============================================

// Create report
router.post('/', authenticate, reportLimiter, ReportController.createReport);

// Get user's reports
router.get('/my-reports', authenticate, ReportController.getUserReports);

// Admin routes (require admin auth - implement later)
// For now, using regular auth
router.get('/pending', authenticate, ReportController.getPendingReports);
router.get('/stats', authenticate, ReportController.getReportStats);
router.get('/:reportId', authenticate, ReportController.getReportById);
router.post('/:reportId/review', authenticate, ReportController.reviewReport);

export default router;
