import React, { useEffect, useState } from 'react';
import {Box} from 'ink';

import { useNavigation } from '../../../hooks/NavigationMenu.js';
import YamlSection from './QuickSetupSection.js';

import { setParameters, writeConfigToYamlFile, readConfigFromYamlFile } from '../../../hooks/UtilsYAML.js';

let placeHolders = {
        dockerImageName: '',
        dockerImageTag: '',
        gcloudProjectID: '',
        gcloudRegion: '',
        arRepository: '',
        gcrService: ''
};

export default function QuickConfig({ currModeHandler, configBtnHandler, configDoneHandler }: { currModeHandler: (mode: "menu" | "config") => void, configBtnHandler: (status: boolean) => void, configDoneHandler: (status: boolean) => void }) {
    const [dockerImageName, setDockerImageName] = useState<string>('');
    const [dockerImageTag, setDockerImageTag] = useState<string>('');

    const [gcloudProjectID, setGcloudProjectID] = useState<string>('');
    const [gcloudRegion, setGcloudRegion] = useState<string>('');

    const [arRepository, setArRepository] = useState<string>('');

    const [gcrService, setGcrService] = useState<string>('');

    const [readFile , setReadFile] = useState<boolean>(false);

    // Try to read existing configuration from YAML file
    useEffect(() => {
        readConfigFromYamlFile('gcloudDeploy.yaml')
            .then((config) => {
                placeHolders = {
                    dockerImageName: config.docker?.image_name || '',
                    dockerImageTag: config.docker?.tag || '',
                    gcloudProjectID: config.google_cloud?.project_id || '',
                    gcloudRegion: config.google_cloud?.region || '',
                    arRepository: config.artifact_registry?.repository || '',
                    gcrService: config.cloud_run?.service || ''
                };
                setReadFile(true);
            })
            .catch(() => {
                console.error('No existing configuration found. Creating new configuration.');
            });
    }, [readFile]);

    const options = [
        { property : 'dockerImageName', value: dockerImageName },
        { property : 'dockerImageTag', value: dockerImageTag },
        { property : 'gcloudProjectID', value: gcloudProjectID },
        { property : 'gcloudRegion', value: gcloudRegion },
        { property : 'arRepository', value: arRepository },
        { property : 'gcrService', value: gcrService }
    ]

    const dockerEntries = [
        {
            propertyName: 'Image name', placeholder: placeHolders.dockerImageName,
            value: dockerImageName,     setValue: setDockerImageName,
            index: 0
        },
        {
            propertyName: 'Image tag', placeholder: placeHolders.dockerImageTag,
            value: dockerImageTag,     setValue: setDockerImageTag,
            index: 1
        }
    ];
    
    const gcloudEntries = [
        {
            propertyName: 'Project ID', placeholder: placeHolders.gcloudProjectID,
            value: gcloudProjectID,     setValue: setGcloudProjectID,
            index: 2
        },
        {
            propertyName: 'Region', placeholder: placeHolders.gcloudRegion,
            value: gcloudRegion,    setValue: setGcloudRegion,
            index: 3
        }
    ];

    const arEntries = [
        {
            propertyName: 'Repository', placeholder: placeHolders.arRepository,
            value: arRepository,        setValue: setArRepository,
            index: 4
        }
    ];

    const gcrEntries = [
        {
            propertyName: 'GCR Service', placeholder: placeHolders.gcrService,
            value: gcrService,           setValue: setGcrService,
            index: 5
        }
    ];

    const { selectedIndex } = useNavigation({
        items: options,
        initialIndex: 0,
        onSelect: (_option) => {

            // If a property value is empty, set it to the placeholder value
            options.forEach(option => {
                if (option.value === '') {
                    switch (option.property) {
                        case 'dockerImageName':
                            option.value = placeHolders.dockerImageName;
                            break;
                        case 'dockerImageTag':
                            option.value = placeHolders.dockerImageTag;
                            break;
                        case 'gcloudProjectID':
                            option.value = placeHolders.gcloudProjectID;
                            break;
                        case 'gcloudRegion':
                            option.value = placeHolders.gcloudRegion;
                            break;
                        case 'arRepository':
                            option.value = placeHolders.arRepository;
                            break;
                        case 'gcrService':
                            option.value = placeHolders.gcrService;
                            break;
                    }
                }
            });
            

            setParameters(options);
            writeConfigToYamlFile('gcloudDeploy.yaml')
                .then(() => {
                    configBtnHandler(false);
                    configDoneHandler(true);
                    currModeHandler('menu');
                })
                .catch((error) => {
                    console.error('Error writing configuration:', error);
                });
        },
        loop: false
    });

    return (
        <Box flexDirection="column" width="40" gap={1} padding={1}>
            <YamlSection entryColor='#1d63ed' title="Docker" entries={dockerEntries} selectedIndex={selectedIndex}/>
            <YamlSection entryColor='#dcdcdc' title="GCloud" entries={gcloudEntries} selectedIndex={selectedIndex}/>
            <YamlSection title="Artifact Registry" entries={arEntries} selectedIndex={selectedIndex}/>
            <YamlSection entryColor='#447ec5' title="GCR Service" entries={gcrEntries} selectedIndex={selectedIndex}/>
        </Box>
    )
}