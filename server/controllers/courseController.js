const Course = require('../models/Course');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({ published: true });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all courses (including unpublished) for admin
// @route   GET /api/courses/all
// @access  Private/Admin
const getAllCoursesAdmin = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public (or Private if paid)
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
    const { title, description, price, originalPrice, thumbnail, videoUrl, introVideos, sections, published } = req.body;

    try {
        const course = new Course({
            title,
            description,
            price,
            originalPrice,
            thumbnail,
            videoUrl,
            introVideos: introVideos || [],
            sections,
            creator: req.user.uid,
            published: published !== undefined ? published : false
        });

        const createdCourse = await course.save();
        res.status(201).json(createdCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
    console.log('HIT updateCourse controller for ID:', req.params.id);
    const { title, description, price, originalPrice, thumbnail, videoUrl, introVideos, published, sections } = req.body;

    try {
        const updateData = {
            title,
            description,
            price,
            thumbnail,
            videoUrl,
            introVideos: introVideos || [],
            sections,
            published
        };

        if (originalPrice !== undefined) {
            updateData.originalPrice = originalPrice;
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (updatedCourse) {
            console.log('Updated Course Successfully:', updatedCourse._id);
            res.json(updatedCourse);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        console.error('Update Course Error:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course) {
            await course.deleteOne();
            res.json({ message: 'Course removed' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const toggleLectureProgress = async (req, res) => {
    try {
        const courseId = req.params.id;
        const { lectureId } = req.body;
        const userId = req.user.uid;

        const user = await require('../models/User').findOne({ uid: userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find progress entry for this course
        let progressIndex = user.courseProgress.findIndex(p => p.courseId.toString() === courseId);

        if (progressIndex === -1) {
            // Create new progress entry
            user.courseProgress.push({
                courseId: courseId,
                completedLectures: [lectureId]
            });
        } else {
            // Toggle lecture
            const completedLectures = user.courseProgress[progressIndex].completedLectures;
            const lectureIndex = completedLectures.indexOf(lectureId);

            if (lectureIndex > -1) {
                // Remove (mark as incomplete)
                completedLectures.splice(lectureIndex, 1);
            } else {
                // Add (mark as complete)
                completedLectures.push(lectureId);
            }
        }

        await user.save();
        res.json(user.courseProgress.find(p => p.courseId.toString() === courseId));

    } catch (error) {
        console.error("Progress Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    getCourses,
    getAllCoursesAdmin,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    toggleLectureProgress
};
