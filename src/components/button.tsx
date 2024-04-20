import "./button.scss";

interface BtnProps {
	text: string;
	onClick: () => any;
	disabled?: boolean;
}

const Button = ({ text, onClick, disabled }: BtnProps) => {
	return (
		<button
			className="app-button"
			onClick={onClick}
			disabled={disabled}
		>
			{text}
		</button>
	);
}

export default Button;