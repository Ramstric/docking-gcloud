import React from 'react';
import { Box, Text } from 'ink';

import Spinner from 'ink-spinner';

import {checkState} from '../types/index.js';

type logTasksProps = Record<
    | 'setupCheck'
    | 'authCheck'
    | 'projectCheck'
    | 'registryCheck'
    | 'buildCheck'
    | 'pushCheck'
    | 'deployCheck',
    checkState
>;

export default function LogTasks({ setupCheck, authCheck, projectCheck, registryCheck, buildCheck, pushCheck, deployCheck }: logTasksProps) {
    
    // TODO: Support for Nerd Fonts
    /*
    const dockerDisabled = () => {
        return (
            <Box>
                <Text color='#6e6e6e'>● </Text>
                <Box>
                    <Text color='#6e6e6e'>{"\ue0b6"}</Text>
                    <Text backgroundColor='#6e6e6e'>Docker {"\uf21f"} </Text>
                    <Text color='#6e6e6e'>{"\ue0b4"}</Text>
                </Box>
                <Text color='#6e6e6e'> image</Text>
            </Box>
        );
    }
    */

    return (
        <Box flexDirection="column" borderStyle="round" borderColor="#b8b8b8" paddingLeft={1} paddingRight={1}>

            
            {setupCheck ? <Text color="#48f381">● Configuration setup</Text> : <Text color="#6e6e6e">◌ Configuration setup</Text>}

            
            { authCheck === 'pending' ? ( <Text color="#f3a348"><Spinner type="triangle" /> GCloud authentification</Text> )
            : authCheck ? ( <Text color="#48f381">● GCloud authentification</Text> )
            : ( <Text color="#6e6e6e">◌ GCloud authentification</Text> ) }

            {projectCheck === 'pending' ? ( <Text color="#f3a348"><Spinner type="triangle" /> GCloud project setup</Text> )
            : projectCheck ? ( <Text color="#48f381">● GCloud project set</Text> )
            : ( <Text color="#6e6e6e">◌ GCloud project set</Text> ) }

            {registryCheck === 'pending' ? ( <Text color="#f3a348"><Spinner type="triangle" /> Artifact Registry creation</Text> )
            : registryCheck ? ( <Text color="#48f381">● Artifact Registry created</Text> )
            : ( <Text color="#6e6e6e">◌ Artifact Registry created</Text> ) }


            { buildCheck === 'pending' ? ( <Text color="#f3a348"><Spinner type="triangle" /> Docker image build</Text> )
            : buildCheck ? ( <Text color="#48f381">● Docker image built</Text> )
            : ( <Text color="#6e6e6e">◌ Docker image built</Text> ) }

            {pushCheck === 'pending' ? ( <Text color="#f3a348"><Spinner type="triangle" /> Image pushing</Text> )
            : pushCheck ? ( <Text color="#48f381">● Image pushed</Text> )
            : ( <Text color="#6e6e6e">◌ Image pushed</Text> ) }

            {deployCheck === 'pending' ? ( <Text color="#f3a348"><Spinner type="triangle" /> Cloud Run deployment</Text> )
            : deployCheck ? ( <Text color="#48f381">● Cloud Run deployed</Text> )
            : ( <Text color="#6e6e6e">◌ Cloud Run deployed</Text> ) }

        </Box>
    );

}