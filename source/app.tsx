import fs from 'fs';
import {execa} from 'execa';

import React, {useEffect, useState} from 'react';
import {useApp, useInput, Box, Text} from 'ink';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';

import SetupMenu from './components/QuickSetup/QuickSetup.js';
import LogTasks from './components/LogTasks/LogTasks.js';
import Tooltip from './components/Tooltip/Tooltip.js';

import {Config, readYamlFile} from '../hooks/UtilsYAML.js';

const YAML_FILE_NAME = 'gcloudDeploy.yaml';

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

export default function App() {
	const [currentView, setCurrentView] = useState<'menu' | 'setup'>('menu');

	const [loadedYAML, setLoadedYaml] = useState<Config>({ docker: { image_name: '', tag: '' }, google_cloud: { project_id: '', region: '' }, artifact_registry: { repository: '' }, cloud_run: { service: '' } });
	const [setupCheck, setSetupCheck] = useState<boolean>(false);
	
	const [authCheck, setAuthCheck] = useState<boolean>(false);
	const [projectCheck, setProjectCheck] = useState<boolean>(false);
	const [registryCheck, setRegistryCheck] = useState<boolean>(false);

	const [buildCheck, setBuildCheck] = useState<boolean>(false);
	const [pushCheck, setPushCheck] = useState<boolean>(false);
	const [deployCheck, setDeployCheck] = useState<boolean>(false);
	

	// Check if the YAML file exists and read it if it does
		// If the file exists, read it and set the loaded YAML state
		// If the file does not exist, it will be created later
	if (fs.existsSync(YAML_FILE_NAME) && !setupCheck ) {
		readYamlFile(YAML_FILE_NAME, setLoadedYaml)
		.then(() => {
			setSetupCheck(true);	// Successfully loaded YAML file
		})
		.catch(() => {
		});
	}

	const tasksList = [
		{
			state: setAuthCheck,
			command: 'gcloud',
			options: ['config', 'get-value', 'account'],
		},
		{
			state: setProjectCheck,
			command: 'gcloud',
			options: ['projects', 'describe', loadedYAML.google_cloud.project_id],
		},
		{
			state: setRegistryCheck,
			command: 'gcloud',
			options: ['artifacts', 'repositories', 'describe', loadedYAML.artifact_registry.repository, '--location', loadedYAML.google_cloud.region ],
		},
		{
			state: setBuildCheck,
			command: 'docker',
			options: ['images', '-q', `${loadedYAML.google_cloud.region}-docker.pkg.dev/${loadedYAML.google_cloud.project_id}/${loadedYAML.artifact_registry.repository}/${loadedYAML.docker.image_name}:${loadedYAML.docker.tag}`],
		},
		{
			state: setPushCheck,
			command: 'gcloud',
			options: ['artifacts', 'docker', 'images', 'list', `${loadedYAML.google_cloud.region}-docker.pkg.dev/${loadedYAML.google_cloud.project_id}/${loadedYAML.artifact_registry.repository}`],
		},
		{
			state: setDeployCheck,
			command: 'gcloud',
			options: ['run', 'services', 'describe', loadedYAML.cloud_run.service, '--region', loadedYAML.google_cloud.region],
		},
	];
	
	useEffect(() => {
		if (currentView === 'menu' && setupCheck) {
			tasksList.forEach(async (task) => {
				try {
					const {stdout} = await execa(task.command, task.options);
					if (stdout) {
						task.state(true);
					} else {
						task.state(false);
					}
				} catch (error) {
					task.state(false);
				}
			});
		}
		/*
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
		*/
	}, [setupCheck]);

	const {exit} = useApp();

	useInput(async (_input, key) => {
		if (key.escape) {
			exit();
		}
	});

	useInput(
		async (input, _key) => {
			if (input === 'q') {
				setCurrentView('setup');
			}
		},
		{isActive: currentView === 'menu'},
	);

	const currentHint = () => {
		if (!setupCheck){
			return (
				<Box flexDirection="column">
					<Text color="white">Looks like it's your first time here.</Text>
					<Text color="white">First, you need to setup your deploy config!</Text>
				</Box>
			)
		} else {
			return (
				<Box flexDirection="column">
					<Text color="white">Welcome back!</Text>
					<Text color="white">You can now build and deploy your Docker image to Google Cloud.</Text>
				</Box>
			)
		}
	}
	
	function tabSample( title: string, titleColor: string, borderColor: string, currentView: string, key: string ) {
		const isActive = currentView === key;

		return (
			<Box width={16} justifyContent='center' height={2} /*marginTop={isActive ? -1 : 0}*/
				borderStyle="single"
				borderBottom={!isActive} borderTop={isActive} borderLeft={false} borderRight={false}
				borderColor={borderColor}
			>
				<Text color={titleColor}>
					{title}
				</Text>
			</Box>
		)
	}

	const currentMenu = () => {
		switch (currentView) {
			case 'setup':
				return <SetupMenu setSetupCheck={setSetupCheck} setCurrentView={setCurrentView} loadedYaml={loadedYAML} setLoadedYaml={setLoadedYaml} />;
			case 'menu':
				return <LogTasks
							setupCheck={setupCheck}
							authCheck={authCheck}
							projectCheck={projectCheck}
							registryCheck={registryCheck}
							buildCheck={buildCheck}
							pushCheck={pushCheck}
							deployCheck={deployCheck}
						/>
			default:
				return (
					<Box flexDirection="column" alignItems="center" justifyContent="center" gap={1}>
						<Text color="#b8b8b8">Unknown view</Text>
					</Box>
				);
		}
	}

	const currentTooltip = Tooltip({ currentView: currentView, primaryColor: '#4aaeff', secondaryColor: '#808080' });

	return (
		<Box flexDirection="column" alignItems="center" justifyContent="center" gap={1} borderStyle="round" borderColor='#212121'>
			<Box flexDirection="column" gap={0} width="100%" alignItems="center" justifyContent="center">
				<Gradient colors={heroGradient}>
					<BigText font="tiny" text="Docker to GCloud" />
				</Gradient>

				{currentHint()}
			</Box>

			<Box width="100%" gap={6} justifyContent="center">
				{tabSample("Setup", "#4aaeff", "#0c4370", currentView, "setup")}
				{tabSample("Main menu", "#ff564a", "#70130c", currentView, "menu")}
				{tabSample("Build & Deploy", "#f3ff4a", "#705c0c", currentView, "build")}
			</Box>

			<Box width='80%' marginTop={-1} borderStyle="single" borderColor="#0c4370" borderLeft={false} borderRight={false} borderBottom={false} >
			</Box>

			{currentMenu()}

			<Box width="100%" justifyContent='center'>
				{currentTooltip}
			</Box>
		</Box>
	);
}
