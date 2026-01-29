import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    ListToolsRequestSchema,
    CallToolRequestSchema
} from '@modelcontextprotocol/sdk/types.js';

const server = new Server({
    name: 'Habit Tracker MCP',
    description: 'Tracks and analyzes user habits like sports, reading, and water consumption.',
    version: '1.0.0',
    capabilities: {
        tools: {},
    },
});

server.onerror = (error) => console.error('Server Error:', error);

async function runServer() {
    const transport = new StdioServerTransport();
    await server.start(transport);
    console.log('Habit Tracker MCP Server is running...');
}

runServer();