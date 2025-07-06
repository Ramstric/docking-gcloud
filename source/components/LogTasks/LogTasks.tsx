import React from 'react';
import { Box, Text } from 'ink';

export default function LogTasks({ configDone, imageBuilt, gcloudAuth, artifactRegistryCreated, imagePushed, cloudRunDeployed } : { configDone: boolean, imageBuilt: boolean, gcloudAuth: boolean, artifactRegistryCreated: boolean, imagePushed: boolean, cloudRunDeployed: boolean }) {
    
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
            {configDone ? <Text color="#48f381">● Configuration setup</Text> : <Text color="#6e6e6e">◌ Configuration setup</Text>}
            {imageBuilt ? <Text color="#48f381">● Docker image - built</Text> : <Text color="#6e6e6e">◌ Docker image - built</Text>}
            {gcloudAuth ? <Text color="#48f381">● GCloud authentification</Text> : <Text color="#6e6e6e">◌ GCloud authentification</Text>}
            {artifactRegistryCreated ? <Text color="#48f381">● Artifact Registry - created</Text> : <Text color="#6e6e6e">◌ Artifact Registry - created</Text>}
            {imagePushed ? <Text color="#48f381">● Image - pushed to -</Text> : <Text color="#6e6e6e">◌ Image - pushed to -</Text>}
            {cloudRunDeployed ? <Text color="#48f381">● Cloud Run deployed</Text> : <Text color="#6e6e6e">◌ Cloud Run deployed</Text>}
        </Box>
    );

}