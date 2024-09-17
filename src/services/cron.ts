
import cron from 'node-cron';
import User from '../models/User'; // Adjust the import based on your project structure

// Function to update age based on date_of_birth
// const updateAges = async () => {
//   const users = await User.findAll();

//   users.forEach(async user => {
//     const today = new Date();
//     const birthDate = new Date(user.date_of_birth);
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const monthDifference = today.getMonth() - birthDate.getMonth();
//     if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
//       age--;
//     }
//     // Update user's age if it's different
//     if (user.age !== age) {
//       await user.update({ age });
//     }
//   });
// };

// // Schedule the job to run daily at midnight
// cron.schedule('0 0 * * *', () => {
//   console.log('Updating ages...');
//   updateAges();
// });
