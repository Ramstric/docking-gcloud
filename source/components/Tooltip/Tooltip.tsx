import React from 'react';
import {Text} from 'ink';

type tooltipProps = {
	currentView: string;
	primaryColor: string;
	secondaryColor: string;
};

export default function Tooltip({ currentView,primaryColor,secondaryColor }: tooltipProps) {
	switch (currentView) {
		case 'setup':
			return (
				<Text color={secondaryColor}>
					<Text color={primaryColor}>↑/↓</Text> Navigate{'  '}
					<Text color={primaryColor}>ESC</Text> Quit{'  '}
					<Text color={primaryColor}>Enter</Text> Submit{'  '}
				</Text>
			);

        case 'menu':
			return (
				<Text color={secondaryColor}>
					<Text color={primaryColor}>↑/↓</Text> Navigate{'  '}
					<Text color={primaryColor}>ESC</Text> Quit{'  '}
					<Text color={primaryColor}>Q</Text> Setup{'  '}
					<Text color={primaryColor}>E</Text> Build & Deploy{'  '}
				</Text>
			);

		default:
			return <Text color={secondaryColor}>Unknown mode</Text>;
	}
}
