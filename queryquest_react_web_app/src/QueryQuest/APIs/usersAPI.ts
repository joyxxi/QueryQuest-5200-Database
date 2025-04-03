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
  const response = await axiosWithCredentials.get(`${USERS_API}/profile`);
  return response.data;
};

export const signout = async () => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signout`);
  return response.data;
};

export const findUserById = async (id: string) => {
  const response = await axios.get(`${USERS_API}/${id}`);
  return response.data;
};

export const findAllUsers = async () => {
  const response = await axiosWithCredentials.get(USERS_API);
  return response.data;
};

// export const createUser = async (user: any) => {
//   const response = await axios.post(`${USERS_API}`, user);
//   return response.data;
// };

export const updateUser = async (user: any) => {
  const response = await axiosWithCredentials.put(
    `${USERS_API}/${user._id}`,
    user
  );
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await axios.delete(`${USERS_API}/${userId}`);
  return response.data;
};

// get all progress for a user

// create submission for a user for a problem

// get total_points for a student

// create a feeback for a student for a problem

// export const findCoursesForUser = async (userId: string) => {
//   const response = await axiosWithCredentials.get(
//     `${USERS_API}/${userId}/courses`
//   );
//   return response.data;
// };

// export const enrollIntoCourse = async (userId: string, courseId: string) => {
//   const response = await axiosWithCredentials.post(
//     `${USERS_API}/${userId}/courses/${courseId}`
//   );
//   return response.data;
// };
// export const unenrollFromCourse = async (userId: string, courseId: string) => {
//   const response = await axiosWithCredentials.delete(
//     `${USERS_API}/${userId}/courses/${courseId}`
//   );
//   return response.data;
// };

// export const findMyEnrollments = async () => {
//   const { data } = await axiosWithCredentials.get(
//     `${USERS_API}/current/enrollments`
//   );
//   return data;
// };

// export const createCourse = async (course: any) => {
//   const { data } = await axiosWithCredentials.post(
//     `${USERS_API}/current/courses`,
//     course
//   );
//   return data;
// };

// export const deleteEnrollment = async (userId: string, courseId: string) => {
//   await axiosWithCredentials.delete(
//     `${USERS_API}/${userId}/enrollments/${courseId}`
//   );
// };

// export const addEnrollment = async (userId: string, courseId: string) => {
//   await axiosWithCredentials.post(
//     `${USERS_API}/${userId}/enrollments/${courseId}`
//   );
// };
