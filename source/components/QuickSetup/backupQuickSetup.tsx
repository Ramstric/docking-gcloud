import React from 'react';
import { Box, Text } from 'ink';

import { useNavigation } from '../../../hooks/NavigationMenu.js';
import YamlSection from './QuickSetupSection.js';

import { Config, configSchema, writeYamlFile } from '../../../hooks/UtilsYAML.js';

type setupMenuProps = {
    setSetupCheck: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentView: React.Dispatch<React.SetStateAction<"menu" | "setup">>;
    loadedYaml: Config;
    setLoadedYaml: React.Dispatch<React.SetStateAction<Config>>;
};

export default function SetupMenu({ setSetupCheck, setCurrentView, loadedYaml, setLoadedYaml }: setupMenuProps) {
    const fieldsFilled = configSchema.safeParse(loadedYaml).error ? false : true;

    const updateField = <TSection extends keyof Config, TField extends keyof Config[TSection]>
        ( section: TSection, field: TField, value: Config[TSection][TField] ) => {
            setLoadedYaml(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    // TODO: Can't I optimize this code?
    const dockerEntries = [
        {
            propertyName: 'Image name', placeholder: '',
            value: loadedYaml.docker.image_name, setValue: (value: string) => updateField('docker', 'image_name', value),
            index: 0
        },
        {
            propertyName: 'Image tag', placeholder: '',
            value: loadedYaml.docker.tag, setValue: (value: string) => updateField('docker', 'tag', value),
            index: 1
        }
    ];
    
    const gcloudEntries = [
        {
            propertyName: 'Project ID', placeholder: '',
            value: loadedYaml.google_cloud.project_id, setValue: (value: string) => updateField('google_cloud', 'project_id', value),
            index: 2
        },
        {
            propertyName: 'Region', placeholder: '',
            value: loadedYaml.google_cloud.region, setValue: (value: string) => updateField('google_cloud', 'region', value),
            index: 3
        }
    ];

    const arEntries = [
        {
            propertyName: 'Repository', placeholder: '',
            value: loadedYaml.artifact_registry.repository, setValue: (value: string) => updateField('artifact_registry', 'repository', value),
            index: 4
        }
    ];

    const gcrEntries = [
        {
            propertyName: 'GCR Service', placeholder: '',
            value: loadedYaml.cloud_run.service, setValue: (value: string) => updateField('cloud_run', 'service', value),
            index: 5
        }
    ];

    const { selectedIndex } = useNavigation({
        items: [0, 1, 2, 3, 4, 5],
        initialIndex: 0,
        loop: false,
        onSelect: () => {
            // Check if all fields are filled
            if (fieldsFilled) {
                setSetupCheck(true);
                setCurrentView('menu');
                writeYamlFile('config.yaml', loadedYaml)
            }
            
        },
    });

    return (
        <Box flexDirection="column" width="40" gap={1}>
            {fieldsFilled ? <Text color="green">All fields are filled</Text> : <Text color="red">Please fill all fields</Text> }
            <YamlSection entryColor='#1d63ed' title="Docker" entries={dockerEntries} selectedIndex={selectedIndex}/>
            <YamlSection entryColor='#dcdcdc' title="GCloud" entries={gcloudEntries} selectedIndex={selectedIndex}/>
            <YamlSection title="Artifact Registry" entries={arEntries} selectedIndex={selectedIndex}/>
            <YamlSection entryColor='#447ec5' title="GCR Service" entries={gcrEntries} selectedIndex={selectedIndex}/>
        </Box>
    )
}