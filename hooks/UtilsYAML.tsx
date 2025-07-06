import path from 'path';
import fs from 'fs/promises';
import yaml from 'js-yaml';


type Config = {
  docker: {
    image_name?: string;
    tag?: string;
  };
  google_cloud: {
    project_id?: string;
    region?: string;
  };
  artifact_registry: {
    repository?: string;
  };
  cloud_run: {
    service?: string;
  };
};

const config: Config = {
  docker: {},
  google_cloud: {},
  artifact_registry: {},
  cloud_run: {}
};

function setParameter(paramName: string, paramValue: string) {
  switch (paramName) {
    case 'dockerImageName':
      config.docker.image_name = paramValue;
      break;
    case 'dockerImageTag':
      config.docker.tag = paramValue;
      break;
    case 'gcloudProjectID':
      config.google_cloud.project_id = paramValue;
      break;
    case 'gcloudRegion':
      config.google_cloud.region = paramValue;
      break;
    case 'arRepository':
      config.artifact_registry.repository = paramValue;
      break;
    case 'gcrService':
      config.cloud_run.service = paramValue;
      break;
    default:
      throw new Error(`Unknown parameter: ${paramName}`);
  }
}

function setParameters(parameters: {property: string, value: string }[]) {
  parameters.forEach( ({ property, value }) => {
      setParameter(property, value);
  });
}

async function writeConfigToYamlFile(fileName: string) {
  try {
    const yamlContent = yaml.dump(config, {
      indent: 2,
      lineWidth: -1,
      noRefs: true
    });

    const filePath = path.join(process.cwd(), fileName);

    await fs.writeFile(filePath, yamlContent, 'utf8');
  } catch (error: any) {    
    throw new Error(`Failed to write YAML file: ${error.message}`);
  }
}

async function readConfigFromYamlFile(fileName: string): Promise<Config> {
  try {
    const filePath = path.join(process.cwd(), fileName);
    const fileContent = await fs.readFile(filePath, 'utf8');

    return yaml.load(fileContent) as Config;
  } catch (error: any) {
    throw new Error(`Failed to read YAML file: ${error.message}`);
  }
}

export { setParameters, writeConfigToYamlFile, readConfigFromYamlFile };