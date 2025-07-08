import React, { useEffect } from 'react';
import { Box, Text, useInput } from 'ink';

import { useNavigation } from '../../../hooks/NavigationMenu.js';
import YamlSection from './SetupSection.js';

import { Config, configSchema, writeYamlFile } from '../../../hooks/UtilsYAML.js';

type setupMenuProps = {
    setSetupCheck: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentView: React.Dispatch<React.SetStateAction<"menu" | "setup" | "b&d">>;
    loadedYaml: Config;
    setLoadedYaml: React.Dispatch<React.SetStateAction<Config>>;
};

let unsavedYaml: Config;

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

    useEffect(() => {
        unsavedYaml = loadedYaml;
    }, []);

    useInput(async (_, key) => {
		if (key.escape) {
            setLoadedYaml(unsavedYaml);
		} else if (key.return && fieldsFilled) {
            setSetupCheck(true);
            setCurrentView('menu');
            writeYamlFile('gcloudDeploy.yaml', loadedYaml)
        }
	});

    // TODO: Can't I optimize this code?
    const dockerEntries = [
        {
            propertyName: 'Project path', placeholder: loadedYaml.docker.project_path === '' ? 'Press ENTER here to set your current path' : '',
            value: loadedYaml.docker.project_path, setValue: (value: string) => updateField('docker', 'project_path', value),
            index: 0
        
        },
        {
            propertyName: 'Image name', placeholder: '',
            value: loadedYaml.docker.image_name, setValue: (value: string) => updateField('docker', 'image_name', value),
            index: 1
        },
        {
            propertyName: 'Image tag', placeholder: '',
            value: loadedYaml.docker.tag, setValue: (value: string) => updateField('docker', 'tag', value),
            index: 2
        }
    ];
   
    const gcloudEntries = [
        {
            propertyName: 'Project ID', placeholder: '',
            value: loadedYaml.google_cloud.project_id, setValue: (value: string) => updateField('google_cloud', 'project_id', value),
            index: 3
        },
        {
            propertyName: 'Region', placeholder: '',
            value: loadedYaml.google_cloud.region, setValue: (value: string) => updateField('google_cloud', 'region', value),
            index: 4
        }
    ];
    
    const arEntries = [
        {
            propertyName: 'Repository', placeholder: '',
            value: loadedYaml.artifact_registry.repository, setValue: (value: string) => updateField('artifact_registry', 'repository', value),
            index: 5
        }
    ];
    
    const gcrEntries = [
        {
            propertyName: 'GCR Service', placeholder: '',
            value: loadedYaml.cloud_run.service, setValue: (value: string) => updateField('cloud_run', 'service', value),
            index: 6
        }
    ];

    const { selectedIndex } = useNavigation({
        items: [0, 1, 2, 3, 4, 5, 6],
        initialIndex: 0,
        loop: false,
        onSelect: (_, index) => {
            if (index === 0 && loadedYaml.docker.project_path === '') {
                updateField('docker', 'project_path', process.cwd());
            }
        },
    });

    return ( // TODO: Removed gap because it was causing re-rendering issues. Must be fixed later.
        <Box flexDirection="column" width='50%' gap={1}>
            <Box justifyContent='center'>
            {fieldsFilled ? <Text color="green">All fields are filled</Text> : <Text bold color="red">Please fill all fields</Text> }
            </Box>

            <YamlSection entryColor='#ff3960' title="Docker" entries={dockerEntries} selectedIndex={selectedIndex}/>
            <YamlSection entryColor='#ff3960' title="GCloud" entries={gcloudEntries} selectedIndex={selectedIndex}/>
            <YamlSection entryColor='#ff3960' title="Artifact Registry" entries={arEntries} selectedIndex={selectedIndex}/>
            <YamlSection entryColor='#ff3960' title="GCR Service" entries={gcrEntries} selectedIndex={selectedIndex}/>
            
        </Box>
    )
}