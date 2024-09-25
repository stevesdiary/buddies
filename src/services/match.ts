import { Op } from 'sequelize';
import User from '../models/User';

export const findBestMatches = async (
  user_id: string, 
  page: number = 1, 
  limit: number = 10,
	basic_limit: number = 1,
) => {
  try {
    const currentUser = await User.findByPk(user_id);
    if (!currentUser) {
      throw new Error('User not found');
    }

    const currentUserQualities = currentUser.qualities || [];
    const currentUserInterests = currentUser.hobbies_and_interests || [];
    const currentUserGender = currentUser.gender;
    const currentUserAge = currentUser.age;

    const otherUsers = await User.findAll({
      where: {
        user_id: { [Op.not]: user_id },
        gender: currentUserGender === 'male' ? 'female' : 'male',  // Only match opposite gender
      },
      limit: limit,
      offset: (page - 1) * limit,
    });

    const matches = otherUsers.map((user) => {
			const otherUserQualities = user.qualities || [];
			const otherUserInterests = user.hobbies_and_interests || [];
			const otherUserAge = user.age;
		
        // Apply age filter
        let ageDifferenceValid = false;
				if (currentUserGender === 'male') {
					// Male should not be more than 5 years older, and female should not be more than 3 years older
					ageDifferenceValid =
						(otherUserAge <= currentUserAge && currentUserAge - otherUserAge <= 5) ||  // Male not more than 5 years older
						(otherUserAge > currentUserAge && otherUserAge - currentUserAge <= 3);    // Female not more than 3 years older
				} else if (currentUserGender === 'female') {
					// Female should not be more than 3 years older, and male should not be more than 5 years older
					ageDifferenceValid =
						(currentUserAge <= otherUserAge && otherUserAge - currentUserAge <= 5) ||  // Male not more than 5 years older
						(currentUserAge > otherUserAge && currentUserAge - otherUserAge <= 3);    // Female not more than 3 years older
				}


        // Skip if age difference doesn't meet the criteria
        // if (!ageDifferenceValid) {
					// console.log("Age difference is invalid for user: ", user.username)
          // return null;
        // }
        const commonQualities = currentUserQualities.map(q => q.toLowerCase()).filter((q) => 
					otherUserQualities.map(oq => oq.toLowerCase()).includes(q));

				const commonInterests = currentUserInterests.map(i => i.toLowerCase())
					.filter((i) => otherUserInterests.map(oi => oi.toLowerCase()).includes(i));

        // Calculate the match score based on the number of common qualities and interests
        const qualityScore = commonQualities.length;
        const interestScore = commonInterests.length;
				
        const totalScore = qualityScore + interestScore;
        return {
          user: {
            user_id: user.user_id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            age: user.age,
            gender: user.gender,
            qualities: otherUserQualities,
            interests: otherUserInterests,
          },
          matchScore: totalScore,
          // commonQualities,
          // commonInterests,
        };
      })
      .filter(match => match !== null); 

    // Sort matches by matchScore in descending order
    const sortedMatches = matches.sort((a, b) => b!.matchScore - a!.matchScore);

    const totalUsers = await User.count({ where: { user_id: { [Op.not]: user_id } } });
    const totalPages = Math.ceil(totalUsers / limit);
		if (currentUser.role === 'basic' || currentUser.subscribed === true) {
			return {
				currentUser: {
					user_id: currentUser.user_id,
					username: currentUser.username,
					first_name: currentUser.first_name,
					last_name: currentUser.last_name,
					age: currentUser.age,
					gender: currentUser.gender,
					qualities: currentUserQualities,
					interests: currentUserInterests,
				},
				match: sortedMatches.slice(0, basic_limit),
				totalItems: totalUsers,
				totalPages: totalPages,
				currentPage: page,
				pageSize: limit,
			}
		}
    return {
      currentUser: {
        user_id: currentUser.user_id,
        username: currentUser.username,
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
        age: currentUser.age,
        gender: currentUser.gender,
        qualities: currentUserQualities,
        interests: currentUserInterests,
      },
      matches: sortedMatches,
      totalItems: totalUsers,
      totalPages: totalPages,
      currentPage: page,
      pageSize: limit,
    };
  } catch (error) {
    console.error('Error finding matches:', error);
    throw error;
  }
};



// import { Op } from 'sequelize';
// import User from '../models/User';
// import Quality from '../models/Quality';
// import Interest from '../models/Interest';

// export const findBestMatches = async (
//   userId: string, 
//   page: number = 1, 
//   limit: number = 5
// ) => {
//   try {
//     // Fetch the current user with their qualities and interests
//     const currentUser = await User.findByPk(userId, {
//       include: [
//         { model: Quality, as: 'quality' },
//         { model: Interest, as: 'interest' },
//       ]
//     });

//     if (!currentUser) {
//       throw new Error('User not found');
//     }

//     const currentUserQualities = currentUser.qualities.map((q) => q);
//     const currentUserInterests = currentUser.interests.map((i) => i);
//     const currentUserGender = currentUser.gender;
//     const currentUserAge = currentUser.age;

//     // Fetch total number of users (excluding the current user)
//     const totalUsers = await User.count({ where: { user_id: { [Op.ne]: userId } } });

//     // Fetch other users (excluding the current user) with their qualities and interests
//     const otherUsers = await User.findAll({
//       where: {
//         user_id: { [Op.ne]: userId },
//         // Filter by opposite gender
//         gender: currentUserGender === 'male' ? 'female' : 'male',
//       },
//       include: [
//         { model: Quality, as: 'quality' },
//         { model: Interest, as: 'interest' },
//       ],
//       limit: limit,
//       offset: (page - 1) * limit,  // Calculate the offset
//     });

//     // Calculate match score for each user
//     const matches = otherUsers
//       .map((user) => {
//         const otherUserQualities = user.qualities?.map((q) => q);
//         const otherUserInterests = user.interests?.map((i) => i);
//         const otherUserAge = user.age;
//         const otherUserGender = user.gender;

//         // Gender filter is already applied in the query

//         // Apply age filter
//         let ageDifferenceValid = false;
//         if (currentUserGender === 'male') {
//           // Male to Female: Male should not be more than 5 years older, Female not more than 3 years older
//           ageDifferenceValid =
//             (currentUserAge >= otherUserAge && currentUserAge - otherUserAge <= 5) ||
//             (otherUserAge > currentUserAge && otherUserAge - currentUserAge <= 3);
//         } else if (currentUserGender === 'female') {
//           // Female to Male: Male should not be more than 5 years older, Female not more than 3 years older
//           ageDifferenceValid =
//             (otherUserAge >= currentUserAge && otherUserAge - currentUserAge <= 5) ||
//             (currentUserAge > otherUserAge && currentUserAge - otherUserAge <= 3);
//         }

//         // Skip if age difference doesn't meet the criteria
//         if (!ageDifferenceValid) {
//           return null;  // Skip this match
//         }

//         // Calculate intersection for qualities and interests
//         const commonQualities = currentUserQualities.filter((q) => otherUserQualities.includes(q));
//         const commonInterests = currentUserInterests.filter((i) => otherUserInterests.includes(i));

//         // Define score as the number of common qualities and interests
//         const qualityScore = commonQualities.length;
//         const interestScore = commonInterests.length;

//         const totalScore = qualityScore + interestScore;

//         return {
//           user,
//           matchScore: totalScore,
//         };
//       })
//       .filter(match => match !== null);  // Remove null matches (invalid age difference)

//     // Sort matches by matchScore in descending order
//     const sortedMatches = matches.sort((a, b) => b!.matchScore - a!.matchScore);

//     // Calculate total pages
//     const totalPages = Math.ceil(totalUsers / limit);

//     return {
//       matches: sortedMatches,
//       totalItems: totalUsers,
//       totalPages: totalPages,
//       currentPage: page,
//       pageSize: limit,
//     };
//   } catch (error) {
//     console.error('Error finding matches:', error);
//     throw error;
//   }
// };
