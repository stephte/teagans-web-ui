import "./text-input.scss";

const TextInput = (props) => {
	return (
		<input
			className="text"
			type={props.isPassword ? 'password' : 'text'}
			placeholder={props.placeholder}
			onChange={props.onChange}
			onBlur={props.onBlur}
			onFocus={props.onFocus}
			value={props.value}
			required={props.required}
			name={props.name}
			onKeyPress={props.onKeyPress}
			disabled={props.disabled}
		/>
	);
};

export default TextInput;