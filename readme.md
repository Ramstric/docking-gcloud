# Docking-GCloud

A TUI tool for automating the build of Docker images, push to Google Cloud Artifact Registry and deployment of a Google Cloud Run Service.

## Prerequisites

- [Docker](https://www.docker.com/)
- [gcloud CLI](https://cloud.google.com/sdk/docs/install)
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/)
- A Google Cloud Platform account with appropriate permissions

## Installation

1. Clone the repository:
  ```bash
  git clone https://github.com/Ramstric/docking-gcloud.git
  cd docking-gcloud
  ```
2. Install Node.js dependencies:
  ```bash
  npm i
  npm link
  ```

## Usage

1. Set up Google Cloud CLI:
  ```bash
  gcloud auth login
  gcloud config set project YOUR_PROJECT_ID
  gcloud config set compute/region REGION
  ```

2. Enable the API for Artifact Registry:
  ```bash
  gcloud services enable artifactregistry.googleapis.com
  ```

3. Configure authentication for Docker and Google Cloud:
  ```bash
  gcloud auth configure-docker
  gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin https://[REGION]-docker.pkg.dev
  ```

4. Run the tool:
  ```bash
  docking-gcloud
  ```

## Uninstall

Just remove the symbolic link / package:
  ```bash
  npm r docking-gcloud -g
  ```

## Project Structure

```
.
├─── hooks
│       NavigationMenu.tsx
│       UtilsYAML.tsx
│
└─── source
     │   app.tsx
     │   cli.tsx
     │
     └─── components
          ├───BuildDeployMenu
          │       BuildDeployMenu.tsx
          │
          ├───LogMenu
          │       LogMenu.tsx
          │
          ├───SetupMenu
          │       SetupMenu.tsx
          │       SetupSection.tsx
          │
          ├───Tooltip
          │       Tooltip.tsx
          │
          └───types
                  index.ts
```

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

## License

This project is licensed under the [MIT License](LICENSE).
