import { useEffect } from 'react';
import ManageAppointments from '../../components/manageAppointments/ManageAppointments';

function ManageAppointmentsLayout() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }
    , []);
  return (
    <div>
      <ManageAppointments/>
    </div>
  );
}

export default ManageAppointmentsLayout;
