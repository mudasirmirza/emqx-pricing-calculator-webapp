# EMQX Serverless Pricing Calculator

## Overview

The EMQX Serverless Pricing Calculator is a Node.js web application designed to
calculate the monthly cost of connecting IoT devices to an EMQX serverless MQTT broker provided by [EMQX](https://emqx.com). This app provides users with an intuitive interface to input device parameters, message frequencies, and message sizes, and it calculates the costs based on EMQX's pricing model. The application is built using **Express** for backend services and uses **Bootstrap** for styling the frontend.

## Features

- Add multiple configurations for IoT devices, including message frequency and size.
- Select units for frequency (seconds or minutes) and message size (KB or Bytes).
- Calculate the monthly cost for session minutes, message traffic, and rule actions.
- Clean and responsive web UI using Bootstrap.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Project Structure](#project-structure)
4. [Deployment](#deployment)
5. [Configuration](#configuration)
6. [Technologies Used](#technologies-used)
7. [Contributing](#contributing)
8. [License](#license)

## Installation

To get started with the EMQX Pricing Calculator locally, follow the steps below:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/mudasirmirza/emqx-pricing-calculator-webapp.git
   cd emqx-pricing-calculator-webapp
   ```

2. **Install Dependencies**:

   Make sure you have **Node.js** and **npm** installed. Then, run:

   ```bash
   npm install
   ```

3. **Create a `.gitignore` File**:

   Ensure that the `node_modules` directory is excluded by adding the following to your `.gitignore` file:

   ```
   node_modules/
   .env
   npm-debug.log*
   yarn-debug.log*
   .vscode/
   .DS_Store
   ```

4. **Run the Application**:

   Start the server using the following command:

   ```bash
   npm start
   ```

5. **Access the Application**:

   Open your browser and go to `http://localhost:3000`.

## Usage

1. **Enter Device Parameters**: Start by entering the number of IoT devices you have connected to the EMQX server.
2. **Add Message Configurations**: Add multiple configurations for message frequency and size, selecting units for frequency (per second or per minute) and message size (KB or Bytes).
3. **Calculate Pricing**: Click "Calculate Pricing" to get the detailed cost summary.

The application will calculate the following costs based on the EMQX pricing model:
- **Session Minutes Cost**
- **Traffic Cost**
- **Rule Actions Cost**
- **Total Monthly Cost**

## Project Structure

```
.
├── api
│   └── server.js         # Main server code (modified for serverless deployment)
├── public
│   └── index.html        # HTML form for user input
├── package.json          # Dependencies and scripts
├── .gitignore            # Files and directories to ignore
└── README.md             # Project documentation
```

## Deployment

### Deploying to Vercel

The EMQX Pricing Calculator can be easily deployed to **Vercel** for serverless hosting.

1. **Create an Account on Vercel**: Go to [Vercel](https://vercel.com) and sign up using your GitHub account.
2. **Import Your Repository**: Create a new project in Vercel and import your GitHub repository.
3. **Configure Settings**:
   - **Build Command**: `npm install`
   - **Output Directory**: `public`
   - **Start Command**: No start command is required; Vercel handles this.
4. **Deploy**: Click "Deploy" and Vercel will build and deploy your app automatically.

After deployment, Vercel will provide a public URL where your app will be accessible.

## Configuration

### `package.json` Configuration for Vercel

Your `package.json` should include the following scripts for Vercel to properly build and serve the application:

```json
{
  "name": "emqx-pricing-calculator-webapp",
  "version": "1.0.0",
  "description": "",
  "main": "api/server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node api/server.js",
    "vercel-build": "npm install"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.21.1",
    "serverless-http": "^3.2.0"
  }
}
```

- The `"start"` script is used to run the application locally.
- The `"vercel-build"` script will ensure that all dependencies are installed before deployment.

## Technologies Used

- **Node.js**: JavaScript runtime for the backend server.
- **Express**: Framework for building the web server.
- **Bootstrap**: Frontend framework for responsive styling.
- **Vercel**: Serverless deployment platform.
- **serverless-http**: Middleware for running Express apps as serverless functions.

## Contributing

Contributions are welcome! Please follow the steps below to contribute:

1. **Fork the Repository**: Click the "Fork" button on the top of the GitHub page.
2. **Clone the Forked Repository**:

   ```bash
   git clone https://github.com/mudasirmirza/emqx-pricing-calculator-webapp.git
   ```

3. **Create a New Branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Changes and Commit**:

   ```bash
   git add .
   git commit -m "Add your feature description"
   ```

5. **Push to Your Branch**:

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**: Go to the original repository and open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

