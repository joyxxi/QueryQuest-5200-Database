import { Box, Typography, useTheme } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import { mockDataProblems } from '../../MockData/MockProblems';
import { useNavigate } from 'react-router-dom';

const Problem = () => {
  // const theme = useTheme();
  const colors = tokens;
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    { field: 'module', headerName: 'Module', minWidth: 150, flex: 1 },
    { field: 'unit', headerName: 'Unit', minWidth: 100, flex: 0.5 },
    // {
    //   field: 'problem_id',
    //   headerName: 'Problem ID',
    //   type: 'number',
    //   headerAlign: 'left',
    //   align: 'left',
    // },
    {
      field: 'problem_discription',
      headerName: 'Problem',
      minWidth: 500,
      flex: 1,
    },
    { field: 'difficulty', headerName: 'Difficulty' },
    { field: 'status', headerName: 'Status' }, // TODO: change according to progress later
  ];

  return (
    <Box sx={{ width: '100%', overflow: 'auto' }}>
      {/* Header */}
      <Box mb="30px">
        <Typography
          variant="h2"
          color={colors.grey[100]}
          fontWeight="bold"
          sx={{ m: '0 0 5px 0' }}
        >
          {'Problems'}
        </Typography>
        <Typography variant="h5" color={colors.greenAccent[400]}>
          {'List of SQL problems'}
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
          rows={mockDataProblems}
          columns={columns}
          getRowId={(row) => row.problem_id}
          pageSizeOptions={[8, 16, 32]}
          onRowClick={(params) => navigate(`/QueryQuest/Problem/${params.id}`)}
        />
      </Box>
    </Box>
  );
};
export default Problem;

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
