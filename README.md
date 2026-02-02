# Habit Tracker MCP Server

A Model Context Protocol (MCP) server implementation that enables AI assistants like Claude to track, store, and analyze user habits and daily activities through intelligent conversation.

## Project Purpose

**This project is intended to help understand the MCP structure and serve as practice for future projects.**

## Overview

The Habit Tracker MCP Server provides a structured interface for AI assistants to interact with a local habit tracking database. Users can log daily activities (exercise, reading, water consumption, etc.) through natural conversation with Claude, and the AI can retrieve and analyze this data to provide insights and tracking capabilities.

## Key Features

- **Conversational Habit Logging**: Add habits through natural language interaction with Claude
- **Persistent Storage**: Local JSON-based database using LowDB
- **Flexible Tracking**: Support for any type of habit with customizable units
- **Data Retrieval**: Query and analyze stored habits through the AI assistant
- **Timestamped Entries**: Automatic timestamp recording for each habit entry

## Technical Architecture

### Core Components

1. **MCP Server** (`index.js`)
   - Implements the Model Context Protocol server using `@modelcontextprotocol/sdk`
   - Handles tool registration and execution
   - Manages communication with Claude through stdio transport
   - Provides two main tools: `add_habit` and `get_habits`

2. **Database Layer** (`db.js`)
   - Uses LowDB for lightweight JSON-based data persistence
   - Manages `data.json` file for storing habits
   - Provides asynchronous database access through `getDb()` function
   - Initializes with default structure: habits array and user profile

3. **Data Storage** (`data.json`)
   - JSON file storing all habit entries
   - Schema includes: id, name, amount, unit, date
   - Automatically created and managed by LowDB

### Technology Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Model Context Protocol SDK v1.25.3
- **Database**: LowDB v7.0.1 (JSON file-based database)
- **Transport**: Standard I/O (stdio) for MCP communication

## Available Tools

### 1. add_habit

Adds a new habit or daily activity to the tracker.

**Parameters:**
- `name` (string, required): Name of the activity (e.g., "Drinking Water", "Exercise", "Reading")
- `amount` (number, required): Numerical value of the activity
- `unit` (string, required): Unit of measurement (e.g., "Liters", "Minutes", "Pages")

**Example Usage:**
```
User: "I drank 2 liters of water today"
Claude: [Calls add_habit with name="Drinking Water", amount=2, unit="Liters"]
Response: "Successfully saved: 2 Liters Drinking Water"
```

### 2. get_habits

Retrieves stored habits and activities from the database.

**Parameters:**
- `limit` (number, optional): Number of records to retrieve

**Example Usage:**
```
User: "Show me my recent habits"
Claude: [Calls get_habits]
Response: Returns JSON array of habit entries with timestamps
```

## Installation

### Prerequisites

- Node.js 14+ installed
- npm or yarn package manager
- Claude Desktop application (for MCP integration)

### Setup Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/EnesEfeTokta/Habit-Tracker-MCP.git
   cd Habit-Tracker-MCP
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Claude Desktop**
   
   Add the server configuration to your Claude Desktop config file:
   
   **MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   
   **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   
   ```json
   {
     "mcpServers": {
       "habit-tracker": {
         "command": "node",
         "args": ["/absolute/path/to/Habit-Tracker-MCP/index.js"]
       }
     }
   }
   ```

4. **Restart Claude Desktop**
   
   Close and reopen Claude Desktop to load the MCP server.

## Usage

Once configured, interact with Claude naturally to track your habits:

**Adding Habits:**
- "I exercised for 30 minutes today"
- "Log 8 glasses of water"
- "I read 25 pages of my book"

**Retrieving Data:**
- "Show me my habits"
- "What activities have I logged?"
- "Display my recent habit entries"

Claude will automatically use the appropriate MCP tools to store and retrieve your data.

## Data Structure

### Habit Entry Schema

```json
{
  "id": 1234567890,
  "name": "Drinking Water",
  "amount": 2,
  "unit": "Liters",
  "date": "2026-02-02T07:00:00.000Z"
}
```

### Database Schema

```json
{
  "habits": [
    // Array of habit entries
  ],
  "userProfile": {
    "name": "User"
  }
}
```

## Development

### Project Structure

```
Habit-Tracker-MCP/
├── index.js          # Main MCP server implementation
├── db.js             # Database layer with LowDB
├── data.json         # JSON database file
├── package.json      # Node.js dependencies and metadata
├── package-lock.json # Dependency lock file
├── LICENSE           # GPL-3.0 License
└── README.md         # This file
```

### Running in Development

```bash
node index.js
```

The server will start and output: "Habit Tracker MCP Server is running!"

### Extending the Server

To add new tools:

1. Register the tool in the `ListToolsRequestSchema` handler
2. Implement the tool logic in the `CallToolRequestSchema` handler
3. Update the database schema if needed in `db.js`

**Example - Adding a Delete Tool:**

```javascript
// In ListToolsRequestSchema handler
{
  name: "delete_habit",
  description: "Deletes a habit entry by ID",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "number", description: "ID of the habit to delete" }
    },
    required: ["id"]
  }
}

// In CallToolRequestSchema handler
if (request.params.name === "delete_habit") {
  const { id } = request.params.arguments;
  const index = db.data.habits.findIndex(h => h.id === id);
  if (index !== -1) {
    db.data.habits.splice(index, 1);
    await db.write();
    return { content: [{ type: "text", text: "Habit deleted successfully" }] };
  }
  return { content: [{ type: "text", text: "Habit not found" }] };
}
```

## Security Considerations

- **Local Storage**: All data is stored locally in `data.json`
- **No Authentication**: This is a local-only server without authentication mechanisms
- **Data Privacy**: Habit data remains on your local machine and is not transmitted externally
- **Backup Recommended**: Consider backing up `data.json` periodically

## Troubleshooting

### Server Not Starting
- Ensure Node.js is installed: `node --version`
- Verify dependencies are installed: `npm install`
- Check for port conflicts or permission issues

### Claude Not Detecting Server
- Verify the absolute path in `claude_desktop_config.json`
- Ensure Claude Desktop was restarted after configuration
- Check Claude Desktop logs for error messages

### Data Not Persisting
- Verify write permissions in the project directory
- Check if `data.json` is being created/updated
- Ensure the database initialization in `db.js` is working

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Repository

[https://github.com/EnesEfeTokta/Habit-Tracker-MCP](https://github.com/EnesEfeTokta/Habit-Tracker-MCP)

## Learn More

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [Claude Desktop](https://claude.ai/download)
- [LowDB Documentation](https://github.com/typicode/lowdb)

---

*Built with the Model Context Protocol to demonstrate seamless AI-database integration.*
