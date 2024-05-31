// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { SVGProps } from 'react';

const SvgThumbUpFill32 = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="1em"
		height="1em"
		fill="none"
		viewBox="0 0 32 32"
		{...props}
	>
		<path
			fill="currentColor"
			d="M11.5 19.484c-.01 3.721 2.93 6.553 7.607 6.563h1.358c1.28 0 2.256-.098 2.822-.244.84-.205 1.592-.733 1.592-1.7 0-.37-.098-.654-.215-.869-.068-.107-.049-.205.049-.244.644-.293 1.133-.888 1.133-1.67 0-.449-.127-.85-.342-1.133-.098-.136-.078-.253.078-.341.45-.284.762-.86.762-1.514 0-.479-.147-.977-.4-1.23-.137-.127-.118-.215.029-.332.312-.284.508-.752.508-1.319a1.811 1.811 0 0 0-1.827-1.826H21.13c-.85 0-1.406-.43-1.406-1.123 0-1.318 1.67-3.78 1.67-5.566 0-.967-.616-1.553-1.456-1.553-.732 0-1.113.478-1.523 1.289-1.494 2.88-3.467 5.224-4.98 7.236-1.319 1.739-1.924 3.233-1.934 5.576Zm-4.98.078c0 3.028 1.884 5.528 4.394 5.528h1.7c-1.768-1.348-2.55-3.35-2.53-5.625.01-2.461.889-4.248 1.816-5.469h-1.357c-2.275 0-4.023 2.441-4.023 5.566Z"
		/>
	</svg>
);
export default SvgThumbUpFill32;
