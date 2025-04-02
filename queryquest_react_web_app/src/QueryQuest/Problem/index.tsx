import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import { mockDataProblems } from '../MockData/MockProblems';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchProblemsWithProgress, Problem } from './problemAPI';

const ProblemList = () => {
  const colors = tokens;
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    { field: 'module_title', headerName: 'Module', minWidth: 150, flex: 1 },
    {
      field: 'unit_id',
      headerName: 'Unit ID',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      flex: 0.4,
    },
    { field: 'unit_title', headerName: 'Unit', minWidth: 150, flex: 1 },
    // {
    //   field: 'problem_id',
    //   headerName: 'Problem ID',
    //   type: 'number',
    //   headerAlign: 'left',
    //   align: 'left',
    // },
    {
      field: 'description',
      headerName: 'Problem',
      minWidth: 450,
      flex: 1,
    },
    { field: 'difficulty', headerName: 'Difficulty' },
    { field: 'status', headerName: 'Status' }, // TODO: change according to progress later
  ];

  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const user_id = currentUser?.user_id;

  // TODO: add logic to check if it is student
  const student_id = user_id;
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    const loadProblems = async () => {
      const problemsData = await fetchProblemsWithProgress(student_id);
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
export default ProblemList;

// export default function Problem() {
//   return (
//     <div id="wd-problem-screen">
//       <h2>Problem</h2>
//       <button id="wd-add-problem">+ Problem</button>
//       <div>
//         <ol id="wd-problems">
//           <li className="wd-problem">
//             <div className="wd-title">Problem 1</div>
//           </li>
//           <li className="wd-problem">
//             <div className="wd-title">Problem 2</div>
//           </li>
//           <li className="wd-problem">
//             <div className="wd-title">Problem 3</div>
//           </li>
//         </ol>
//       </div>
//     </div>
//   );
// }
