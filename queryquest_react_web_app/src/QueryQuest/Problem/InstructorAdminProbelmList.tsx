import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  fetchProblems,
  InstructorAdminProblem,
  fetchUnits,
  Unit,
  createProblem,
  CreateProblemRequest,
  UpdateProblemRequest,
  updateProblem,
} from '../APIs/problemAPI';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';

const InstructorAdminProblemList = () => {
  const colors = tokens;
  const navigate = useNavigate();

  const [problems, setProblems] = useState<InstructorAdminProblem[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState<number | null>(
    null
  );
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const user_id = currentUser?.user_id;
  // Form state
  const [formData, setFormData] = useState({
    unit: '',
    description: '',
    problem_type: '',
    difficulty: '',
    choice1: '',
    choice2: '',
    choice3: '',
    correct_answer: '',
    created_by: user_id,
  });

  // Form validation
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const columns: GridColDef[] = [
    { field: 'module_title', headerName: 'Module', minWidth: 150, flex: 0.8 },
    {
      field: 'unit',
      headerName: 'Unit ID',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      flex: 0.3,
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
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEditClick(params.id)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteClick(params.id)}
        />,
      ],
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchProblems().then((problemsData) => setProblems(problemsData)),
          fetchUnits().then((unitsData) => setUnits(unitsData)),
        ]);
      } catch (error) {
        console.error('Error loading problems:', error);
        // TODO: Might add some error handling UI here
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleOpenDialog = () => {
    // Reset form data for new problem
    setFormData({
      unit: '',
      description: '',
      problem_type: '',
      difficulty: '',
      choice1: '',
      choice2: '',
      choice3: '',
      correct_answer: '',
      created_by: user_id,
    });
    setFormErrors({});
    setSelectedProblemId(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEditClick = (id: any) => {
    // Stub for edit functionality
    console.log('Edit clicked for ID:', id);
    const problem = problems.find((p) => p.problem_id === id);
    if (problem) {
      setFormData({
        unit: problem.unit.toString(),
        description: problem.description,
        problem_type: problem.problem_type,
        difficulty: problem.difficulty,
        choice1: problem.choice1,
        choice2: problem.choice2,
        choice3: problem.choice3 || '',
        correct_answer: problem.correct_answer.toString(),
        created_by: user_id,
      });
      setSelectedProblemId(Number(id));
      setOpenDialog(true);
    } else {
      console.error('Problem not found with ID:', id);
    }
  };

  const handleDeleteClick = (id: any) => {
    // Stub for delete functionality
    console.log('Delete clicked for ID:', id);
    setSelectedProblemId(Number(id));
    setDeleteConfirmDialog(true);
    // TODO: add deletion logic
  };

  const handleDeleteConfirm = () => {
    // Stub for delete confirmation
    console.log('Confirm delete for ID:', selectedProblemId);
    setDeleteConfirmDialog(false);
    // TODO: add deletion logic
  };

  // Fixed type for text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Separate handler for Select components with correct type
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.unit) errors.unit = 'Unit is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.problem_type)
      errors.problem_type = 'Problem type is required';
    if (!formData.difficulty) errors.difficulty = 'Difficulty is required';
    if (!formData.choice1) errors.choice1 = 'Choice 1 is required';
    if (!formData.choice2) errors.choice2 = 'Choice 2 is required';
    if (!formData.correct_answer)
      errors.correct_answer = 'Correct answer is required';
    if (
      formData.problem_type === 'True-False' &&
      formData.correct_answer === '3'
    ) {
      errors.correct_answer =
        'Correct answer can not be Choice 3 for problem type True-False';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      if (selectedProblemId) {
        // TODO: logic for editing problem
        const originalProblem = problems.find(
          (p) => p.problem_id === selectedProblemId
        );

        if (!originalProblem) {
          console.error('Original problem not found');
          return;
        }
        const changedFields: Partial<UpdateProblemRequest> = {};
        if (Number(formData.unit) !== originalProblem.unit)
          changedFields.unit = Number(formData.unit);

        if (formData.description !== originalProblem.description)
          changedFields.description = formData.description;

        if (formData.problem_type !== originalProblem.problem_type)
          changedFields.problem_type = formData.problem_type;

        if (formData.difficulty !== originalProblem.difficulty)
          changedFields.difficulty = formData.difficulty;

        if (formData.choice1 !== originalProblem.choice1)
          changedFields.choice1 = formData.choice1;

        if (formData.choice2 !== originalProblem.choice2)
          changedFields.choice2 = formData.choice2;

        const currentChoice3 = formData.choice3 || null;
        if (currentChoice3 !== originalProblem.choice3)
          changedFields.choice3 = currentChoice3;

        if (Number(formData.correct_answer) !== originalProblem.correct_answer)
          changedFields.correct_answer = Number(formData.correct_answer);

        if (Object.keys(changedFields).length > 0) {
          console.log(
            'Updated Problem Data (changed fields only):',
            changedFields
          );
          const response = await updateProblem(
            changedFields,
            selectedProblemId
          );
          console.log('Problem updated successfully');

          setProblems((prevProblems) =>
            prevProblems
              .map((problem) =>
                problem.problem_id === selectedProblemId ? response : problem
              )
              .sort((a, b) => a.unit - b.unit)
          );
          console.log('Problem updated successfully');
        } else {
          console.log('No changes detected, skipping udpate');
        }
      } else {
        const problemData: CreateProblemRequest = {
          unit: Number(formData.unit),
          description: formData.description,
          problem_type: formData.problem_type,
          difficulty: formData.difficulty,
          choice1: formData.choice1,
          choice2: formData.choice2,
          choice3: formData.choice3 || null,
          correct_answer: Number(formData.correct_answer),
          created_by: user_id,
        };
        console.log('Problem Data: ', problemData);
        const response = await createProblem(problemData);
        console.log('Problem created successfully');

        const newProblem: InstructorAdminProblem = response;
        setProblems([...problems, newProblem].sort((a, b) => a.unit - b.unit));
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving problem:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', overflow: 'auto' }}>
      {/* Header */}
      <Box
        mb="30px"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          variant="h3"
          color={colors.grey[100]}
          fontWeight="bold"
          sx={{ m: '0 0 5px 0' }}
        >
          {'Problems Management'}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Problem
        </Button>
      </Box>

      {/* Problem List */}
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
        }}
      >
        <DataGrid
          rows={problems}
          columns={columns}
          getRowId={(row) => row.problem_id}
          pageSizeOptions={[8, 16, 32]}
          onRowClick={(params, event) => {
            // Prevent row click when clicking on action buttons
            if ((event.target as HTMLElement).closest('.MuiButtonBase-root')) {
              return;
            }
            // navigate(`/QueryQuest/Problem/${params.id}`);
          }}
        />
      </Box>

      {/* Add/Edit Problem Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedProblemId ? 'Edit Problem' : 'Add New Problem'}
        </DialogTitle>
        <DialogContent>
          <Box
            display="grid"
            gap="20px"
            gridTemplateColumns="repeat(12, 1fr)"
            sx={{ mt: 2 }}
          >
            <FormControl
              error={!!formErrors.unit}
              sx={{ gridColumn: 'span 4' }}
            >
              <InputLabel>Unit</InputLabel>
              <Select
                name="unit"
                value={formData.unit}
                label="Unit"
                onChange={handleSelectChange}
                disabled={isLoading}
              >
                {units.map((unit) => (
                  <MenuItem key={unit.unit_id} value={unit.unit_id.toString()}>
                    {unit.unit_id} - {unit.unit_title} - {unit.module_title}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.unit && (
                <FormHelperText>{formErrors.unit}</FormHelperText>
              )}
            </FormControl>

            <FormControl
              error={!!formErrors.difficulty}
              sx={{ gridColumn: 'span 4' }}
            >
              <InputLabel>Difficulty</InputLabel>
              <Select
                name="difficulty"
                value={formData.difficulty}
                label="Difficulty"
                onChange={handleSelectChange}
              >
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </Select>
              {formErrors.difficulty && (
                <FormHelperText>{formErrors.difficulty}</FormHelperText>
              )}
            </FormControl>

            <FormControl
              error={!!formErrors.problem_type}
              sx={{ gridColumn: 'span 4' }}
            >
              <InputLabel>Problem Type</InputLabel>
              <Select
                name="problem_type"
                value={formData.problem_type}
                label="Problem Type"
                onChange={handleSelectChange}
              >
                <MenuItem value="Multi-Select">Multi-Select</MenuItem>
                <MenuItem value="True-False">True-False</MenuItem>
              </Select>
              {formErrors.problem_type && (
                <FormHelperText>{formErrors.problem_type}</FormHelperText>
              )}
            </FormControl>

            <TextField
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              label="Problem Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              error={!!formErrors.description}
              helperText={formErrors.description}
              sx={{ gridColumn: 'span 12' }}
            />

            <TextField
              fullWidth
              variant="outlined"
              label="Choice 1"
              name="choice1"
              value={formData.choice1}
              onChange={handleInputChange}
              error={!!formErrors.choice1}
              helperText={formErrors.choice1}
              sx={{ gridColumn: 'span 12' }}
            />

            <TextField
              fullWidth
              variant="outlined"
              label="Choice 2"
              name="choice2"
              value={formData.choice2}
              onChange={handleInputChange}
              error={!!formErrors.choice2}
              helperText={formErrors.choice2}
              sx={{ gridColumn: 'span 12' }}
            />

            <TextField
              fullWidth
              variant="outlined"
              label="Choice 3"
              name="choice3"
              value={formData.choice3}
              onChange={handleInputChange}
              error={!!formErrors.choice3}
              helperText={formErrors.choice3}
              sx={{ gridColumn: 'span 12' }}
            />

            <FormControl
              error={!!formErrors.correct_answer}
              sx={{ gridColumn: 'span 4' }}
            >
              <InputLabel>Correct Answer</InputLabel>
              <Select
                name="correct_answer"
                value={formData.correct_answer}
                label="Correct Answer"
                onChange={handleSelectChange}
              >
                <MenuItem value="1">Choice 1</MenuItem>
                <MenuItem value="2">Choice 2</MenuItem>
                <MenuItem value="3">Choice 3</MenuItem>
              </Select>
              {formErrors.correct_answer && (
                <FormHelperText>{formErrors.correct_answer}</FormHelperText>
              )}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedProblemId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmDialog}
        onClose={() => setDeleteConfirmDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this problem? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InstructorAdminProblemList;
