import axios from "axios";
export const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;

// Get total points for a student
export const getStudentPoints = async (studentId: number) => {
  const response = await axios.get(
    `${REMOTE_SERVER}/chatbot/query_points/${studentId}/`
  );
  return response.data;
};

// Get student's rank and how many students are ranked
export const getStudentRankingWithPosition = async (studentId: number) => {
  const response = await axios.get(
    `${REMOTE_SERVER}/chatbot/query_ranking_position/${studentId}/`
  );
  return response.data;
};

// Get list of questions the student answered incorrectly
export const getStudentWrongProblems = async (studentId: number) => {
  const response = await axios.get(
    `${REMOTE_SERVER}/chatbot/query_wrong_problems/${studentId}/`
  );
  return response.data;
};
