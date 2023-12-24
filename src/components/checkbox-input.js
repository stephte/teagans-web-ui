import "./checkbox-input.scss";

const CheckboxInput = (props) => {
	const { text, name, value, onChange, disabled } = props;

	return (
		<checkbox-input>
			<label htmlFor={name}>{text}</label>
			<input
				id={name}
				type="checkbox"
				onChange={onChange}
				value={value}
				name={name}
				disabled={disabled}
			/>
		</checkbox-input>
	);
};

export default CheckboxInput;