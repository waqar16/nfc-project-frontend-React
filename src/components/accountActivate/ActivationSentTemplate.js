import styles from '../../assets/css/authentication/Authentication.module.css';

const ActivationSentTemplate = () => {

  return (
    <div className={styles.login}>
      <form action="" className={styles.login__form}>
        <h2 className={styles.login__title}>Account Activation Link Sent</h2>

        <div className={styles.login__group}>

      <p style={{color:"green"}}> Activation email sent to your email address successfully. Kindly check your email inbox. Check the spam folder if not receive in inbox.</p>
        </div>

      </form>
    </div>
  );
};

export default ActivationSentTemplate;
