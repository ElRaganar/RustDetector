# RustDetector Frontend: Pages and Routing

This document details the frontend page structure and routing within the RustDetector application. The application utilizes React Router DOM for navigation, providing a seamless user experience across different functionalities.

## Core Routing (`src/App.tsx`)

The `App.tsx` file serves as the central hub for defining the application's routes. It uses `react-router-dom` to manage navigation between various pages and authenticated states. The primary routes are:

| Path                 | Component(s)                                   | Authentication Required |
| :------------------- | :--------------------------------------------- | :---------------------- |
| `/`                  | `Landing`                                      | No                      |
| `/sign-in/*`         | `SignIn` (redirects to `/dashboard`)           | No                      |
| `/sign-up/*`         | `SignUp` (redirects to `/dashboard`)           | No                      |
| `/dashboard`         | `Dashboard`                                    | Yes                     |
| `/dashboard/scans`   | `RecentScans` (nested within `Dashboard`)      | Yes                     |
| `/dashboard/fileselector` | `FileSelector` (nested within `Dashboard`) | Yes                     |
| `/dashboard/dragdrop` | `DragandDrop` (nested within `Dashboard`)    | Yes                     |
| `/dashboard/camera`  | `CameraCapture` (nested within `Dashboard`)    | Yes                     |
| `/dashboard/results` | `Result` (nested within `Dashboard`)           | Yes                     |

## Page Components (`src/pages/`)

The `src/pages` directory contains the main components that represent different views or functionalities of the application. These are organized to reflect distinct user interactions.

### Top-Level Pages

*   **`Landing.tsx`**: The initial entry point for unauthenticated users, likely showcasing the application's purpose and features.
*   **`AIProcessingScreen.tsx`**: Displays a loading or progress indicator while the AI backend processes uploaded images.
*   **`ResultPage.tsx`**: Renders the detailed results of the rust detection, including visualizations and recommended actions.

### Dashboard Sub-Pages (`src/pages/dashboard/`)

These components are typically rendered within the authenticated dashboard layout:

*   **`Dashboard.tsx`**: The main dashboard view, acting as a container for other dashboard-related components.
*   **`RecentScans.tsx`**: Displays a list of the user's past rust detection scans.
*   **`StatsPanel.tsx`**: Likely shows statistical data related to rust detection or user activity.
*   **`UploadCard.tsx`**: Provides an interface for users to upload images.

### Image Upload/Capture Related Pages

These pages facilitate the process of getting images into the system for AI analysis:

*   **`ChooseUpload.tsx`**: Allows users to select their preferred method of image upload (e.g., file selection, drag-and-drop, camera).
*   **`FileSelector.tsx`**: Enables users to browse and select image files from their local system.
*   **`DragandDrop.tsx`**: Provides a drag-and-drop interface for image uploads.
*   **`CameraPermission.tsx`**: Handles requesting and managing camera access permissions.
*   **`CameraCapture.tsx`**: Allows users to capture images directly using their device's camera.
*   **`CameraReview.tsx`**: Displays a preview of the captured image before submission.
*   **`ImageValidation.tsx`**: Likely handles client-side validation of image files.
*   **`ImagepreviewPanel.tsx`**: A component for displaying image previews.
*   **`ProgressScreen.tsx`**: A generic screen to show progress during operations.

### Other Components

*   **`Header.tsx`**: A common header component used across multiple pages.
*   **`FileCard.tsx`**: A reusable component for displaying individual file information.
*   **`DropZone.tsx`**: A component for handling drag-and-drop functionality.
*   **`DropZoneContent.tsx`**: Content displayed within the drop zone.
*   **`Scancard.tsx`**: A component likely used to display individual scan results.
*   **`SummaryBar.tsx`**: A bar displaying summary information.
*   **`browsefile.tsx`**: A component related to file browsing.
*   **`cameracard.tsx`**: A component related to camera functionality.

## Authentication Flow

The application uses Clerk for authentication. Users are directed to `SignIn` or `SignUp` pages, and upon successful authentication, they are redirected to the `/dashboard` route. Access to dashboard-related routes (`/dashboard/*`) requires a signed-in user.

## Navigation Example

1.  **Initial Access**: User navigates to `/` and sees the `Landing` page.
2.  **Authentication**: User clicks 
on "Sign In" and is taken to `/sign-in`. After successful login, they are redirected to `/dashboard`.
3.  **Dashboard Interaction**: From the dashboard, the user might click on "Upload Image", leading them to `/dashboard/fileselector` or `/dashboard/dragdrop` depending on the chosen method.
4.  **Processing and Results**: After uploading, the user might see the `AIProcessingScreen` and then be directed to `/dashboard/results` to view the `ResultPage`.

## Development

When developing new features or pages, ensure that new routes are properly defined in `App.tsx` and that appropriate authentication checks are in place where necessary. Page components should be placed in the `src/pages` directory, with sub-directories for related functionalities (e.g., `src/pages/dashboard`).

## Conclusion

This routing structure provides a clear and organized way to manage the application's navigation, ensuring a smooth and intuitive experience for the user. The modular design of the page components allows for easy maintenance and scalability.

