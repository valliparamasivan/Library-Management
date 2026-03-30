const FormWrapper = ({ children, onSubmit, className }) => {
  return (
    <form onSubmit={onSubmit} noValidate className={className}>
      {children}
    </form>
  );
};
export default FormWrapper;
