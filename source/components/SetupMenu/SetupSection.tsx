import React from 'react';

import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

interface YamlEntry {
    propertyName: string;
    placeholder: string;
    value: string;
    setValue: (value: string) => void;
    index: number;
}

interface ConfigSectionProps {
    title: string;
    titleColor?: string;
    entryColor?: string;
    entries: YamlEntry[];
    selectedIndex: number;
}
// TODO: Why does this causes re rendering issues when using gap or marginTop?
export default function YamlSection({ title, titleColor = "#4F4F4F", entryColor = "#FF3F5F", entries, selectedIndex }: ConfigSectionProps) {
    return (
        <Box flexDirection='column'>
            <Text color={titleColor}>{title}</Text>
                {entries.map((entry) => (
                    <Box key={entry.propertyName} marginLeft={4}>
                        <Text color={entryColor}>{entry.propertyName}: </Text>
                        <TextInput 
                            placeholder={entry.placeholder}
                            onChange={entry.setValue}
                            value={entry.value}
                            focus={selectedIndex === entry.index}
                        />
                    </Box>
                ))}
        </Box>
    );
}


/*
interface CustomYamlSectionProps {
    title: string;
    titleColor?: string;
    children: React.ReactNode;
}

export function CustomYamlSection({ title, titleColor = "#4F4F4F", children }: CustomYamlSectionProps) {
    return (
        <Box flexDirection='column'>
            <Text color={titleColor}>{title}</Text>
            <Box flexDirection='column' marginLeft={4}>
                {children}
            </Box>
        </Box>
    );
}
*/