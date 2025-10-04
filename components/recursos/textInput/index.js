export default function TextInput({
  label,
  name,
  register,
  required = false,
  errors = {},
  rules = {},
  placeholder = "",
  type = "text",
  ...rest
}) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && (
        <label
          htmlFor={name}
          style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={name}
        placeholder={placeholder}
        {...(register
          ? register(name, {
              required: required ? `${label || name} es requerido` : false,
              ...rules, // 👈 aquí entran maxLength, pattern, min, max...
            })
          : {})}
        {...rest}
         style={{
          width: "100%",
          padding: "0.5rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
      {errors[name] && (
        <p style={{ color: "red", fontSize: "0.8rem" }}>
          {errors[name].message}
        </p>
      )}
    </div>
  );
}
