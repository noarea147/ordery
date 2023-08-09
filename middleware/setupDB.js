const mongoose = require("mongoose");
const CategoryModel = require("../src/category/category.model");
const config = require("../config/database");

config();

// async function createUsersWithBusinesses() {
//   try {
//     const usersData = [
//       {
//         firstName: "John",
//         lastName: "Doe",
//         profilePicture: "path/to/profile_picture1.jpg",
//         email: "john.doe@example.com",
//         password: "password1",
//         phone: "1234567890",
//         role: "user",
//         country: "TUN",
//       },
//       {
//         firstName: "Jane",
//         lastName: "Smith",
//         profilePicture: "path/to/profile_picture2.jpg",
//         email: "jane.smith@example.com",
//         password: "password2",
//         phone: "9876543210",
//         role: "business",
//         country: "DZA",
//       },
//       {
//         firstName: "Alice",
//         lastName: "Johnson",
//         profilePicture: "path/to/profile_picture3.jpg",
//         email: "alice.johnson@example.com",
//         password: "password3",
//         phone: "5555555555",
//         role: "user",
//         country: "MCO",
//       },
//       {
//         firstName: "Bob",
//         lastName: "Brown",
//         profilePicture: "path/to/profile_picture4.jpg",
//         email: "bob.brown@example.com",
//         password: "password4",
//         phone: "1111111111",
//         role: "admin",
//         country: "TUN",
//       },
//     ];

//     const businessesData = [
//       {
//         BusinessName: "Business 1",
//         description: "Business Description 1",
//         location: { lng: 0, lat: 0 }, // Replace with the actual coordinates
//         address: "Address 1",
//         email: "business1@example.com",
//         phone: "111222333", // Replace with the actual phone number
//         username: "business1", // Replace with the actual username
//         profilePicture: "path/to/business_profile_picture1.jpg", // Replace with the actual file path
//         country: "TUN",
//       },
//       // Add more businesses here...
//     ];

//     // Save each user to the database
//     for (let i = 0; i < usersData.length; i++) {
//       const userData = usersData[i];
//       const businessData = businessesData[i];

//       const newUser = new UserModel(userData);
//       await newUser.save();

//       const newBusiness = new BusinessModel(businessData);
//       newBusiness.user = newUser._id;
//       await newBusiness.save();

//       console.log("User with Business added:", newUser);
//     }

//     console.log("All users with businesses have been added!");
//   } catch (error) {
//     console.error("Error adding users with businesses:", error);
//   } finally {
//     mongoose.disconnect();
//   }
// }
// createUsersWithBusinesses();

async function AddCategories() {
  try {
    const newCategoriesData = [
      {
        name: "Cafe",
        description:
          "Dégustez une sélection de cafés riches et aromatiques, allant du traditionnel qahwa tunisien aux classiques à base d'espresso.",
      },
      {
        name: "The",
        description:
          "Laissez-vous séduire par une variété de thés de qualité supérieure, y compris le rafraîchissant et apprécié thé à la menthe tunisien.",
      },
      {
        name: "Chocolat",
        description:
          "Satisfaites votre gourmandise avec nos options luxueuses de chocolat chaud, des classiques veloutés aux variations uniques.",
      },
      {
        name: "Cocktail",
        description:
          "Découvrez une explosion de saveurs avec nos cocktails soigneusement élaborés, parfaits pour se détendre et socialiser.",
      },
      {
        name: "Jus",
        description:
          "Étanchez votre soif avec notre sélection de jus de fruits fraîchement pressés, gorgés de bienfaits naturels.",
      },
      {
        name: "Mojito",
        description:
          "Rehaussez votre expérience avec nos variations rafraîchissantes et revigorantes de mojito, idéales pour des rencontres animées.",
      },
      {
        name: "Crepe",
        description:
          "Délectez-vous de crêpes fines et délicieuses, sucrées et salées, mettant en valeur un délicieux mélange d'ingrédients.",
      },
      {
        name: "Gaufre",
        description:
          "Faites-vous plaisir avec nos gaufres alléchantes, parfaitement croustillantes à l'extérieur et moelleuses à l'intérieur.",
      },
      {
        name: "Boisson",
        description:
          "Explorez une gamme variée de boissons, des favoris traditionnels aux créations innovantes qui étanchent toutes les envies.",
      },
      {
        name: "Chicha",
        description:
          "Partez pour un voyage sensoriel avec nos options de chicha riches en saveurs et aromates, conçues pour une expérience détendue.",
      },
    ];

    // Save each user to the database
    for (let i = 0; i < newCategoriesData.length; i++) {
      const categoryData = newCategoriesData[i];

      const newCategory = new CategoryModel(categoryData);
      await newCategory.save();
    }

    console.log("All categories have been added!");
  } catch (error) {
    console.error("Error adding categories:", error);
  } finally {
    mongoose.disconnect();
  }
}

async function DropCategories() {
  try {
    await CategoryModel.deleteMany({});
    console.log("All categories have been deleted!");
  } catch (error) {
    console.error("Error deleting categories:", error);
  } finally {
    mongoose.disconnect();
  }
}

AddCategories();
// DropCategories();
