import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    ListToolsRequestSchema,
    CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { getDb } from "./db.js";

const server = new Server(
    { name: "Habit Tracker", version: "1.0.0", },
    { capabilities: { tools: {}, }, }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "add_habit",
                description: "Adds a new habit or daily activity to the user's habit tracker",
                inputSchema: {
                    type: "object",
                    properties: {
                        name: { type: "string", description: "Name of the activity (e.g., Drinking Water)" },
                        amount: { type: "number", description: "Amount" },
                        unit: { type: "string", description: "Unit (e.g., Liters)" }
                    },
                    required: ["name", "amount", "unit"]
                }
            },
            {
                name: "get_habits",
                description: "Retrieves the user's saved habits and activities",
                inputSchema: {
                    type: "object",
                    properties: {
                        limit: {
                            type: "number",
                            description: "Number of records to retrieve"
                        }
                    },
                }
            }
        ]
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const db = await getDb();

    if (request.params.name === "add_habit") {
        const { name, amount, unit } = request.params.arguments;

        const newEntry = {
            id: Date.now(),
            name,
            amount,
            unit,
            date: new Date().toISOString()
        };

        db.data.habits.push(newEntry);
        await db.write();

        return {
            content: [{ type: "text", text: `Successfully saved: ${amount} ${unit} ${name}` }]
        };
    }

    if (request.params.name === "get_habits") {
        const habits = db.data.habits;

        return {
            content: [{
                type: "text",
                text: habits.length > 0
                    ? JSON.stringify(habits, null, 2)
                    : "No habits recorded yet."
            }]
        }
    }

    throw new Error("Tool not found");
});

async function runServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Habit Tracker MCP Server is running!");
}

runServer().catch(console.error);