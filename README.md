<!-- markdownlint-disable MD030 -->

<p align="center">
<img src="https://github.com/DtamindAI/Dtamind/blob/main/images/dtamind_white.svg#gh-light-mode-only">
<img src="https://github.com/DtamindAI/Dtamind/blob/main/images/dtamind_dark.svg#gh-dark-mode-only">
</p>

<div align="center">

[![Release Notes](https://img.shields.io/github/release/DtamindAI/Dtamind)](https://github.com/DtamindAI/Dtamind/releases)
[![Discord](https://img.shields.io/discord/1087698854775881778?label=Discord&logo=discord)](https://discord.gg/jbaHfsRVBW)
[![Twitter Follow](https://img.shields.io/twitter/follow/DtamindAI?style=social)](https://twitter.com/DtamindAI)
[![GitHub star chart](https://img.shields.io/github/stars/DtamindAI/Dtamind?style=social)](https://star-history.com/#DtamindAI/Dtamind)
[![GitHub fork](https://img.shields.io/github/forks/DtamindAI/Dtamind?style=social)](https://github.com/DtamindAI/Dtamind/fork)

English | [繁體中文](./i18n/README-TW.md) | [简体中文](./i18n/README-ZH.md) | [日本語](./i18n/README-JA.md) | [한국어](./i18n/README-KR.md)

</div>

<h3>Build AI Agents, Visually</h3>
<a href="https://github.com/DtamindAI/Dtamind">
<img width="100%" src="https://github.com/DtamindAI/Dtamind/blob/main/images/dtamind_agentflow.gif?raw=true"></a>

## 📚 Table of Contents

- [⚡ Quick Start](#-quick-start)
- [🐳 Docker](#-docker)
- [👨‍💻 Developers](#-developers)
- [🌱 Env Variables](#-env-variables)
- [📖 Documentation](#-documentation)
- [🌐 Self Host](#-self-host)
- [☁️ Dtamind Cloud](#️-dtamind-cloud)
- [🙋 Support](#-support)
- [🙌 Contributing](#-contributing)
- [📄 License](#-license)

## ⚡Quick Start

Download and Install [NodeJS](https://nodejs.org/en/download) >= 18.15.0

1. Install Dtamind
    ```bash
    npm install -g dtamind
    ```
2. Start Dtamind

    ```bash
    npx dtamind start
    ```

3. Open [http://localhost:3000](http://localhost:3000)

## 🐳 Docker

### Docker Compose

1. Clone the Dtamind project
2. Go to `docker` folder at the root of the project
3. Copy `.env.example` file, paste it into the same location, and rename to `.env` file
4. `docker compose up -d`
5. Open [http://localhost:3000](http://localhost:3000)
6. You can bring the containers down by `docker compose stop`

### Docker Image

1. Build the image locally:
   
    ```bash
    docker build --no-cache -t dtamind .
    ```
2. Run image:
   
    ```bash
    docker run -d --name dtamind -p 3000:3000 dtamind
    ```

3. Stop image:
   
    ```bash
    docker stop dtamind
    ```

## 👨‍💻 Developers

Dtamind has 3 different modules in a single mono repository.

-   `server`: Node backend to serve API logics
-   `ui`: React frontend
-   `components`: Third-party nodes integrations
-   `api-documentation`: Auto-generated swagger-ui API docs from express

### Prerequisite

-   Install [PNPM](https://pnpm.io/installation)
    ```bash
    npm i -g pnpm
    ```

### Setup

1.  Clone the repository:

    ```bash
    git clone https://github.com/DtamindAI/Dtamind.git
    ```

2.  Go into repository folder:

    ```bash
    cd Dtamind
    ```

3.  Install all dependencies of all modules:

    ```bash
    pnpm install
    ```

4.  Build all the code:

    ```bash
    pnpm build
    ```

    <details>
    <summary>Exit code 134 (JavaScript heap out of memory)</summary>  
      If you get this error when running the above `build` script, try increasing the Node.js heap size and run the script again:

        export NODE_OPTIONS="--max-old-space-size=4096"
        pnpm build

    </details>

5.  Start the app:

    ```bash
    pnpm start
    ```

    You can now access the app on [http://localhost:3000](http://localhost:3000)

6.  For development build:

    -   Create `.env` file and specify the `VITE_PORT` (refer to `.env.example`) in `packages/ui`
    -   Create `.env` file and specify the `PORT` (refer to `.env.example`) in `packages/server`
    -   Run:

        ```bash
        pnpm dev
        ```

    Any code changes will reload the app automatically on [http://localhost:8080](http://localhost:8080)

## 🌱 Env Variables

Dtamind supports different environment variables to configure your instance. You can specify the following variables in the `.env` file inside `packages/server` folder. Read [more](https://github.com/DtamindAI/Dtamind/blob/main/CONTRIBUTING.md#-env-variables)

## 📖 Documentation

You can view the Dtamind Docs [here](https://docs.dtamindai.com/)

## 🌐 Self Host

Deploy Dtamind self-hosted in your existing infrastructure, we support various [deployments](https://docs.dtamindai.com/configuration/deployment)

-   [AWS](https://docs.dtamindai.com/configuration/deployment/aws)
-   [Azure](https://docs.dtamindai.com/configuration/deployment/azure)
-   [Digital Ocean](https://docs.dtamindai.com/configuration/deployment/digital-ocean)
-   [GCP](https://docs.dtamindai.com/configuration/deployment/gcp)
-   [Alibaba Cloud](https://computenest.console.aliyun.com/service/instance/create/default?type=user&ServiceName=Dtamind社区版)
-   <details>
      <summary>Others</summary>

    -   [Railway](https://docs.dtamindai.com/configuration/deployment/railway)

        [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/pn4G8S?referralCode=WVNPD9)

    -   [Render](https://docs.dtamindai.com/configuration/deployment/render)

        [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://docs.dtamindai.com/configuration/deployment/render)

    -   [HuggingFace Spaces](https://docs.dtamindai.com/deployment/hugging-face)

        <a href="https://huggingface.co/spaces/DtamindAI/Dtamind"><img src="https://huggingface.co/datasets/huggingface/badges/raw/main/open-in-hf-spaces-sm.svg" alt="HuggingFace Spaces"></a>

    -   [Elestio](https://elest.io/open-source/dtamindai)

        [![Deploy on Elestio](https://elest.io/images/logos/deploy-to-elestio-btn.png)](https://elest.io/open-source/dtamindai)

    -   [Sealos](https://template.sealos.io/deploy?templateName=dtamind)

        [![Deploy on Sealos](https://sealos.io/Deploy-on-Sealos.svg)](https://template.sealos.io/deploy?templateName=dtamind)

    -   [RepoCloud](https://repocloud.io/details/?app_id=29)

        [![Deploy on RepoCloud](https://d16t0pc4846x52.cloudfront.net/deploy.png)](https://repocloud.io/details/?app_id=29)

      </details>

## ☁️ Dtamind Cloud

Get Started with [Dtamind Cloud](https://dtamindai.com/).

## 🙋 Support

Feel free to ask any questions, raise problems, and request new features in [Discussion](https://github.com/DtamindAI/Dtamind/discussions).

## 🙌 Contributing

Thanks go to these awesome contributors

<a href="https://github.com/DtamindAI/Dtamind/graphs/contributors">
<img src="https://contrib.rocks/image?repo=DtamindAI/Dtamind" />
</a><br><br>

See [Contributing Guide](CONTRIBUTING.md). Reach out to us at [Discord](https://discord.gg/jbaHfsRVBW) if you have any questions or issues.

[![Star History Chart](https://api.star-history.com/svg?repos=DtamindAI/Dtamind&type=Timeline)](https://star-history.com/#DtamindAI/Dtamind&Date)

## 📄 License

Source code in this repository is made available under the [Apache License Version 2.0](LICENSE.md).
"# dtamind-new" 
"# Dhari1" 
