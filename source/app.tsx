import React, { useEffect, useState } from 'react';

import { useApp, useInput, Box, Text } from 'ink';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';

import QuickConfig from './components/QuickSetup/QuickSetup.js';
import LogTasks from './components/LogTasks/LogTasks.js';

import { readConfigFromYamlFile } from '../hooks/UtilsYAML.js';

import {execa} from 'execa';

const runCommand = async (command: string) => {
	const trimmedCommand = command.trim();

	if (!trimmedCommand) {
		return {stdout: '', stderr: 'Empty command provided'};
	}

	try {
		const parts = trimmedCommand.split(' ').filter(Boolean);

		const [cmd, ...args] = parts;

		if (!cmd) {
			return {stdout: '', stderr: 'No command provided'};
		}

		const result = await execa(cmd, args);
		return {stdout: result.stdout, stderr: result.stderr};
	} catch (error: any) {
		return {stdout: '', stderr: error.message};
	}
};

const heroGradient = [
	'#ff6b6b',
	'#f06595',
	'#f7b267',
	'#f7e967',
	'#6bcb77',
	'#4d96ff',
	'#a0c4ff',
	'#b9fbc0',
];

const tooltipColor = '#b1b1b1';

export default function App() {
	const [currentMode, setCurrentMode] = useState<'menu' | 'config'>( 'menu',);

	const [configDone, setConfigDone] = useState<boolean>(false);
	const [imageBuilt, _setImageBuilt] = useState<boolean>(false);
	const [gcloudAuth, _setGcloudAuth] = useState<boolean>(false);
	const [_gcloudProject, _setGcloudProject] = useState<boolean>(false);
	const [artifactRegistryCreated, _setArtifactRegistryCreated] = useState<boolean>(false);
	const [imagePushed, _setImagePushed] = useState<boolean>(false);
	const [cloudRunDeployed, _setCloudRunDeployed] = useState<boolean>(false);

	async function verifyConfiguration(config: any) {
		const commands = [
			{
				name: 'Docker Image Check',
				command: `docker images -q ${config.google_cloud.region}-docker.pkg.dev/${config.google_cloud.project_id}/${config.artifact_registry.repository}/${config.docker.image_name}:${config.docker.tag}`,
				setter: _setImageBuilt,
				checkExists: (stdout: string) => stdout.trim() !== '',
			},
			{
				name: 'Google Cloud Project Check',
				command: `gcloud projects describe ${config.google_cloud.project_id}`,
				setter: _setGcloudProject,
				checkExists: (stdout: string) => !!stdout,
			},
			{
				name: 'Artifact Registry Check',
				command: `gcloud artifacts repositories describe ${config.artifact_registry.repository} --location=${config.google_cloud.region}`,
				setter: _setArtifactRegistryCreated,
				checkExists: (stdout: string) => !!stdout,
			},
			{
				name: 'Docker Images in Registry Check',
				command: `gcloud artifacts docker images list ${config.google_cloud.region}-docker.pkg.dev/${config.google_cloud.project_id}/${config.artifact_registry.repository}`,
				setter: _setImagePushed,
				checkExists: (stdout: string) => !!stdout,
			},
			{
				name: 'Cloud Run Service Check',
				command: `gcloud run services describe ${config.cloud_run.service} --region=${config.google_cloud.region}`,
				setter: _setCloudRunDeployed,
				checkExists: (stdout: string) => !!stdout,
			},
		];

		for (const {name, command, setter, checkExists} of commands) {
			try {
				const result = await runCommand(command);
				const exists = checkExists(result.stdout);
				setter(exists);
			} catch (err: any) {
				console.error(`${name} failed: ${err.message}`);
				setter(false);
			}
		}
	}

	useEffect(() => {
		runCommand('gcloud projects list')
			.then(() => {
				_setGcloudAuth(true);

				runCommand('gcloud config get-value account')
					.then(result => {
						console.log(`Active account: ${result.stdout.trim()}`);
					})
					.catch(error => {
						console.error(`Failed to get active account: ${error.message}`);
					});
			})
			.catch(() => {
				_setGcloudAuth(false);
			});

		readConfigFromYamlFile('gcloudDeploy.yaml')
			.then(config => {
				if (
					config.docker?.image_name &&
					config.docker?.tag &&
					config.google_cloud?.project_id &&
					config.google_cloud?.region &&
					config.artifact_registry?.repository &&
					config.cloud_run?.service
				) {
					setConfigDone(true);

					verifyConfiguration(config);
				} else {
					setConfigDone(false);
				}
			})
			.catch(() => {
				setConfigDone(false);
			});
	}, [currentMode]);

	const [writingYamlFile, setWritingYamlFile] = useState<boolean>(false);

	const {exit} = useApp();

	useInput(async (_input, key) => {
		if (key.escape) {
			exit();
		}
	});

	useInput(
		async (input, _key) => {
			if (input === '1') {
				runCommand('dir');
			} else if (input === 'q') {
				setWritingYamlFile(true);
				setCurrentMode('config');
			} else if (input === 'e') {
			}
		},
		{isActive: currentMode === 'menu'},
	);

	const currentMenu = () => {
		switch (currentMode) {
			case 'menu':
				return (
					<Box flexDirection="row" width="100%" justifyContent="center" gap={2}>
						<LogTasks
							configDone={configDone}
							imageBuilt={imageBuilt}
							gcloudAuth={gcloudAuth}
							artifactRegistryCreated={artifactRegistryCreated}
							imagePushed={imagePushed}
							cloudRunDeployed={cloudRunDeployed}
						/>
					</Box>
				);
			case 'config':
				return (
					<QuickConfig
						currModeHandler={setCurrentMode}
						configBtnHandler={setWritingYamlFile}
						configDoneHandler={setConfigDone}
					/>
				);
			default:
				return (
					<Box
						flexDirection="column"
						alignItems="center"
						justifyContent="center"
						gap={1}
					>
						<Text color="#b8b8b8">Unknown mode</Text>
					</Box>
				);
		}
	};

	const currentTooltip = () => {
		switch (currentMode) {
			case 'menu':
				return (
					<Text color={tooltipColor}>
						↑/↓ Navigate <Text color="#4aaeff">Enter</Text> Select{' '}
						<Text color="#4aaeff">ESC</Text> Quit <Text color="#4aaeff">Q</Text>{' '}
						Setup <Text color="#4aaeff">E</Text> Build & Deploy
					</Text>
				);
			case 'config':
				return (
					<Text color={tooltipColor}>
						↑/↓ Navigate <Text color="#4aaeff">Enter</Text> Submit{' '}
						<Text color="#4aaeff">ESC</Text> Quit
					</Text>
				);
			default:
				return <Text color="#b8b8b8">Unknown mode</Text>;
		}
	};

	return (
		<Box
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			gap={1}
		>
			<Box
				flexDirection="column"
				gap={0}
				width="100%"
				alignItems="center"
				justifyContent="center"
			>
				<Gradient colors={heroGradient}>
					<BigText font="tiny" text="Docker to GCloud" />
				</Gradient>
				<Text color="white">
					Select an{' '}
					<Text italic bold>
						option
					</Text>{' '}
					or just run the{' '}
					<Text italic bold>
						quick setup & deploy!
					</Text>
				</Text>
			</Box>

			<Box width="100%" gap={6} justifyContent="center">
				<Box
					borderStyle="round"
					borderColor={writingYamlFile ? '#0c4370' : '#4aaeff'}
					paddingLeft={1}
					paddingRight={1}
					height={3}
				>
					<Text color={writingYamlFile ? '#0c4370' : '#4aaeff'}> Setup config </Text>
				</Box>

				<Box
					borderStyle="round"
					borderColor="#b8b8b8"
					paddingLeft={1}
					paddingRight={1}
					height={3}
				>
					<Text color="#b8b8b8">Build and Deploy</Text>
				</Box>
			</Box>

			{currentMenu()}

			{currentTooltip()}
		</Box>
	);
}
