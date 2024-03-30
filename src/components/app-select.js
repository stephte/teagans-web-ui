import "./app-select.scss";

const AppSelect = ({ selectList, enumObj, defaultValue, selectedValue, onChange, required, disabled, label, name }) => {
	if (enumObj) {
		selectList = Object.keys(enumObj).filter(k => isNaN(Number(k))).map(k => { 
			return {
				value: k
			};
		});
	}

	if (selectList && selectList.length) {
		return (
			<>
				<label className="select-label">{`${label}${required ? '*' : ''}`}</label>
				<select
					name={name}
					className="app-select"
					value={selectedValue}
					onChange={onChange}
					required={required}
					disabled={disabled}
				>
					{
						selectList.map(item => {
							return <option key={item.value} value={item.value}>{item.label || item.value}</option>
						})
					}
				</select>
			</>
		);
	}
};

export default AppSelect;