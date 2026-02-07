# WSDL Viewer

A modern, client-side WSDL (Web Services Description Language) viewer built with SvelteKit and Flowbite.

![WSDL Viewer UI](https://github.com/user-attachments/assets/e4591aad-be61-4c4e-ac4b-66177baefe28)

## Features

- 🎨 Clean, modern UI built with Flowbite components
- 📁 Multiple input methods:
  - Upload WSDL files (.wsdl, .xml)
  - Load from URL
  - Paste WSDL content directly
- 📊 Organized view of WSDL structure:
  - Services
  - Operations
  - Types
  - Messages
- 💻 Fully client-side - no backend required
- 🎯 Built with TypeScript for type safety
- ⚡ Fast and responsive

## Tech Stack

- **SvelteKit** - Modern web framework
- **Flowbite** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or your preferred package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/vibecoding-inc/wsdl-viewer.git
cd wsdl-viewer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

4. Open your browser and navigate to `http://localhost:5173`

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

The built files will be in the `build` directory, ready to be deployed to any static hosting service.

## Project Structure

```
wsdl-viewer/
├── src/
│   ├── lib/
│   │   └── components/
│   │       ├── Header.svelte          # Navigation header
│   │       ├── FileUpload.svelte      # WSDL input component
│   │       ├── WsdlSidebar.svelte     # Navigation sidebar
│   │       └── WsdlViewer.svelte      # Main viewer component
│   └── routes/
│       ├── +layout.svelte             # Root layout
│       ├── +layout.ts                 # Layout configuration
│       └── +page.svelte               # Home page
├── static/                             # Static assets
└── tailwind.config.js                 # Tailwind configuration
```

## Usage

1. **Upload a WSDL file**: Click the file upload button and select a `.wsdl` or `.xml` file
2. **Load from URL**: Enter a URL to a WSDL document and click "Load"
3. **Paste content**: Paste WSDL XML content directly into the text area and click "Parse"

Once loaded, you can navigate through the WSDL structure using the tabs:
- **Services**: View available services and their endpoints
- **Operations**: Browse all operations defined in the WSDL
- **Types**: Explore data type definitions
- **Messages**: View message structures

## Development Roadmap

- [x] Basic UI implementation
- [ ] WSDL parser implementation
- [ ] Real-time WSDL validation
- [ ] Export functionality
- [ ] Search and filter capabilities
- [ ] Dark mode support
- [ ] Save/load WSDL history

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

