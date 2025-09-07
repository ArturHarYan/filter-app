export const Select = ({
  className,
  label,
  id,
  value,
  onChange,
  disabled,
  children,
}) => {
  return (
    <div className={className}>
      <label htmlFor={id}>{label}</label>
      <select
        name={id}
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        {children}
      </select>
    </div>
  );
};
