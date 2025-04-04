import React from 'react';
import { Svg, Path } from 'react-native-svg';

export type AppIconProps = {
	width?: number;
	height?: number;
	color?: string;
};

export const IconMusic = ({ width, height, color }: AppIconProps) => {
	return (
		<Svg
			width={width || '24'}
			height={height || '24'}
			viewBox="0 0 24 24"
			fill="none"
		>
			<Path
				d="M21 3V15.5C21 16.4283 20.6313 17.3185 19.9749 17.9749C19.3185 18.6313 18.4283 19 17.5 19C16.5717 19 15.6815 18.6313 15.0251 17.9749C14.3687 17.3185 14 16.4283 14 15.5C14 14.5717 14.3687 13.6815 15.0251 13.0251C15.6815 12.3687 16.5717 12 17.5 12C18.04 12 18.55 12.12 19 12.34V6.47L9 8.6V17.5C9 18.4283 8.63125 19.3185 7.97487 19.9749C7.3185 20.6313 6.42826 21 5.5 21C4.57174 21 3.6815 20.6313 3.02513 19.9749C2.36875 19.3185 2 18.4283 2 17.5C2 16.5717 2.36875 15.6815 3.02513 15.0251C3.6815 14.3687 4.57174 14 5.5 14C6.04 14 6.55 14.12 7 14.34V6L21 3Z"
				fill={color || 'black'}
			/>
		</Svg>
	);
};

export const IconBookshelf = ({ width, height, color }: AppIconProps) => {
	return (
		<Svg
			width={width || '24'}
			height={height || '24'}
			viewBox="0 0 24 24"
			fill="none"
		>
			<Path
				d="M9 3V18H12V3H9ZM12 5L16 18L19 17L15 4L12 5ZM5 5V18H8V5H5ZM3 19V21H21V19H3Z"
				fill={color || 'black'}
			/>
		</Svg>
	);
};

export const IconDotsHorizontal = ({ width, height, color }: AppIconProps) => {
	return (
		<Svg
			width={width || '24'}
			height={height || '24'}
			viewBox="0 0 24 24"
			fill="none"
		>
			<Path
				d="M16 12C16 11.4696 16.2107 10.9609 16.5858 10.5858C16.9609 10.2107 17.4696 10 18 10C18.5304 10 19.0391 10.2107 19.4142 10.5858C19.7893 10.9609 20 11.4696 20 12C20 12.5304 19.7893 13.0391 19.4142 13.4142C19.0391 13.7893 18.5304 14 18 14C17.4696 14 16.9609 13.7893 16.5858 13.4142C16.2107 13.0391 16 12.5304 16 12ZM10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12ZM4 12C4 11.4696 4.21071 10.9609 4.58579 10.5858C4.96086 10.2107 5.46957 10 6 10C6.53043 10 7.03914 10.2107 7.41421 10.5858C7.78929 10.9609 8 11.4696 8 12C8 12.5304 7.78929 13.0391 7.41421 13.4142C7.03914 13.7893 6.53043 14 6 14C5.46957 14 4.96086 13.7893 4.58579 13.4142C4.21071 13.0391 4 12.5304 4 12Z"
				fill={color || 'black'}
			/>
		</Svg>
	);
};

export const IconWave = ({ width, height, color }: AppIconProps) => {
	return (
		<Svg
			width={width || '24'}
			height={height || '24'}
			viewBox="0 0 24 24"
			fill="none"
		>
			<Path
				d="M22 12L20 13L19 14L18 13L17 16L16 13L15 21L14 13L13 15L12 13L11 17L10 13L9 22L8 13L7 19L6 13L5 14L4 13L2 12L4 11L5 10L6 11L7 5L8 11L9 2L10 11L11 7L12 11L13 9L14 11L15 3L16 11L17 8L18 11L19 10L20 11L22 12Z"
				fill={color || 'black'}
			/>
		</Svg>
	);
};

export const IconPlay = ({ width, height, color }: AppIconProps) => {
	return (
		<Svg
			width={width || '24'}
			height={height || '24'}
			viewBox="0 0 24 24"
			fill="none"
		>
			<Path
				d="M8 5.14062V19.1406L19 12.1406L8 5.14062Z"
				fill={color || 'black'}
			/>
		</Svg>
	);
};

export const IconPlayPause = ({ width, height, color }: AppIconProps) => {
	return (
		<Svg
			width={width || '24'}
			height={height || '24'}
			viewBox="0 0 24 24"
			fill="none"
		>
			<Path
				d="M3 5V19L11 12L3 5ZM13 19H16V5H13V19ZM18 5V19H21V5"
				fill={color || 'black'}
			/>
		</Svg>
	);
};

export const IconPause = ({ width, height, color }: AppIconProps) => {
	return (
		<Svg
			width={width || '24'}
			height={height || '24'}
			viewBox="0 0 24 24"
			fill="none"
		>
			<Path d="M14 19H18V5H14V19ZM6 19H10V5H6V19Z" fill={color || 'black'} />
		</Svg>
	);
};
