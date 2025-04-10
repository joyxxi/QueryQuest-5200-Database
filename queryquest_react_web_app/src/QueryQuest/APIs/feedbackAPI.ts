import axios from 'axios';
const BASE_URL = process.env.REACT_APP_REMOTE_SERVER;

export interface Feedback {
  feedback_id: number;
  submission_id: number;
  student_id: number;
  problem_id: number;
  f_content: string;
  created_at: string;
}

export interface ErrorMessage {
  message: string;
}

export const fetchFeedback = async (
  studentId: number,
  problemId: number
): Promise<Feedback | ErrorMessage> => {
  try {
    const response = await axios.post<Feedback>(
      `${BASE_URL}/feedback/${studentId}/${problemId}/`,
      {}
    );
    console.log('Feedback Response:', response.data);
    return response.data; // Assuming your backend returns { feedback_text: "Your feedback message" }
  } catch (error: any) {
    console.error('Error fetching feedback:', error);
    if (error.response && error.response.status === 404) {
      return { message: error.response.data.message };
    }
    throw error;
  }
};

export const refreshFeedback = async (
  studentId: number,
  problemId: number
): Promise<Feedback | ErrorMessage> => {
  try {
    const response = await axios.post<Feedback>(
      `${BASE_URL}/feedback/${studentId}/${problemId}/?refresh=true`,
      {}
    );
    console.log('Feedback Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching feedback:', error);
    if (error.response && error.response.status === 404) {
      return { message: error.response.data.message };
    }
    throw error;
  }
};
