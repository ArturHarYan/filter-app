export const Range = ({
  className,
  label,
  id,
  min = '0',
  max,
  step,
  value,
  onChange,
  disabled,
}) => {
  return (
    <div className={className}>
      <label htmlFor={id}>{label}</label>
      <input
        type='range'
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      <span>{value}</span>
    </div>
  );
};
