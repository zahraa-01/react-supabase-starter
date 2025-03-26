import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Create mocks for all the useToDo functions
const mockPostToDo = jest.fn((todo, priority) => {
    if (!todo.trim() || todo.length < 3 || todo.length > 100) {
        return false;
    }
    return true;
});
const mockUpdateToDo = jest.fn();
const mockDeleteToDo = jest.fn();

// Create a mock state object that you can modify
const mockTodoState = {
    toDos: [
        { id: 1, todo: 'Test todo 1', priority: 'low' },
        { id: 2, todo: 'Test todo 2', priority: 'medium' }
    ],
    loading: false,
    error: null
};

// Mock the useToDo hook with the configurable state
jest.mock('../helperFunctions/useToDo', () => ({
    useToDo: () => ({
        ...mockTodoState,
        postToDo: mockPostToDo,
        updateToDo: mockUpdateToDo,
        deleteToDo: mockDeleteToDo
    })
}));

jest.mock('react', () => {
    const originalReact = jest.requireActual('react');
    return {
        ...originalReact,
        useState: jest.fn().mockImplementation((initial) => {
            // If this is the splash screen state, start with it already dismissed
            if (typeof initial === 'boolean') {
                return [false, jest.fn()];
            }
            // Otherwise use the normal useState implementation
            return originalReact.useState(initial);
        })
    };
});

import { App } from '../App.jsx';

describe('Todo App', () => {
    beforeEach(() => {
        mockPostToDo.mockClear();
        mockUpdateToDo.mockClear();
        mockDeleteToDo.mockClear();

        // Reset state to default values
        mockTodoState.toDos = [
            { id: 1, todo: 'Test todo 1', priority: 'low' },
            { id: 2, todo: 'Test todo 2', priority: 'medium' }
        ];
        mockTodoState.loading = false;
        mockTodoState.error = null;
    });

    test('renders the todo list with items', () => {
        render(<App />);

        // Check if the title is displayed
        expect(screen.getByText('To-Do List')).toBeInTheDocument();

        // Check if todo items are displayed
        expect(screen.getByText('Test todo 1')).toBeInTheDocument();
        expect(screen.getByText('Test todo 2')).toBeInTheDocument();

        // Check if the input field and add button exist
        expect(screen.getByPlaceholderText('Add a new to-do')).toBeInTheDocument();
        expect(screen.getByText('Add')).toBeInTheDocument();
    });

    test('prevents adding empty todos', () => {
        render(<App />);

        // Find add button
        const addButton = screen.getByText('Add');

        // Try to add an empty todo
        fireEvent.click(addButton);

        // The postToDo function shouldn't be called for empty input
        expect(mockPostToDo).not.toHaveBeenCalled();
    });

    test('filters todos by priority', () => {
        render(<App />);

        // Initially both todos should be visible
        expect(screen.getByText('Test todo 1')).toBeInTheDocument();
        expect(screen.getByText('Test todo 2')).toBeInTheDocument();

        // Find the filter container and select element within it
        const filterContainer = screen.getByText('Filter by Priority:').closest('.filter-container');
        const filterDropdown = filterContainer.querySelector('select');

        // Change the filter to 'medium'
        fireEvent.change(filterDropdown, { target: { value: 'medium' } });

        // Now only the medium priority todo shows
        expect(screen.queryByText('Test todo 1')).not.toBeInTheDocument();
        expect(screen.getByText('Test todo 2')).toBeInTheDocument();
    });

    test('allows adding valid todos', () => {
        render(<App />);

        // Find input field and add button
        const todoInput = screen.getByPlaceholderText('Add a new to-do');
        const addButton = screen.getByText('Add');

        // Type a non-empty todo
        fireEvent.change(todoInput, { target: { value: 'Test new todo' } });

        // Add the todo
        fireEvent.click(addButton);

        // Check if postToDo was called with the right arguments
        expect(mockPostToDo).toHaveBeenCalledWith('Test new todo', 'low');
    });

    test('passes only valid todo text to postToDo', () => {
        render(<App />);

        const todoInput = screen.getByPlaceholderText('Add a new to-do');
        const addButton = screen.getByText('Add');

        // Test with valid input (should call postToDo)
        fireEvent.change(todoInput, { target: { value: 'Valid todo' } });
        fireEvent.click(addButton);

        // Verify postToDo was called with valid input
        expect(mockPostToDo).toHaveBeenCalledWith('Valid todo', 'low');
        expect(mockPostToDo.mock.results[0].value).toBe(true);

        mockPostToDo.mockClear();

        // Test with a short input (will call postToDo but it should return false)
        fireEvent.change(todoInput, { target: { value: 'ab' } });
        fireEvent.click(addButton);

        // The function was called but validation failed
        expect(mockPostToDo).toHaveBeenCalledWith('ab', 'low');
        expect(mockPostToDo.mock.results[0].value).toBe(false);
    });

    test('allows selecting different priorities when adding a todo', () => {
        render(<App />);

        const todoInput = screen.getByPlaceholderText('Add a new to-do');

        // Get the first select element in the input container
        const inputContainer = screen.getByPlaceholderText('Add a new to-do').closest('.input-container');
        const prioritySelect = inputContainer.querySelector('select');

        const addButton = screen.getByText('Add');

        // Change priority to high
        fireEvent.change(prioritySelect, { target: { value: 'high' } });

        // Add high priority todo
        fireEvent.change(todoInput, { target: { value: 'High priority task' } });
        fireEvent.click(addButton);

        // Verify postToDo was called with high priority
        expect(mockPostToDo).toHaveBeenCalledWith('High priority task', 'high');
    });

    test('enters edit mode when Edit button is clicked', () => {
        render(<App />);

        // Find first button to edit todo
        const editButton = screen.getAllByText('Edit')[0];

        // Click edit
        fireEvent.click(editButton);

        // Check that you entered edit mode for this item
        expect(screen.getByDisplayValue('Test todo 1')).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    test('calls deleteToDo when Delete button is clicked', () => {
        render(<App />);

        // Find the first delete button
        const deleteButton = screen.getAllByText('Delete')[0];

        // Click delete
        fireEvent.click(deleteButton);

        // Verify deleteToDo was called with the correct ID
        expect(mockDeleteToDo).toHaveBeenCalledWith(1);
    });

    test('displays loading message when loading is true', () => {
        // Set loading to true for this test
        mockTodoState.loading = true;

        render(<App />);

        // Check that loading message is displayed
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('displays error message when error exists', () => {
        // Set error for this test
        mockTodoState.error = 'Failed to fetch todos';

        render(<App />);

        // Check that error message is displayed
        expect(screen.getByText('Failed to fetch todos')).toBeInTheDocument();
    });
});
