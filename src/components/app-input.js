import "./app-input.scss";

const AppInput = (props) => {
	return (
		<>
			<label className="input-label">
				{props.label || props.placeholder || ""}
			</label>
			<input
				className="app-input"
				type={props.type || "text"}
				placeholder={props.placeholder || null}
				onChange={props.onChange || null}
				onBlur={props.onBlur || null}
				onFocus={props.onFocus || null}
				value={props.value || ""}
				required={props.required || null}
				name={props.name || null}
				onKeyDown={props.onKeyDown || null}
				disabled={props.disabled || false}
				min={props.min || null}
				max={props.max || null}
			/>
		</>
	);
};

export default AppInput;