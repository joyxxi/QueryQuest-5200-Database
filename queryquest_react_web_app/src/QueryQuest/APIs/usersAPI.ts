import axios from "axios";
export const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
export const USERS_API = `${REMOTE_SERVER}/api/users`;
const axiosWithCredentials = axios.create({ withCredentials: true });

export const signin = async (credentials: {
  username: string;
  password: string;
}) => {
  const response = await axiosWithCredentials.post(
    `${REMOTE_SERVER}/api/login/`,
    credentials
  );
  return response.data;
};

export const signup = async (user: any) => {
  const response = await axiosWithCredentials.post(
    `${REMOTE_SERVER}/api/signup`,
    user
  );
  return response.data;
};

export const profile = async () => {
  const response = await axiosWithCredentials.get(`${REMOTE_SERVER}/profile`);
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

// export const createUser = async (user: any) => {
//   const response = await axios.post(`${USERS_API}`, user);
//   return response.data;
// };

export const updateUser = async (user: any) => {
  const response = await axiosWithCredentials.put(
    `${REMOTE_SERVER}/${user.user_id}`,
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

// get all progress for a user

// create submission for a user for a problem

// get total_points for a student

// create a feeback for a student for a problem
