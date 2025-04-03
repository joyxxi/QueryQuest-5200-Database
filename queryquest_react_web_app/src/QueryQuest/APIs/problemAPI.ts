import { Update } from '@reduxjs/toolkit';
import axios from 'axios';
const BASE_URL = 'http://127.0.0.1:8000';

export interface StudentProblem {
  problem_id: number;
  unit_id: number;
  unit_title: string;
  module_title: string;
  description: string;
  problem_type: string;
  difficulty: string;
  created_at: string;
  created_by: string | null;
  status: string | null;
}

export interface InstructorAdminProblem {
  problem_id: number;
  unit: number;
  unit_title: string;
  module_title: string;
  description: string;
  problem_type: string;
  difficulty: string;
  choice1: string;
  choice2: string;
  choice3: string | null;
  correct_answer: number;
  created_at: string;
  created_by: string | null;
}

export interface Unit {
  unit_id: number;
  module_title: string;
  unit_title: string;
}

export interface CreateProblemRequest {
  unit: number;
  description: string;
  problem_type: string;
  difficulty: string;
  choice1: string;
  choice2: string;
  choice3: string | null;
  correct_answer: number;
  created_by: number;
}

export interface UpdateProblemRequest {
  unit?: number;
  description?: string;
  problem_type?: string;
  difficulty?: string;
  choice1?: string;
  choice2?: string;
  choice3?: string | null;
  correct_answer?: number;
  created_by?: number;
}

// Fetch all problems with progress for a specific student
export const fetchProblemsWithProgress = async (
  studentId: number
): Promise<StudentProblem[]> => {
  try {
    const response = await axios.get<StudentProblem[]>(
      `${BASE_URL}/problems/all_with_progress/${studentId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching problems:', error);
    return [];
  }
};

// Fetch all problems for instructor or admin
export const fetchProblems = async (): Promise<InstructorAdminProblem[]> => {
  try {
    const response = await axios.get<InstructorAdminProblem[]>(
      `${BASE_URL}/problems`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching problems:', error);
    return [];
  }
};

export const fetchUnits = async (): Promise<Unit[]> => {
  try {
    const response = await axios.get<Unit[]>(`${BASE_URL}/problems/units`);
    console.log('Fetched Units: ', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching units:', error);
    return [];
  }
};

export const createProblem = async (
  problemData: CreateProblemRequest
): Promise<InstructorAdminProblem> => {
  try {
    const response = await axios.post(`${BASE_URL}/problems/`, problemData);
    console.log('Problem successfully created: ', response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Error creating problem:', error.response.data);
    } else {
      console.error('Error creating problem:', error.message);
    }
    throw error;
  }
};

export const updateProblem = async (
  problemData: UpdateProblemRequest,
  problem_id: number
): Promise<InstructorAdminProblem> => {
  try {
    const reponse = await axios.put(
      `${BASE_URL}/problems/${problem_id}/`,
      problemData
    );
    console.log('Problem successfully updated: ', reponse.data);
    return reponse.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Error updating problem:', error.response.data);
    } else {
      console.error('Error updating problem:', error.message);
    }
    throw error;
  }
};

export const deleteProblem = async () => {};
