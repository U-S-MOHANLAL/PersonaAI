# PersonaAI

**PersonaAI** is a virtual character creation and chat application built with the Nuxt framework. This repository contains the frontend UI code required to run the application.

To access the full functionality of PersonaAI, you must configure and run the backend services.

**Backend Repository:** [PersonaAI Backend Services](https://github.com/U-S-MOHANLAL/PersonaAI-backend-services)

## How to Run PersonaAI

Follow the steps below to configure and run the application locally.

### Prerequisites

Ensure the following tools are installed on your system:

- [Node.js](https://nodejs.org/) (use a version compatible with the project)
- npm (included with Node.js)
- Git (optional, if you need to clone the repository)

You will also need to configure the backend services and obtain a Google OAuth client ID if you want to enable Google login.

### Step 1: Configure the Environment Variables

Create a `.env` file in the root directory of the project.

Add the following environment variables:

```dotenv
NUXT_PUBLIC_API_BASE_URL=http://localhost:3000
NUXT_PUBLIC_DEFAULT_CHARACTER_ID=7cf12ca4-ec00-46fd-a5b7-d908beff79b4
NUXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

**Environment Variable Configuration**

| Variable | Description |
|---|---|
| `NUXT_PUBLIC_API_BASE_URL` | The base URL of the PersonaAI backend services. Update this value to match the URL where your backend is running. |
| `NUXT_PUBLIC_DEFAULT_CHARACTER_ID` | The UUID of the default character must be the same in both the PersonaAI frontend and backend services to ensure proper functionality. If you change the UUID, make sure to update it in both places.|
| `NUXT_PUBLIC_GOOGLE_CLIENT_ID` | The Google OAuth client ID used for Google login. |

**Important:** The backend URL above is an example. Ensure it matches the port and host configured in your backend services.

#### Configure the Backend Services

Before starting the frontend, set up and run the backend services.

Refer to the [PersonaAI Backend Services README](https://github.com/U-S-MOHANLAL/PersonaAI-backend-services) for instructions on configuring the environment variables, setting up the Express application, and starting the backend server.

Once the backend is running, update `NUXT_PUBLIC_API_BASE_URL` in your frontend `.env` file to point to the backend's base URL.

#### Configure Google OAuth (Optional)

If you want to enable Google login, follow these steps:

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing project.
3. Configure the OAuth consent screen as required.
4. Create an OAuth client ID with the appropriate application type.
5. Configure the authorized JavaScript origins and redirect URIs according to your application's authentication flow.
6. Copy the generated client ID into the `NUXT_PUBLIC_GOOGLE_CLIENT_ID` variable in your `.env` file.

If you do not have a Google OAuth client ID, you can configure one later. However, Google login will not work until the OAuth configuration is complete.

### Step 2: Install Dependencies

Open a terminal in the project's root directory and run:

```bash
npm install
```

This command installs the dependencies required to run the application.

### Step 3: Start the Application

After installing the dependencies, run:

```bash
npm run dev
```

This starts the Nuxt development server.

Once the server has started, open the local URL displayed in your terminal, typically:

```text
http://localhost:3000
```

**Note:** The frontend and backend may use different ports. If the backend also uses port `3000`, configure the frontend or backend to use different ports to avoid conflicts.

### Step 4: Verify the Application

After starting the application:

1. Open the frontend URL displayed in the terminal.
2. Verify that the application loads successfully.
3. Confirm that the frontend can communicate with the backend.
4. Check that the default character loads correctly.
5. Test character creation and chat functionality.
6. If Google login is configured, verify that authentication works as expected.

If any functionality fails, check the browser console and backend terminal for errors.

## Troubleshooting

### Backend Connection Issues

- Ensure the backend server is running.
- Verify that `NUXT_PUBLIC_API_BASE_URL` points to the correct backend URL.
- Check that the backend allows requests from the frontend origin through its CORS configuration.

### Google Login Issues

- Verify that `NUXT_PUBLIC_GOOGLE_CLIENT_ID` contains the correct client ID.
- Ensure the authorized JavaScript origins and redirect URIs match your application's configuration.
- Check the browser console for OAuth-related errors.

### Environment Variable Changes Not Applied

After modifying the `.env` file, restart the Nuxt development server so that the updated environment variables are loaded.

## Summary

To run PersonaAI locally:

1. Configure the `.env` file.
2. Set up and start the backend services.
3. Install the frontend dependencies using `npm install`.
4. Start the frontend using `npm run dev`.
5. Open the local URL displayed in the terminal.

**You're now ready to explore PersonaAI!**