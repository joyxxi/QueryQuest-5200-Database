import { useSelector } from 'react-redux';
import StudentProblemList from './StudentProblemList';
import InstructorAdminProblemList from './InstructorAdminProbelmList';

const ProblemList = () => {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  console.log(currentUser);
  const user_id = currentUser?.user_id;
  const user_role = currentUser?.role;

  // TODO: add logic to check if it is student
  if (user_role === 'student') {
    return <StudentProblemList student_id={user_id} />;
  } else {
    return <InstructorAdminProblemList />;
  }
};
export default ProblemList;
