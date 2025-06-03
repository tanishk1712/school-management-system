import express from 'express';
import {
  createSalary,
  getSalaries,
  updateSalaryStatus,
  deleteSalary
} from '../controllers/salaryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getSalaries)
  .post(createSalary);

router.route('/:id')
  .put(updateSalaryStatus)
  .delete(deleteSalary);

export default router;