# Supabase Frontend Template

## Project Overview
This is a comprehensive frontend CRUD application built with React and Supabase. The application provides a user-friendly interface to create, read, update, and delete data through Supabase's powerful backend services. This project implements best practices in React development, state management, and API integration.

**Features**

- Complete CRUD Operations: Create, read, update, and delete functionality for all data entities
- Responsive Design: Optimized for desktop
- Advanced Filtering & Sorting: Dynamic data manipulation capabilities
- Comprehensive Error Handling: User-friendly error messages and graceful fallbacks

**Technology Stack**

- React.js
- Supabase (Authentication, Database, Storage)
- React Router for navigation
- CSS/SCSS for styling
- Jest for unit testing

## Setup Instructions

1. Install dependencies: Run `npm install` in your terminal to install all necessary dependencies.
2. Set up Supabase:
   - Create a free Supabase account if you don't have one
   - Create a new project in your Supabase dashboard
   - Copy your Supabase URL and anon key into the `.env` file in the root directory (use `.env.example` as a template)
3. Start the development server: Run `npm run dev:both` in your terminal.
4. Open your web browser and navigate to `[http://localhost:5173]` to access the application.

## Database Management

The project uses Supabase as the database provider and the [companion backend app](https://github.com/jdowie-ada/apa1-supa-task-backend) will be used to manage the database 

## Implementing CRUD Functionality

**How API Calls Work in This Project**

Our application uses a two-layer architecture for API calls:

- Frontend React Hook (useToDo.js) - Provides CRUD operations to React components
- Express Backend Server (server.js) - Serves as middleware to connect to Supabase's Edge Functions

**Frontend Implementation (React Hook)**

``` bash
// Example of how we fetch todos from the API
const fetchMessages = async () => {
    try {
        setLoading(true);
        const response = await fetch("/api/todos");

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setToDos(data);
        setError(null);
        // Uncomment for debugging
        // console.log("Fetched todos:", data);
    } catch (err) {
        setError(err.message);
        setToDos([]);
        // Uncomment for debugging
        // console.error("Error fetching todos:", err);
    } finally {
        setLoading(false);
    }
};

// Example of how we add a new todo
const postToDo = async (newToDo, priority) => {
    if (!newToDo.trim() || newToDo.length < 3 || newToDo.length > 100) {
        setError('To-Do must be between 3 and 100 characters');
        return;
    }

    if (!priority) {
        setError('Priority must be set for each To-Do');
        return;
    }

    try {
        // Uncomment for debugging
        // console.log("Posting new todo:", newToDo, "with priority:", priority);
        
        const response = await fetch("/api/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ todo: newToDo, priority })
        });

        const data = await response.json();
        // Uncomment for debugging
        // console.log("Response from server:", data);
        
        if (data.success) {
            fetchMessages();
        }
    } catch (err) {
        console.error("Error adding To-Do:", err);
    }
};

```

**Backend Implementation (Express Server):**

``` bash
// Example of how the server handles GET requests for todos
app.get('/api/todos', async (req, res) => {
  try {
    // Validate that environment variables are set
    if (!SUPABASE_URL || !SUPABASE_API_KEY) {
      throw new Error('Missing Supabase environment variables');
    }
    
    // Uncomment for debugging
    // console.log("Fetching todos from Supabase Edge Function");
    
    // Call the Supabase Edge Function
    const response = await fetch(`${SUPABASE_URL}/functions/v1/todos`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Edge function error: ${response.status} ${response.statusText}`);
    }

    // Get the JSON response from the Edge Function
    const data = await response.json();
    
    // Uncomment for debugging
    // console.log("Todos retrieved from Supabase:", data);
    
    // Send the data back to the client
    res.json(data);
  } catch (error) {
    console.error('Error fetching To-Dos:', error);
    res.status(500).json({ 
      error: 'Failed to fetch To-Dos',
      message: error.message
    });
  }
});
```

## Debugging API Calls

**Frontend Debugging (add to client/helperFunctions/useToDo.js):**

``` bash
// For debugging fetch operations
const fetchMessages = async () => {
    console.log("Starting fetch operation");
    try {
        setLoading(true);
        const response = await fetch("/api/todos");
        console.log("API response status:", response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched todos:", data);
        setToDos(data);
        setError(null);
    } catch (err) {
        console.error("Error in fetch operation:", err.message);
        setError(err.message);
        setToDos([]);
    } finally {
        setLoading(false);
        console.log("Fetch operation completed");
    }
};

// For debugging create operations
const postToDo = async (newToDo, priority) => {
    console.log("Attempting to create todo:", newToDo, "priority:", priority);
    
    // Validation logic...
    
    try {
        const response = await fetch("/api/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ todo: newToDo, priority })
        });
        console.log("Create todo response status:", response.status);

        const data = await response.json();
        console.log("Create todo response data:", data);
        
        if (data.success) {
            fetchMessages();
        }
    } catch (err) {
        console.error("Error creating todo:", err);
    }
};
```

**Backend Debugging (add to server.js):**

``` bash
// For debugging GET endpoint
app.get('/api/todos', async (req, res) => {
  console.log("GET /api/todos request received");
  try {
    // Validation logic...
    
    console.log("Calling Supabase Edge Function with URL:", `${SUPABASE_URL}/functions/v1/todos`);
    const response = await fetch(`${SUPABASE_URL}/functions/v1/todos`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    console.log("Edge Function response status:", response.status);

    if (!response.ok) {
      throw new Error(`Edge function error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Edge Function response data:", data);
    
    res.json(data);
  } catch (error) {
    console.error('Error in GET /api/todos:', error);
    res.status(500).json({ 
      error: 'Failed to fetch To-Dos',
      message: error.message
    });
  }
});

// For debugging POST endpoint
app.post('/api/todos', async (req, res) => {
  console.log("POST /api/todos request received with body:", req.body);
  try {
    // Implementation...
  } catch (error) {
    console.error('Error in POST /api/todos:', error);
    // Error handling...
  }
});
```
**Debugging Steps:**

- Add Temporary Logs: Copy and paste the relevant debug code into your files when troubleshooting
- Check Browser Console: For frontend errors and API interactions
- Check Server Terminal: For backend logs and Supabase connection issues
- Network Tab: Inspect actual HTTP requests/responses in your browser's dev tools
- Remove Debug Code: Once the issue is resolved, remove the debugging logs to keep your code clean

## Filtering and Sorting

**The application supports filtering todos by priority:**

- Filter by 'high', 'medium', or 'low' priority
- Reset filters to view all todos
- Change between different views of the application

Priority filtering helps users focus on tasks of specific importance levels, improving productivity and task management efficiency.

## Testing

**Manual Testing**

For manual testing, create a checklist covering!

CRUD Operations:

- Creating new todos with different priorities
- Reading/displaying all todos correctly
- Updating existing todos (text and priority)
- Deleting todos

Error Handling:

- Validation errors (todo text length, missing priority)
- API errors (server unavailable, Supabase disconnected)
- Recovery from error states

UI/UX Testing:

- Responsive design on multiple screen sizes
- Loading states displayed correctly
- Error messages are user-friendly
- Success confirmations appear as expected

To have a look how we've done some manual testing, check out the screenshots folder where we use our console logs to reference back to the database, as well as successful unit tests!

**Unit Testing Setup**

1. Install testing dependencies:
```npm install --save-dev jest @testing-library/react @testing-library/jest-dom```

2. Create test files with .test.js extension alongside your components - one has already been created @client/tests/TodoApp.test.js

3. The project includes specific Jest configuration to handle the React/Vite environment:
``` bash
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    // Maps CSS/file imports to mock files for testing
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/']
}
```
4. For testing API interactions without making actual network requests, we use mocks:
``` bash
import { rest } from 'msw'

// Mock handlers for API endpoints
export const handlers = [
  rest.get('/api/todos', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, todo: 'Test todo', priority: 'high' },
        { id: 2, todo: 'Another test todo', priority: 'medium' }
      ])
    )
  }),
  // Add other endpoint mocks (POST, PUT, DELETE) as needed
]
```
5. Ensure you are not in your root directory. cd into client and then run tests using:
``` npm test ```

## Future Features & Enhancements

We have several exciting features planned for future development:

**UI/UX Improvements**

- Mood-Based Theming: Instead of a standard light/dark mode toggle, implement a "Happy/Sad" toggle that changes not just colors but also UI elements, animations, and messaging to match the selected mood
- Enhanced Loading Experience: Expand our custom animated loader component with themed variations and contextual loading messages
- Responsive Mobile Design: Enhance mobile experience with touch-friendly interfaces

**Advanced Functionality**

- Calendar Integration: Add calendar widgets to transform the app into a comprehensive planning tool
- Notion-Style Interface: Implement a flexible, block-based editor for more versatile note-taking
- Real-time Event Tracking: Display upcoming events and deadlines with timely notifications

**Backend & Database Expansion**

- User Table: Create dedicated user tables in Supabase to store profiles, preferences and activity history
- Relationships Between Tables: Establish proper relationships between todos, users, and other entities
- Tag/Category System: Add supporting tables for a robust categorization system
- Analytics Storage: Create tables to store and retrieve usage patterns and productivity metrics

**Security & Authentication**

- User Authentication: Implement secure login and registration
- Role-Based Access: Utilize Supabase roles and policies for different permission levels
- Data Privacy: Add row-level security to ensure users can only access their own data
- API Security: Enhance API endpoints with proper validation and rate limiting

**Productivity Features**

- Recurring Tasks: Add support for repeating todos on schedules
- Tags System: Implement a tagging system for better organization
- Time Tracking: Add the ability to track time spent on each task
- Productivity Analytics: Generate insights on task completion rates and patterns

These planned features would transform this starter template into a full-featured productivity application while maintaining the clean, intuitive interface. We welcome contributions toward implementing any of these features!

## Credits & Acknowledgments

CSS styling and test files were created with AI assistance.

## Conclusion

This React Supabase Starter provides a solid foundation for building CRUD applications with modern web technologies. By leveraging React for the frontend and Supabase for backend services, developers can quickly create powerful web applications without building complex server infrastructure.



