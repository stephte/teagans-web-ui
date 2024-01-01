import "./app-input.scss";

const AppInput = (props) => {
	return (
		<input
			className="text"
			type={props.type || "text"}
			placeholder={props.placeholder || null}
			onChange={props.onChange || null}
			onBlur={props.onBlur || null}
			onFocus={props.onFocus || null}
			value={props.value || ""}
			required={props.required || null}
			name={props.name || null}
			onKeyPress={props.onKeyPress || null}
			disabled={props.disabled || false}
			min={props.min || null}
			max={props.max || null}
		/>
	);
};

export default AppInput;