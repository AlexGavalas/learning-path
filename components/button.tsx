import styled from '@emotion/styled';

export const Button = styled.button`
	appearance: none;
	outline: none;

	background-color: white;
	color: black;

	border: 1px solid black;
	border-radius: 0.25rem;

	padding-block: 0.5rem;
	padding-inline: 1rem;

	cursor: pointer;

	&:hover {
		background-color: #eaecf0;
	}
`;
