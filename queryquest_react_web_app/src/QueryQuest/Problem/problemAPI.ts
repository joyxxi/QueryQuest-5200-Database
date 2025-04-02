import axios from 'axios';
const BASE_URL = 'http://127.0.0.1:8000';

export interface Problem {
  problem_id: number;
  unit_id: number;
  unit_title: string;
  module_title: string;
  description: string;
  problem_type: string;
  difficulty: string;
  created_at: string;
  created_by: string | null;
  status: string;
}

// Fetch all problems with progress for a specific student
export const fetchProblemsWithProgress = async (
  studentId: number
): Promise<Problem[]> => {
  try {
    const response = await axios.get<Problem[]>(
      `${BASE_URL}/problems/all_with_progress/${studentId}`
    );
    console.log('Reponse Data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching problems:', error);
    return [];
  }
};
