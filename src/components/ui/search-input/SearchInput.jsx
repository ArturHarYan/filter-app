export const SearchInput = ({
  label,
  id,
  className,
  placeholder,
  type = 'text',
  value,
  onChange,
  disabled,
}) => {
  return (
    <div className={className}>
      <label htmlFor={id}>{label}</label>
      <input
        placeholder={placeholder}
        name={id}
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};
