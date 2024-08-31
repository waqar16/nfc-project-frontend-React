// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import 'remixicon/fonts/remixicon.css';
// import styles from '../../assets/css/profiles/Team.module.css';
// import ConfirmationModal from '../modal/ConfirmationModal';
// import Sidebar from '../sidebar/Sidebar';
// import { ToastContainer, toast } from 'react-toastify';
// import Loader from '../loader/Loader';

// const TeamManagement = () => {
//   const [employees, setEmployees] = useState([]);
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [employee, setEmployee] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     position: '',   
//     phone: '',
//     company: '',
//   });
//   const [companyId, setCompanyId] = useState('');
//   const [isEditing, setIsEditing] = useState(false);
//   const [originalEmail, setOriginalEmail] = useState('');
//   const [loading, setLoading] = useState(true);

//   const openModal = () => setModalOpen(true);

//   const closeModal = () => setModalOpen(false);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     fetchCompanyAndEmployees();
//   }, []);

//   const fetchCompanyAndEmployees = async () => {
//     try {
//       const token = localStorage.getItem('authToken');
//       const companyResponse = await axios.get('https://api.onesec.shop/api/companies/', {
//         headers: {
//           Authorization: `Token ${token}`,
//         },
//       });
//       console.log('Company data:', companyResponse.data);

//       if (companyResponse.data.length > 0) {
//         console.log('Company data:', companyResponse.data);
//         const company = companyResponse.data[0];
//         setCompanyId(company.id);
//         setEmployee((prevEmployee) => ({
//           ...prevEmployee,
//           company: company.id,
//         }));
//       }

//       fetchEmployees(token);
//     } catch (error) {
//       console.error('Error fetching company and employees:', error);
//     }
//   };

//   const fetchEmployees = async (token) => {
//     try {
//       const employeeResponse = await axios.get('https://api.onesec.shop/api/employees/', {
//         headers: {
//           Authorization: `Token ${token}`,
//         },
//       });
//       setEmployees(employeeResponse.data);
//       setLoading(false)
//     } catch (error) {
//       console.error('Error fetching employees:', error);
//       setLoading(false)
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEmployee((prevEmployee) => ({
//       ...prevEmployee,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     setLoading(true)
//     e.preventDefault();
//     const token = localStorage.getItem('authToken');
//     console.log('Employee data being submitted:', employee);

//     // Check if the company field is populated
//     if (!employee.company) {
//       alert('Company is required. Please complete you company profile first.');
//       return;
//     }

//     try {
//       if (isEditing) {
//         await axios.put(`https://api.onesec.shop/api/employees/${originalEmail}/`, employee, {
//           headers: {
//             Authorization: `Token ${token}`,
//           },
//         });
//         // alert('Employee updated successfully!');
//         setLoading(false)
//         toast.success("Employee updated successfully!")
//       } else {
//         await axios.post('https://api.onesec.shop/api/employees/', employee, {
//           headers: {
//             Authorization: `Token ${token}`,
//           },
//         });
//         setLoading(false)
//         toast.success("Employee updated successfully!")
//       }
//       fetchEmployees(token);
//       resetForm();
//     } catch (error) {
//       setLoading(false)
//       console.error('Error submitting employee:', error);
//       // alert('Failed to submit employee.');
//       toast.error('Failed to update employee.')
//     }
//   };

//   const resetForm = () => {
//     setEmployee({
//       id: '',
//       first_name: '',
//       last_name: '',
//       email: '',
//       position: '',
//       phone: '',
//       company: companyId,
//     });
//     setOriginalEmail(''); 
//     setIsEditing(false);
//   };

//   const handleEdit = (emp) => {
//     setEmployee({
//       id: emp.id,
//       first_name: emp.first_name,
//       last_name: emp.last_name,
//       email: emp.email,
//       position: emp.position,
//       phone: emp.phone,
//       company: emp.company,
//     });
//     setOriginalEmail(emp.email);
//     setIsEditing(true);
//   };

//   const handleDelete = async (email) => {
//     setLoading(true)
//     const token = localStorage.getItem('authToken');
//     try {
//       await axios.delete(`https://api.onesec.shop/api/employees/${email}/`, {
//         headers: {
//           Authorization: `Token ${token}`,
//         },
//       });
//       // alert('Employee deleted successfully!');
//       toast.success('Employee deleted successfully!');
//       setLoading(false)
//       fetchEmployees(token);
//     } catch (error) {
//       setLoading(false)
//       console.error('Error deleting employee:', error);
//       // alert('Failed to delete employee.');
//       toast.error('Failed to delete employee.');
//     }
//   };

//   return (
//     <div className={styles.teamManagementContainer}>
//       <Sidebar profileType={localStorage.getItem('profile_type')} />
//       <div className={styles.formContainer}>
//         <h2>{isEditing ? 'Edit Employee' : 'Create Employee'}</h2>
//         <form onSubmit={handleSubmit} className={styles.form}>
//           <input
//             type="hidden"
//             name="company"
//             value={employee.company}
//             onChange={handleChange}
//           />
//           <label className={styles.label}>
//             First Name:
//             <input
//               type="text"
//               name="first_name"
//               value={employee.first_name}
//               onChange={handleChange}
//               className={styles.input}
//             />
//           </label>
//           <label className={styles.label}>
//             Last Name:
//             <input
//               type="text"
//               name="last_name"
//               value={employee.last_name}
//               onChange={handleChange}
//               className={styles.input}
//             />
//           </label>
//           <label className={styles.label}>
//             Email:
//             <input
//               type="email"
//               name="email"
//               value={employee.email}
//               onChange={handleChange}
//               className={styles.input}
//             />
//           </label>
//           <label className={styles.label}>
//             Position:
//             <input
//               type="text"
//               name="position"
//               value={employee.position}
//               onChange={handleChange}
//               className={styles.input}
//             />
//           </label>
//           <label className={styles.label}>
//             Phone:
//             <input
//               type="text"
//               name="phone"
//               value={employee.phone}
//               onChange={handleChange}
//               className={styles.input}
//             />
//           </label>
//           <button type="submit" className={styles.buttonSaveProfile}>
//             {isEditing ? 'Update Employee' : 'Create Employee'}
//           </button>
//         </form>
//       </div>
//       <div className={styles.listContainer}>
//         <h2>Employee List</h2>
//         <ul className={styles.employeeList}>
//           {employees.map((emp) => (
//             <li key={emp.id} className={styles.employeeItem}>
//               <div className={styles.employeeInfo}>
//                 <p><i className="ri-user-3-line"></i> <strong>Name:</strong> {emp.first_name} {emp.last_name}</p>
//                 <p><i className="ri-mail-line"></i> <strong>Email:</strong> {emp.email}</p>
//                 <p><i className="ri-briefcase-line"></i> <strong>Position:</strong> {emp.position}</p>
//                 <p><i className="ri-phone-line"></i> <strong>Phone:</strong> {emp.phone}</p>
//                 <div className={styles.actionIcons}>
//                   <i className={`ri-edit-line ${styles.actionIconEdit}`} onClick={() => handleEdit(emp)}></i>
//                   <i className={`ri-delete-bin-line ${styles.actionIconDelete}`} onClick={openModal}></i> {/* Delete icon */}
//                 </div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <ToastContainer/>
//       {loading && <Loader />}
//       <ConfirmationModal
//                         message="Do you want to delete your employee? This action cannot be undone."
//                         isOpen={isModalOpen}
//                         onClose={closeModal}
//                         onConfirm={handleDelete(employee.email)}
//                     />
//     </div>
//   );
// };

// export default TeamManagement;










import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css';
import styles from '../../assets/css/profiles/Team.module.css';
import ConfirmationModal from '../modal/ConfirmationModal';
import Sidebar from '../sidebar/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../loader/Loader';

const TeamManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [employee, setEmployee] = useState({
    first_name: '',
    last_name: '',
    email: '',
    position: '',   
    phone: '',
    company: '',
  });
  const [companyId, setCompanyId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [originalEmail, setOriginalEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [emailToDelete, setEmailToDelete] = useState(''); // Track email to delete

  const openModal = (email) => {
    setEmailToDelete(email);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEmailToDelete(''); // Clear email to delete when closing the modal
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCompanyAndEmployees();
  }, []);

  const fetchCompanyAndEmployees = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const companyResponse = await axios.get('https://api.onesec.shop/api/companies/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (companyResponse.data.length > 0) {
        const company = companyResponse.data[0];
        setCompanyId(company.id);
        setEmployee((prevEmployee) => ({
          ...prevEmployee,
          company: company.id,
        }));
      }

      fetchEmployees(token);
    } catch (error) {
      console.error('Error fetching company and employees:', error);
    }
  };

  const fetchEmployees = async (token) => {
    try {
      const employeeResponse = await axios.get('https://api.onesec.shop/api/employees/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setEmployees(employeeResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const token = localStorage.getItem('authToken');

    if (!employee.company) {
      alert('Company is required. Please complete your company profile first.');
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`https://api.onesec.shop/api/employees/${originalEmail}/`, employee, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        toast.success("Employee updated successfully!");
      } else {
        await axios.post('https://api.onesec.shop/api/employees/', employee, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        toast.success("Employee created successfully!");
      }
      fetchEmployees(token);
      resetForm();
    } catch (error) {
      console.error('Error submitting employee:', error);
      toast.error('Failed to submit employee.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmployee({
      id: '',
      first_name: '',
      last_name: '',
      email: '',
      position: '',
      phone: '',
      company: companyId,
    });
    setOriginalEmail(''); 
    setIsEditing(false);
  };

  const handleEdit = (emp) => {
    setEmployee({
      id: emp.id,
      first_name: emp.first_name,
      last_name: emp.last_name,
      email: emp.email,
      position: emp.position,
      phone: emp.phone,
      company: emp.company,
    });
    setOriginalEmail(emp.email);
    setIsEditing(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    const token = localStorage.getItem('authToken');
    try {
      await axios.delete(`https://api.onesec.shop/api/employees/delete/${emailToDelete}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      toast.success('Employee deleted successfully!');
      fetchEmployees(token);
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee.');
    } finally {
      setLoading(false);
      closeModal(); // Close modal after deletion
    }
  };

  return (
    <div className={styles.teamManagementContainer}>
      <Sidebar profileType={localStorage.getItem('profile_type')} />
      <div className={styles.formContainer}>
        <h2>{isEditing ? 'Edit Employee' : 'Create Employee'}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="hidden"
            name="company"
            value={employee.company}
            onChange={handleChange}
          />
          <label className={styles.label}>
            First Name:
            <input
              type="text"
              name="first_name"
              value={employee.first_name}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Last Name:
            <input
              type="text"
              name="last_name"
              value={employee.last_name}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Email:
            <input
              type="email"
              name="email"
              value={employee.email}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Position:
            <input
              type="text"
              name="position"
              value={employee.position}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Phone:
            <input
              type="text"
              name="phone"
              value={employee.phone}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <button type="submit" className={styles.buttonSaveProfile}>
            {isEditing ? 'Update Employee' : 'Create Employee'}
          </button>
        </form>
      </div>
      <div className={styles.listContainer}>
        <h2>Employee List</h2>
        <ul className={styles.employeeList}>
          {employees.map((emp) => (
            <li key={emp.id} className={styles.employeeItem}>
              <div className={styles.employeeInfo}>
                <p><i className="ri-user-3-line"></i> <strong>Name:</strong> {emp.first_name} {emp.last_name}</p>
                <p><i className="ri-mail-line"></i> <strong>Email:</strong> {emp.email}</p>
                <p><i className="ri-briefcase-line"></i> <strong>Position:</strong> {emp.position}</p>
                <p><i className="ri-phone-line"></i> <strong>Phone:</strong> {emp.phone}</p>
                <div className={styles.actionIcons}>
                  <i className={`ri-edit-line ${styles.actionIconEdit}`} onClick={() => handleEdit(emp)}></i>
                  <i className={`ri-delete-bin-line ${styles.actionIconDelete}`} onClick={() => openModal(emp.email)}></i>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <ToastContainer />
      {loading && <Loader />}
      <ConfirmationModal
        message="Do you want to delete this employee? This action cannot be undone."
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDelete} // Handle delete confirmation
      />
    </div>
  );
};

export default TeamManagement;
