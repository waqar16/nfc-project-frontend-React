// import React, { useState, useEffect } from 'react';
// import styles from '../../assets/css/authentication/Authentication.module.css';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Loader from '../loader/Loader';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Activation = () => {
//   const { uid, token } = useParams();
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);


//   useEffect(() => {
//     window.scrollTo(0, 0);
//     try {
//       setLoading(true);
//       const response = axios.post('http://localhost:8000/auth/users/activation/', {
//         uid,
//         token,
//       });

//       if (response.status === 204) {
//         setMessage('You have successfully activated your account.');
//         toast.success('Account activated successfully. Please login.');
//         navigate('/login')
//       }
//     } catch (error) {
//       setLoading(false);
//       setMessage('Error activating account. Please try again.');
//       toast.error('Error activating account. Please try again.');
//       console.error('Activation error:', error);
//     }

//     finally {
//       setLoading(false);
//     }
//   }, []);
//   // const handleActivation = async () => {

//   // };

//   return (
//     <div className={styles.login}>
//       <form action="" className={styles.login__form} onSubmit={e => e.preventDefault()}>
//         <h2 className={styles.login__title}>Account Activation</h2>
//         {/* <div className={styles.login__group}>
//           <button type="button" onClick={handleActivation} className={styles.login__button}>
//             Confirm Activation
//           </button>
//         </div> */}
//         {message && <p style={{ color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}
//         <div>

//         </div>
//       </form>
//       {loading && <Loader />}
//       <ToastContainer />
//     </div>
//   );
// };

// export default Activation;



import React, { useState, useEffect } from 'react';
import styles from '../../assets/css/authentication/Authentication.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../loader/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Activation = () => {
  const { uid, token } = useParams();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const activateAccount = async () => {
      try {
        setLoading(true);
        const response = await axios.post('http://localhost:8000/auth/users/activation/', {
          uid,
          token,
        });

        if (response.status === 204) {
          setMessage('You have successfully activated your account.');
          toast.success('Account activated successfully. Please login.');
          navigate('/login');
        }
      } catch (error) {
        setMessage('Error activating account. Please try again.');
        toast.error('Error activating account. Please try again.');
        console.error('Activation error:', error);
      } finally {
        setLoading(false);
      }
    };

    activateAccount();
  }, [uid, token, navigate]);

  return (
    <div className={styles.login}>
      <form className={styles.login__fom} onSubmit={(e) => e.preventDefault()}>
        <h2 className={styles.login__title}>Activating Your Account....</h2>
        {message && <p style={{ color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}
      </form>
      {loading && <Loader />}
      <ToastContainer />
    </div>
  );
};

export default Activation;
