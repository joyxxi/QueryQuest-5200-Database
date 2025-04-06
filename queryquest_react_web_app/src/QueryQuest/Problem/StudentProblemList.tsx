import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchProblemsWithProgress, StudentProblem } from '../APIs/problemAPI';
import { Box, Typography } from '@mui/material';

const StudentProblemList = (student_id: any) => {
  const colors = tokens;
  const navigate = useNavigate();
  const columns: GridColDef[] = [
    { field: 'module_title', headerName: 'Module', minWidth: 150, flex: 0.8 },
    {
      field: 'unit_id',
      headerName: 'Unit ID',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      flex: 0.4,
    },
    { field: 'unit_title', headerName: 'Unit', minWidth: 150, flex: 1 },
    {
      field: 'problem_id',
      headerName: 'Problem ID',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      flex: 0.4,
    },
    {
      field: 'description',
      headerName: 'Problem',
      minWidth: 450,
      flex: 1,
    },
    { field: 'difficulty', headerName: 'Difficulty' },
    { field: 'status', headerName: 'Status' }, // TODO: change according to progress later
  ];

  const [problems, setProblems] = useState<StudentProblem[]>([]);

  useEffect(() => {
    const loadProblems = async () => {
      const problemsData = await fetchProblemsWithProgress(
        student_id.student_id
      );
      setProblems(problemsData);
    };

    loadProblems();
  }, [student_id]);

  return (
    <Box sx={{ width: '100%', overflow: 'auto' }}>
      {/* Header */}
      <Box mb="30px">
        <Typography
          variant="h3"
          color={colors.grey[100]}
          fontWeight="bold"
          sx={{ m: '0 0 5px 0' }}
        >
          {'Problems'}
        </Typography>
      </Box>
      {/* Probrom List */}
      <Box
        m="20px 0 0 0"
        height="75vh"
        sx={{
          width: '100%',
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            borderBottom: 'none',
          },
          cursor: 'pointer',
        }}
      >
        <DataGrid
          rows={problems}
          columns={columns}
          getRowId={(row) => row.problem_id}
          pageSizeOptions={[8, 16, 32]}
          onRowClick={(params) => navigate(`/QueryQuest/Problem/${params.id}`)}
        />
      </Box>
    </Box>
  );
};

export default StudentProblemList;
