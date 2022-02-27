
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../../models/userModel');
const ListingModel = require('../../models/listingModel');
const BookingModel = require('../../models/bookingModel');

function validEmailAddress(email) {
  const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  if (!email)
    return false;

  var valid = emailRegex.test(email);
  if (!valid)
    return false;
  var parts = email.split("@");
  if (parts[0].length > 64)
    return false;
  var domainParts = parts[1].split(".");
  if (domainParts.some(function (part) { return part.length > 63; }))
    return false;

  return true;
}

function isPasswordValid(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{6,30}$/;
  var valid = passwordRegex.test(password);
  if (!valid) {
    return false;
  }
  return true;
}

module.exports = {
  registerNewUser: async args => {
    console.log('args ' + JSON.stringify(args))
    try {
      if (!validEmailAddress(args.userInputData.email)) {
        throw new Error('Please enter valid email address.');
      }

      const existingUser = await UserModel.findOne({ username: args.userInputData.username });
      if (existingUser) {
        throw new Error('User name not available.');
      }

      if (!isPasswordValid(args.userInputData.password)) {
        throw new Error('Please enter your password with combination of lower capital special character and number:');
      }
      const user = new UserModel({
        username: args.userInputData.username,
        firstname: args.userInputData.firstname,
        lastname: args.userInputData.lastname,
        email: args.userInputData.email,
        password: args.userInputData.password,
        type: args.userInputData.type
      });

      const data = await user.save();

      return { ...data._doc };
    } catch (err) {
      throw err;
    }
  },


  login: async ({ username, password }) => {
    const user = await UserModel.findOne({ username: username });
    if (!user) {
      throw new Error('Account with this user name not found...');
    }
    if (password != user.password) {
      throw new Error('Invalid password...');
    }
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.type },
      'mysecuretoken',
      {
        expiresIn: '6h'
      }
    );
    return { userId: user._id, token: token, tokenExpiration: 6 };
  },

  addNewList: async (args, req) => {
    if (!req.Auth) {
      throw new Error('Please login for add new list...');
    }
    try {
      if (!validEmailAddress(args.listingInputData.email)) {
        throw new Error('Email not valid...');
      }
      const listing = new ListingModel({
        listing_id: args.listingInputData.listing_id,
        listing_title: args.listingInputData.listing_title,
        description: args.listingInputData.description,
        street: args.listingInputData.street,
        city: args.listingInputData.city,
        postal_code: args.listingInputData.postal_code,
        price: args.listingInputData.price,
        email: args.listingInputData.email,
        username: args.listingInputData.username,
        createdBy: req.loginUser,
        userType: req.role
      });

      const data = await listing.save();

      return { ...data._doc };
    } catch (err) {
      throw err;
    }
  },

  getAllAdminListing: async (args, req) => {
    try {
      const listing = await ListingModel.find({ userType: 'admin' });
      return listing.map(data => {
        return {
          ...data._doc,
        };
      });
    } catch (err) {
      throw err;
    }
  },

  getAdminListing: async (args, req) => {
    try {
      const listing = await ListingModel.find({ createdBy: req.loginUser });
      return listing.map(data => {
        return {
          ...data._doc,
        };
      });
    } catch (err) {
      throw err;
    }
  },


  getListingByTitleName: async (args, req) => {
    try {
      const listing = await ListingModel.find({ listing_title: args.title });
      return listing.map(data => {
        return {
          ...data._doc,
        };
      });
    } catch (err) {
      throw err;
    }
  },


  getListingByCityName: async (args, req) => {
    try {
      const listing = await ListingModel.find({ city: args.city });
      return listing.map(data => {
        return {
          ...data._doc,
        };
      });
    } catch (err) {
      throw err;
    }
  },


  addNewBooking: async (args, req) => {
    if (!req.Auth) {
      throw new Error('Please login...');
    }
    try {
      const booking = new BookingModel({
        listing_id: args.bookingInputData.listing_id,
        booking_id: args.bookingInputData.booking_id,
        booking_date: args.bookingInputData.booking_date,
        booking_start: args.bookingInputData.booking_start,
        booking_end: args.bookingInputData.booking_end,
        username: args.bookingInputData.username,
        createdBy: req.loginUser,
      });

      const result = await booking.save();

      return { ...result._doc };
    } catch (err) {
      throw err;
    }
  },


  getAllBookingsByUser: async (args, req) => {
    if (!req.Auth) {
      throw new Error('Please login...!');
    }
    try {
      const booking = await BookingModel.find({ createdBy: req.loginUser });
      return booking.map(data => {
        return {
          ...data._doc,
        };
      });
    } catch (err) {
      throw err;
    }
  },


};
