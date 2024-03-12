import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/userModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "chai aur code",
  });

  const { fullName, email } = req.body;
  console.log(email);
  console.log(fullName);

  if (
    [
      [fullName, email, username, password].some(
        (field) => field?.trim() === ""
      ),
    ]
  ) {
    throw new ApiError(400, "all fields are required");
  }

  const exitedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (exitedUser) {
    throw new ApiError(409, "user with email or username already exits");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const converImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar files is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const converImaage = await uploadOnCloudinary(converImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar files is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: converImaage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createUser, "User registered Successfully"));
});

export { registerUser };

/**
 * get user details from frontend
 * validation - not empty
 * check if user already exists:username , email
 * check for image , check for avatar
 * upload them to cloundinary , avatar
 * create user object - create entyr in db
 * remove password and refresh token field from response
 * check for user creation
 */
