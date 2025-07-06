import React from 'react';

import {Box, Text} from 'ink';

import {useNavigation} from '../../../hooks/NavigationMenu.js';

interface Option {
    action: string;
    label: string;
    value: string;
    wordHighligth: string;
}

const Options: Option[] = [
        { action: 'Build', label: ' Docker image', value: '1', wordHighligth: '#FF3F5F' },
        { action: 'Run', label: ' Docker image', value: '2', wordHighligth: '#FF3F5F' },
        { action: 'Create', label: ' Artifact Registry', value: '3', wordHighligth: '#FF3F5F' },
        { action: 'Push', label: ' Docker to AR', value: '4', wordHighligth: '#FF3F5F' },
        { action: 'Deploy', label: ' to Cloud Run', value: '5', wordHighligth: '#FF3F5F' }
];

export default function OptionsMenu() {
    const { selectedIndex } = useNavigation({
        items: Options,
        initialIndex: 0,
        onSelect: (option) => {
            // Handle selection
            console.log(`Selected: ${option.action}`);
        },
        loop: true
        });


    return (
        <Box flexDirection="column" gap={0.5} padding={1} width="25">
            {Options.map((option, index) => (
                <Text key={index} color={selectedIndex === index ? 'white' : '#4F4F4F'}>
                    <Text color={selectedIndex === index ? option.wordHighligth : '#4F4F4F'}>
                        <Text color='#486CFF'>{selectedIndex === index ? '> ' : ' '}</Text>
                        {option.action}
                    </Text>
                    {option.label}
                </Text>
            ))}
        </Box>

    );
}