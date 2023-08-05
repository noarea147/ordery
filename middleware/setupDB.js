const mongoose = require("mongoose");
const UserModel = require("../src/user/user.model");
const config = require("../config/database");

config();

async function createUsersWithBusinesses() {
  try {
    const usersData = [
      {
        firstName: "John",
        lastName: "Doe",
        profilePicture: "path/to/profile_picture1.jpg",
        email: "john.doe@example.com",
        password: "password1",
        phone: "1234567890",
        role: "user",
        country: "TUN",
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        profilePicture: "path/to/profile_picture2.jpg",
        email: "jane.smith@example.com",
        password: "password2",
        phone: "9876543210",
        role: "business",
        country: "DZA",
      },
      {
        firstName: "Alice",
        lastName: "Johnson",
        profilePicture: "path/to/profile_picture3.jpg",
        email: "alice.johnson@example.com",
        password: "password3",
        phone: "5555555555",
        role: "user",
        country: "MCO",
      },
      {
        firstName: "Bob",
        lastName: "Brown",
        profilePicture: "path/to/profile_picture4.jpg",
        email: "bob.brown@example.com",
        password: "password4",
        phone: "1111111111",
        role: "admin",
        country: "TUN",
      },
    ];

    const businessesData = [
      {
        BusinessName: "Business 1",
        description: "Business Description 1",
        location: { lng: 0, lat: 0 }, // Replace with the actual coordinates
        address: "Address 1",
        email: "business1@example.com",
        phone: "111222333", // Replace with the actual phone number
        username: "business1", // Replace with the actual username
        profilePicture: "path/to/business_profile_picture1.jpg", // Replace with the actual file path
        country: "TUN",
      },
      // Add more businesses here...
    ];

    // Save each user to the database
    for (let i = 0; i < usersData.length; i++) {
      const userData = usersData[i];
      const businessData = businessesData[i];

      const newUser = new UserModel(userData);
      await newUser.save();

      const newBusiness = new BusinessModel(businessData);
      newBusiness.user = newUser._id;
      await newBusiness.save();

      console.log("User with Business added:", newUser);
    }

    console.log("All users with businesses have been added!");
  } catch (error) {
    console.error("Error adding users with businesses:", error);
  } finally {
    mongoose.disconnect();
  }
}

createUsersWithBusinesses();

createUsers();
