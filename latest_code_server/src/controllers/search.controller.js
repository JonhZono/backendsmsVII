const { UserSchema } = require('../models/user/User.schema');

// exports.userSearchFilter = async (req, res) => {
//   const { level, createdAt, classroom } = req.body;
//   //filter by school name
//   //filter by levels
//   if (level) {
//     console.log('Search Level --> ', level);
//     return await handleLevel(req, res, level);
//   }
//   //filter by date
// };

exports.userSearchFilters = async (req, res) => {
  const { level, createdAt, classroom } = req.body;

  if (level) {
    console.log('query --->', level);
    await handleLevel(req, res, level);
  }
};
// const handleLevel = async (req, res, level) => {
//   try {
//     const users = await UserSchema.find({ level })
//       .populate({
//         path: 'createdBy',
//         select: { name: 1 },
//         s,
//       })
//       .populate({
//         path: 'level',
//         select: { name: 1 },
//       })
//       .sort({ createdAt: -1 })
//       .exec();

//     res.json(users);
//   } catch (error) {
//     console.log(error.message);
//   }
//};
