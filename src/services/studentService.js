import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

// API methods
export const studentAPI = {
  // Get all students (admin only)
  getStudents: async (params = {}) => {
    const { page = 1, limit = 10, sort, order, search, ...filters } = params;
    const queryParams = new URLSearchParams();
    
    if (page) queryParams.append('page', page);
    if (limit) queryParams.append('limit', limit);
    if (sort) queryParams.append('sort', sort);
    if (order) queryParams.append('order', order);
    if (search) queryParams.append('search', search);
    
    // Add other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    const { data } = await api.get(`/students?${queryParams.toString()}`);
    return data;
  },
  
  // Get single student by ID (admin or the student themselves)
  getStudent: async (id) => {
    const { data } = await api.get(`/students/${id}`);
    return data;
  },
  
  // Get current student's profile
  getCurrentStudent: async () => {
    const { data } = await api.get('/students/me');
    return data;
  },
  
  // Create new student (admin only)
  createStudent: async (studentData) => {
    const { data } = await api.post('/students', studentData);
    return data;
  },
  
  // Update existing student (admin or the student themselves)
  updateStudent: async ({ id, ...studentData }) => {
    const { data } = await api.put(`/students/${id}`, studentData);
    return data;
  },
  
  // Delete student (admin only)
  deleteStudent: async (id) => {
    await api.delete(`/students/${id}`);
    return id;
  },
};

// React Query hooks
export const useStudents = (params = {}) => {
  return useQuery({
    queryKey: ['students', params],
    queryFn: () => studentAPI.getStudents(params),
    keepPreviousData: true,
  });
};

export const useStudent = (id) => {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => studentAPI.getStudent(id),
    enabled: !!id,
  });
};

export const useCurrentStudent = () => {
  return useQuery({
    queryKey: ['currentStudent'],
    queryFn: studentAPI.getCurrentStudent,
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: studentAPI.createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: studentAPI.updateStudent,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['currentStudent'] });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: studentAPI.deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};