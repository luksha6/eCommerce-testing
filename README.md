## How to Start the App

### 1. Install `serve`

If you don't have `serve` installed globally, you can install it using one of the following methods:

- Using **npm**:
  ```bash
  npm install -g serve
  ```

- Using **yarn**:
  ```bash
  yarn global add serve
  ```

- Using **brew** (macOS):
  ```bash
  brew install serve
  ```

- **For Windows**: You can install `serve` globally using npm:
  ```bash
  npm install -g serve
  ```

### 2. Start the App

Run the following command inside the project folder:

```bash
serve -s -p 8888 .
```

This will serve the app at `http://localhost:8888`.

### 3. Open the App

Open your browser and navigate to `http://localhost:8888` to start using the app.

## Project Structure

```bash
.
├── assets               # Images and assets like logos, icons
├── constants            # Contains text and constants for the app
├── services             # Contains app logic (fetching data, cart management, etc.)
├── styles               # Contains CSS files for styling
├── index.html           # The main entry point
├── README.md            # This README file
```
