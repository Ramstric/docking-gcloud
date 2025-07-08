import path from 'path';
import fs from 'fs/promises';
import yaml from 'js-yaml';
import { z } from 'zod';

const configSchema = z.object({
  docker: z.object({
    project_path: z.string().trim().nonempty(),
    image_name: z.string().trim().nonempty(),
    tag: z.string().trim().nonempty()
  }),
  google_cloud: z.object({
    project_id: z.string().trim().nonempty(),
    region: z.string().trim().nonempty()
  }),
  artifact_registry: z.object({
    repository: z.string().trim().nonempty()
  }),
  cloud_run: z.object({
    service: z.string().trim().nonempty()
  })
});

type Config = z.infer<typeof configSchema>;

async function writeYamlFile(fileName: string, loadedYaml: Config): Promise<void> {
  try {
    const yamlContent = yaml.dump(loadedYaml, {
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

async function readYamlFile(fileName: string, setLoadedYaml: React.Dispatch<React.SetStateAction<Config>>): Promise<Config> {
  try {
    const filePath = path.join(process.cwd(), fileName);
    const fileContent = await fs.readFile(filePath, 'utf8');
    const loadedYaml = yaml.load(fileContent) as Config;

    if (configSchema.safeParse(loadedYaml).error) {
      throw new Error(`Invalid YAML structure in ${fileName}`);
    }
    
    setLoadedYaml(loadedYaml);

    return loadedYaml;
  } catch (error: any) {
    throw new Error(`Failed to read YAML file: ${error.message}`);
  }
}

export { Config, configSchema, writeYamlFile, readYamlFile };