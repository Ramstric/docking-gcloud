import {execa} from 'execa';

import React from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

import { useNavigation } from '../../../hooks/NavigationMenu.js';

import { Config } from '../../../hooks/UtilsYAML.js';
import { checkState } from '../types/index.js';

type buildDeployMenuProps = 
    {
        loadedYAML: Config;
    } &
    Record < 
        | 'buildCheck'
        | 'pushCheck'
        | 'deployCheck',
    checkState> & 
    Record <
        | 'setBuildCheck'
        | 'setPushCheck'
        | 'setDeployCheck',
    React.Dispatch<React.SetStateAction<checkState>>> 


export default function BuildDeployMenu({ loadedYAML, buildCheck, pushCheck, deployCheck, setBuildCheck, setPushCheck, setDeployCheck } : buildDeployMenuProps) {
    pushCheck;
    const [override, setOverride] = React.useState<boolean>(false);
    
    const [ buildLog, setBuildLog ] = React.useState<string>('');
    const [ deployLog, setDeployLog ] = React.useState<string>('');

    const dockerImageName = `${loadedYAML.google_cloud.region}-docker.pkg.dev/${loadedYAML.google_cloud.project_id}/${loadedYAML.artifact_registry.repository}/${loadedYAML.docker.image_name}:${loadedYAML.docker.tag}`;

    const buildTasks = [
        {
            status: 'Starting Docker Daemon',
            command: 'docker',
            options: [ 'desktop', 'start' ]
        },
        ( override && {
            status: 'Deleting existing image',
            command: 'docker',
            options: [ 'image', 'rm', dockerImageName ],
        }),
		{
            status: 'Building image',
			command: 'docker',
			options: [ 'build', '-t', dockerImageName, loadedYAML.docker.project_path ],
		}
	];

    const deployTasks = [
        ( pushCheck && {
            checkSetter: undefined,
            status: 'Deleting previous image', // Deletes all images, even untagged ones to clean up the registry completely
            command: 'gcloud',
            options: [
                'artifacts', 'docker', 'images', 'delete', `${loadedYAML.google_cloud.region}-docker.pkg.dev/${loadedYAML.google_cloud.project_id}/${loadedYAML.artifact_registry.repository}/${loadedYAML.docker.image_name}`,
                '--quiet',
                '--project', loadedYAML.google_cloud.project_id
            ],
        }),
        {   
            checkSetter: setPushCheck,
            status: 'Pushing image to Artifact Registry',
            command: 'docker',
            options: [ 'push', dockerImageName ],
        },
        {   
            checkSetter: setDeployCheck,
            status: 'Deploying image to Cloud Run',
            command: 'gcloud',
            options: [
                'run', 'deploy', loadedYAML.cloud_run.service,
                '--image', dockerImageName,
                '--region', loadedYAML.google_cloud.region,
                '--project', loadedYAML.google_cloud.project_id,
                '--allow-unauthenticated',
                '--memory', '1024Mi',
                '--port', '8080',
                '--cpu', '1',
                '--clear-volume-mounts'
            ],
        },
    ];


    const { selectedIndex } = useNavigation({
        items : ['overwrite', 'build', 'deploy'],
        initialIndex: 0,
        loop: false,
        onSelect: async (item) => {
            
            if (item === 'overwrite') {
                setOverride(!override);
            } else if (item === 'build') {
                try {
                    setBuildLog('Building image...');
                    setBuildCheck('pending');
                    for (const task of buildTasks) {
                        if (task) {
                            setBuildLog(task.status);
                            await execa(task.command, task.options, { all: true });
                        }
                    }
                    setBuildLog('Image built successfully.');
                    setBuildCheck(true);
                } catch (error: any) {
                    console.log(error.stderr);
                    setBuildLog(error.stderr);
                    setBuildCheck(false);
                }

            } else if (item === 'deploy') {
                let deployURL;
                try {
                    setDeployLog('Deploying image...');
                    setPushCheck('pending');
                    setDeployCheck('pending');
                    for (const task of deployTasks) {
                        if (task) {
                            setDeployLog(task.status);
                            const log = await execa(task.command, task.options, { all: true });
                            if (log.all.includes('Service URL: ')) {
                                const serviceUrl = log.all.split('\n').find(line => line.includes('Service URL: '));
                                deployURL = serviceUrl?.split('Service URL: ')[1];
                            }
                        }
                    }
                    setDeployLog(`Image deployed at: ${deployURL}`);
                    setDeployCheck(true);
                } catch (error: any) {
                    console.log(error.stderr);
                    setDeployLog(error.stderr);
                    setDeployCheck(false);
                }
            }

        }
    });

    
    return (
        <Box width='80%' flexDirection="column" gap={1}>
            <Box width={19}>
                <Text color={ selectedIndex === 0 ? '#fff' : '#515151' } > Overwrite: </Text>
                <Text color={override ? '#48f381' : '#ff6b6b'}> {override ? 'Yes' : 'No'} </Text>
            </Box>

            <Box flexDirection='column'>
                <Text color={selectedIndex === 1 ? '#fff' : '#515151' }>│ Build image {loadedYAML.docker.image_name}:{loadedYAML.docker.tag}</Text>
                <Box>
                    <Text color={selectedIndex === 1 ? '#fff' : '#515151' }>│ </Text>
                    {buildCheck === 'pending' ?  <Text color="#f3a348" ><Spinner type="dots" /> </Text> : null}
                    <Text color={buildCheck === true ? "#48f381" : buildCheck === false ? "#f34848" : "#b8b8b8"} >{buildLog}</Text>
                </Box>
            </Box>

            <Box flexDirection='column'>
                <Text color={selectedIndex === 2 ? '#fff' : '#515151' }>│ Deploy image</Text>
                <Box>
                    <Text color={selectedIndex === 2 ? '#fff' : '#515151' }>│ </Text>
                    {deployCheck === 'pending' ?  <Text color="#f3a348" ><Spinner type="dots" /> </Text> : null}
                    <Text wrap='truncate' color={deployCheck === true ? "#48f381" : deployCheck === false ? "#f34848" : "#b8b8b8"} >{deployLog}</Text>
                </Box>
            </Box>
        </Box>
    );

}