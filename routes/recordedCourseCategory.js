// /**
//  * @DESC User can get all recorded course by category paginated
//  * @ROUTE GET /recordedCourseCategory/:id/getRecordedCourses
//  * @visibility public
// */

// router.get(
//     "/:id/getRecordedCourses",
//     validation(RecordedCourseCategoryValidator.getRecordedCoursesByCategory),
//     async (req, res, next) => {
//         const limit = 6;
//         const page = req.query.page ? req.query.page : 1;
//         const { id } = req.params;
//         const recordedCourses = recordedCourseCategory.getRecordedCoursesByCategory(id, page, limit);
//         const [error, data] = await asycnWrapper(recordedCourses);
//         if (error) {
//             return next(error);
//         }
//         res.status(200).json(data);
//     }
// )