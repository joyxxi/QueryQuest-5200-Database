import axios from "axios";
export const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const axiosWithCredentials = axios.create({ withCredentials: true });

export const signin = async (credentials: {
  username: string;
  password: string;
}) => {
  try {
    const response = await axiosWithCredentials.post(
      `${REMOTE_SERVER}/api/login/`,
      credentials
    );
    return response.data; // Successful login
  } catch (error: any) {
    if (error.response) {
      // Backend responded with an error status
      throw new Error(
        error.response.data.message || "Login failed. Please try again."
      );
    } else if (error.request) {
      // No response from the server
      throw new Error("Server is not responding. Please try again later.");
    } else {
      // Other unexpected errors
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};

export const signup = async (user: any) => {
  const response = await axiosWithCredentials.post(
    `${REMOTE_SERVER}/api/signup/`,
    user
  );
  return response.data;
};

export const profile = async () => {
  const response = await axiosWithCredentials.get(
    `${REMOTE_SERVER}/api/users/profile/`
  );
  return response.data;
};

export const signout = async () => {
  const response = await axiosWithCredentials.post(
    `${REMOTE_SERVER}/api/logout/`
  );
  return response.data;
};

export const findUserById = async (user_id: number) => {
  const response = await axios.get(`${REMOTE_SERVER}/api/users/${user_id}/`);
  return response.data;
};

// export const findAllUsers = async () => {
//   const response = await axiosWithCredentials.get(USERS_API);
//   return response.data;
// };

export const updateUserProfile = async (user: any) => {
  const response = await axiosWithCredentials.patch(
    `${REMOTE_SERVER}/api/users/profile/update/`,
    user
  );
  return response.data;
};

export const deleteUser = async (userId: number) => {
  const response = await axios.delete(
    `${REMOTE_SERVER}/api/users/${userId}/delete/`
  );
  return response.data;
};

// get all problems

// get all progress for a user

// create submission for a user for a problem

// get total_points for a student

// create a feeback for a student for a problem
