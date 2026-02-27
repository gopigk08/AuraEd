const express = require('express');
const router = express.Router();
const {
    getCourses,
    getAllCoursesAdmin,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courseController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getCourses);
router.get('/all', protect, adminOnly, getAllCoursesAdmin);
router.get('/:id', getCourseById);
router.post('/', protect, adminOnly, createCourse);
router.put('/:id', protect, adminOnly, updateCourse);
router.delete('/:id', protect, adminOnly, deleteCourse);
router.put('/:id/progress', protect, require('../controllers/courseController').toggleLectureProgress);

module.exports = router;
