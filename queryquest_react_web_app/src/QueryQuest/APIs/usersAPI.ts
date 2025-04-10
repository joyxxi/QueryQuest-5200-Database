import axios from "axios";
export const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const axiosWithCredentials = axios.create({ withCredentials: true });
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
};

export const signin = async (credentials: {
  username: string;
  password: string;
}) => {
  try {
    // Get the CSRF token
    const csrfToken = getCookie("csrftoken");
    const response = await axiosWithCredentials.post(
      `${REMOTE_SERVER}/api/login/`,
      credentials,
      {
        headers: {
          "X-CSRFToken": csrfToken, // Include the CSRF token in the header
        },
      }
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
  // Get the CSRF token
  const csrfToken = getCookie("csrftoken");
  const response = await axiosWithCredentials.post(
    `${REMOTE_SERVER}/api/signup/`,
    user,
    {
      headers: {
        "X-CSRFToken": csrfToken, // Include the CSRF token in the headers
      },
    }
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
  const csrfToken = getCookie("csrftoken");
  const response = await axiosWithCredentials.post(
    `${REMOTE_SERVER}/api/logout/`,
    {
      headers: {
        "X-CSRFToken": csrfToken,
      },
    }
  );
  return response.data;
};

export const findUserById = async (user_id: number) => {
  const response = await axios.get(`${REMOTE_SERVER}/api/users/${user_id}/`);
  return response.data;
};

export const updateUserProfile = async (user: any) => {
  const csrfToken = getCookie("csrftoken");
  const response = await axiosWithCredentials.patch(
    `${REMOTE_SERVER}/api/users/profile/update/`,
    user,
    {
      headers: {
        "X-CSRFToken": csrfToken, // Include the CSRF token in the header
      },
    }
  );
  return response.data;
};

export const deleteUser = async (userId: number) => {
  const csrfToken = getCookie("csrftoken");
  const response = await axios.delete(
    `${REMOTE_SERVER}/api/users/${userId}/delete/`,
    {
      headers: {
        "X-CSRFToken": csrfToken,
      },
    }
  );
  return response.data;
};
