import React from 'react';
import {Text} from 'ink';

type tooltipProps = {
	currentView: string;
	primaryColor: string;
	secondaryColor: string;
};

// TODO: Should I add a specialColor prop for dynamic colors?
export default function Tooltip({ currentView, primaryColor, secondaryColor }: tooltipProps) {
	switch (currentView) {
		case 'setup':
			return (
				<Text color={secondaryColor}>
					<Text color={primaryColor}>↑/↓</Text> Navigate{'  '}
					<Text color={primaryColor}>ENTER</Text> Submit{'  '}
					<Text color={primaryColor}>ESC</Text> Return{'  '}
					<Text color={primaryColor}>CTRL+C</Text> Exit{'  '}
				</Text>
			);

        case 'menu':
			return (
				<Text color={secondaryColor}>
					<Text color={primaryColor}>1</Text> Setup{'  '}
					<Text color={primaryColor}>2</Text> Build & Deploy{'  '}
					<Text color={primaryColor}>CTRL+C</Text> Exit{'  '}
				</Text>
			);

		case 'b&d':
			return (
				<Text color={secondaryColor}>
					<Text color={primaryColor}>↑/↓</Text> Navigate{'  '}
					<Text color={primaryColor}>ENTER</Text> Select{'  '}
					<Text color={primaryColor}>ESC</Text> Return{'  '}
					<Text color={primaryColor}>CTRL+C</Text> Exit{'  '}
				</Text>
			);

		default:
			return <Text color={secondaryColor}>Unknown mode</Text>;
	}
}
