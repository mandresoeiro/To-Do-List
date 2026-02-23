/**
 * TODO PROFESSIONAL - Modern JavaScript Architecture
 * 
 * A professional todo application built with vanilla ES6+ JavaScript
 * following modern development patterns and best practices.
 * 
 * @author Márcio Soeiro
 * @version 1.0.0
 */

'use strict';

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

const CONFIG = {
  STORAGE_KEY: 'todo-professional-v1',
  MAX_TODO_LENGTH: 100,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 250
};

const SELECTORS = {
  todoForm: '#todo-form',
  todoInput: '#todo-input',
  editForm: '#edit-form',
  editInput: '#edit-input',
  cancelEditBtn: '#cancel-edit-btn',
  searchInput: '#search-input',
  clearSearchBtn: '#clear-search-btn',
  filterSelect: '#filter-select',
  todoList: '#todo-list',
  emptyState: '#empty-state',
  totalCount: '#total-count',
  pendingCount: '#pending-count',
  completedCount: '#completed-count',
  loading: '#loading'
};

const CLASSES = {
  hidden: 'hidden',
  completed: 'completed',
  todoItem: 'todo-item',
  todoText: 'todo-text',
  todoActions: 'todo-actions'
};

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Utility functions for common operations
 */
class Utils {
  /**
   * Generates a unique ID based on timestamp and random number
   * @returns {string} Unique identifier
   */
  static generateId() {
    return `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Debounce function to limit function calls
   * @param {Function} func - Function to debounce
   * @param {number} delay - Delay in milliseconds
   * @returns {Function} Debounced function
   */
  static debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  /**
   * Sanitizes HTML content to prevent XSS
   * @param {string} str - String to sanitize
   * @returns {string} Sanitized string
   */
  static sanitizeHtml(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  }

  /**
   * Validates todo text
   * @param {string} text - Text to validate
   * @returns {Object} Validation result
   */
  static validateTodo(text) {
    const trimmed = text.trim();
    
    if (!trimmed) {
      return { isValid: false, error: 'A tarefa não pode estar vazia.' };
    }
    
    if (trimmed.length > CONFIG.MAX_TODO_LENGTH) {
      return { isValid: false, error: `A tarefa deve ter no máximo ${CONFIG.MAX_TODO_LENGTH} caracteres.` };
    }
    
    return { isValid: true, text: trimmed };
  }

  /**
   * Shows toast notification
   * @param {string} message - Message to show
   * @param {string} type - Type of notification (success, error, info)
   */
  static showToast(message, type = 'info') {
    // Simple console log for now - could be enhanced with actual toast UI
    console.log(`${type.toUpperCase()}: ${message}`);
  }
}

// =============================================================================
// TODO MODEL
// =============================================================================

/**
 * Todo Item Model
 * Represents a single todo item with its properties and methods
 */
class TodoItem {
  constructor(text, id = null) {
    this.id = id || Utils.generateId();
    this.text = text.trim();
    this.completed = false;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Toggle completion status
   */
  toggleComplete() {
    this.completed = !this.completed;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Update todo text
   * @param {string} newText - New text for the todo
   */
  updateText(newText) {
    const validation = Utils.validateTodo(newText);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
    
    this.text = validation.text;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Convert to plain object for storage
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      text: this.text,
      completed: this.completed,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Create TodoItem from plain object
   * @param {Object} data - Plain object data
   * @returns {TodoItem} TodoItem instance
   */
  static fromJSON(data) {
    const todo = new TodoItem(data.text, data.id);
    todo.completed = data.completed || false;
    todo.createdAt = data.createdAt || new Date().toISOString();
    todo.updatedAt = data.updatedAt || new Date().toISOString();
    return todo;
  }
}

// =============================================================================
// STORAGE SERVICE
// =============================================================================

/**
 * Storage Service
 * Handles all localStorage operations
 */
class StorageService {
  /**
   * Get all todos from localStorage
   * @returns {TodoItem[]} Array of todo items
   */
  static getTodos() {
    try {
      const data = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      return parsed.map(item => TodoItem.fromJSON(item));
    } catch (error) {
      console.error('Error loading todos from storage:', error);
      Utils.showToast('Erro ao carregar as tarefas. Iniciando com lista vazia.', 'error');
      return [];
    }
  }

  /**
   * Save todos to localStorage
   * @param {TodoItem[]} todos - Array of todo items to save
   */
  static saveTodos(todos) {
    try {
      const data = JSON.stringify(todos.map(todo => todo.toJSON()));
      localStorage.setItem(CONFIG.STORAGE_KEY, data);
    } catch (error) {
      console.error('Error saving todos to storage:', error);
      Utils.showToast('Erro ao salvar as tarefas.', 'error');
    }
  }

  /**
   * Clear all todos from storage
   */
  static clearTodos() {
    try {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing todos from storage:', error);
      Utils.showToast('Erro ao limpar as tarefas.', 'error');
    }
  }
}

// =============================================================================
// TODO MANAGER
// =============================================================================

/**
 * Todo Manager
 * Main business logic for managing todos
 */
class TodoManager {
  constructor() {
    this.todos = [];
    this.filteredTodos = [];
    this.currentFilter = 'all';
    this.currentSearch = '';
    this.editingTodoId = null;
    
    this.loadTodos();
  }

  /**
   * Load todos from storage
   */
  loadTodos() {
    this.todos = StorageService.getTodos();
    this.applyFilters();
  }

  /**
   * Save todos to storage
   */
  saveTodos() {
    StorageService.saveTodos(this.todos);
  }

  /**
   * Add a new todo
   * @param {string} text - Todo text
   * @returns {TodoItem} Created todo item
   */
  addTodo(text) {
    const validation = Utils.validateTodo(text);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const todo = new TodoItem(validation.text);
    this.todos.unshift(todo); // Add to beginning for better UX
    this.saveTodos();
    this.applyFilters();
    
    return todo;
  }

  /**
   * Update todo text
   * @param {string} id - Todo ID
   * @param {string} newText - New text
   */
  updateTodo(id, newText) {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) {
      throw new Error('Tarefa não encontrada.');
    }

    todo.updateText(newText);
    this.saveTodos();
    this.applyFilters();
  }

  /**
   * Toggle todo completion status
   * @param {string} id - Todo ID
   */
  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) {
      throw new Error('Tarefa não encontrada.');
    }

    todo.toggleComplete();
    this.saveTodos();
    this.applyFilters();
  }

  /**
   * Delete a todo
   * @param {string} id - Todo ID
   */
  deleteTodo(id) {
    const index = this.todos.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Tarefa não encontrada.');
    }

    this.todos.splice(index, 1);
    this.saveTodos();
    this.applyFilters();
  }

  /**
   * Set search filter
   * @param {string} searchTerm - Search term
   */
  setSearch(searchTerm) {
    this.currentSearch = searchTerm.toLowerCase().trim();
    this.applyFilters();
  }

  /**
   * Set completion filter
   * @param {string} filter - Filter type ('all', 'pending', 'completed')
   */
  setFilter(filter) {
    this.currentFilter = filter;
    this.applyFilters();
  }

  /**
   * Apply current filters and search
   */
  applyFilters() {
    let filtered = [...this.todos];

    // Apply search filter
    if (this.currentSearch) {
      filtered = filtered.filter(todo => 
        todo.text.toLowerCase().includes(this.currentSearch)
      );
    }

    // Apply completion filter
    switch (this.currentFilter) {
      case 'pending':
        filtered = filtered.filter(todo => !todo.completed);
        break;
      case 'completed':
        filtered = filtered.filter(todo => todo.completed);
        break;
      // 'all' shows everything, no additional filtering needed
    }

    this.filteredTodos = filtered;
  }

  /**
   * Get statistics
   * @returns {Object} Statistics object
   */
  getStats() {
    const total = this.todos.length;
    const completed = this.todos.filter(todo => todo.completed).length;
    const pending = total - completed;

    return { total, pending, completed };
  }

  /**
   * Start editing a todo
   * @param {string} id - Todo ID
   */
  startEditing(id) {
    this.editingTodoId = id;
  }

  /**
   * Stop editing
   */
  stopEditing() {
    this.editingTodoId = null;
  }

  /**
   * Get the todo being edited
   * @returns {TodoItem|null} Todo being edited or null
   */
  getEditingTodo() {
    return this.editingTodoId 
      ? this.todos.find(t => t.id === this.editingTodoId)
      : null;
  }
}

// =============================================================================
// UI CONTROLLER
// =============================================================================

/**
 * UI Controller
 * Handles all DOM manipulations and user interactions
 */
class UIController {
  constructor(todoManager) {
    this.todoManager = todoManager;
    this.elements = {};
    this.debouncedSearch = Utils.debounce(this.handleSearch.bind(this), CONFIG.DEBOUNCE_DELAY);
    
    this.initElements();
    this.bindEvents();
    this.render();
  }

  /**
   * Initialize DOM elements
   */
  initElements() {
    Object.entries(SELECTORS).forEach(([key, selector]) => {
      this.elements[key] = document.querySelector(selector);
      if (!this.elements[key]) {
        console.warn(`Element not found: ${selector}`);
      }
    });
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Form submissions
    this.elements.todoForm?.addEventListener('submit', this.handleAddTodo.bind(this));
    this.elements.editForm?.addEventListener('submit', this.handleEditTodo.bind(this));
    
    // Button clicks
    this.elements.cancelEditBtn?.addEventListener('click', this.handleCancelEdit.bind(this));
    this.elements.clearSearchBtn?.addEventListener('click', this.handleClearSearch.bind(this));
    
    // Input changes
    this.elements.searchInput?.addEventListener('input', (e) => {
      this.debouncedSearch(e.target.value);
    });
    this.elements.filterSelect?.addEventListener('change', this.handleFilterChange.bind(this));
    
    // Todo list interactions (event delegation)
    this.elements.todoList?.addEventListener('click', this.handleTodoAction.bind(this));
    
    // Keyboard shortcuts
    document.addEventListener('keydown', this.handleKeyboard.bind(this));
  }

  /**
   * Handle add todo form submission
   * @param {Event} e - Submit event
   */
  handleAddTodo(e) {
    e.preventDefault();
    
    const text = this.elements.todoInput?.value.trim();
    if (!text) return;
    
    try {
      this.todoManager.addTodo(text);
      this.elements.todoInput.value = '';
      this.elements.todoInput.focus();
      this.render();
      Utils.showToast('Tarefa adicionada com sucesso!', 'success');
    } catch (error) {
      Utils.showToast(error.message, 'error');
    }
  }

  /**
   * Handle edit todo form submission
   * @param {Event} e - Submit event
   */
  handleEditTodo(e) {
    e.preventDefault();
    
    const newText = this.elements.editInput?.value.trim();
    const editingTodo = this.todoManager.getEditingTodo();
    
    if (!newText || !editingTodo) return;
    
    try {
      this.todoManager.updateTodo(editingTodo.id, newText);
      this.hideEditForm();
      this.render();
      Utils.showToast('Tarefa atualizada com sucesso!', 'success');
    } catch (error) {
      Utils.showToast(error.message, 'error');
    }
  }

  /**
   * Handle cancel edit button click
   * @param {Event} e - Click event
   */
  handleCancelEdit(e) {
    e.preventDefault();
    this.hideEditForm();
  }

  /**
   * Handle clear search button click
   * @param {Event} e - Click event
   */
  handleClearSearch(e) {
    e.preventDefault();
    this.elements.searchInput.value = '';
    this.handleSearch('');
    this.elements.searchInput.focus();
  }

  /**
   * Handle search input
   * @param {string} searchTerm - Search term
   */
  handleSearch(searchTerm) {
    this.todoManager.setSearch(searchTerm);
    this.render();
  }

  /**
   * Handle filter select change
   * @param {Event} e - Change event
   */
  handleFilterChange(e) {
    this.todoManager.setFilter(e.target.value);
    this.render();
  }

  /**
   * Handle todo action clicks (complete, edit, delete)
   * @param {Event} e - Click event
   */
  handleTodoAction(e) {
    const button = e.target.closest('button');
    if (!button) return;

    const todoElement = button.closest(`.${CLASSES.todoItem}`);
    if (!todoElement) return;

    const todoId = todoElement.dataset.todoId;
    if (!todoId) return;

    if (button.classList.contains('btn-complete')) {
      this.handleToggleTodo(todoId);
    } else if (button.classList.contains('btn-edit')) {
      this.handleStartEdit(todoId);
    } else if (button.classList.contains('btn-delete')) {
      this.handleDeleteTodo(todoId);
    }
  }

  /**
   * Handle toggle todo completion
   * @param {string} todoId - Todo ID
   */
  handleToggleTodo(todoId) {
    try {
      this.todoManager.toggleTodo(todoId);
      this.render();
      Utils.showToast('Status da tarefa atualizado!', 'success');
    } catch (error) {
      Utils.showToast(error.message, 'error');
    }
  }

  /**
   * Handle start editing todo
   * @param {string} todoId - Todo ID
   */
  handleStartEdit(todoId) {
    const todo = this.todoManager.todos.find(t => t.id === todoId);
    if (!todo) return;

    this.todoManager.startEditing(todoId);
    this.showEditForm(todo.text);
  }

  /**
   * Handle delete todo
   * @param {string} todoId - Todo ID
   */
  handleDeleteTodo(todoId) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        this.todoManager.deleteTodo(todoId);
        this.render();
        Utils.showToast('Tarefa excluída com sucesso!', 'success');
      } catch (error) {
        Utils.showToast(error.message, 'error');
      }
    }
  }

  /**
   * Handle keyboard shortcuts
   * @param {Event} e - Keyboard event
   */
  handleKeyboard(e) {
    // Escape key - cancel edit or clear search
    if (e.key === 'Escape') {
      if (!this.elements.editForm?.classList.contains(CLASSES.hidden)) {
        this.hideEditForm();
      } else if (this.elements.searchInput?.value) {
        this.handleClearSearch(e);
      }
    }
    
    // Ctrl+F - focus search
    if (e.ctrlKey && e.key === 'f') {
      e.preventDefault();
      this.elements.searchInput?.focus();
    }
  }

  /**
   * Show edit form
   * @param {string} currentText - Current todo text
   */
  showEditForm(currentText) {
    this.elements.editInput.value = currentText;
    this.elements.editForm?.classList.remove(CLASSES.hidden);
    this.elements.todoForm?.classList.add(CLASSES.hidden);
    this.elements.editInput?.focus();
    this.elements.editInput?.select();
  }

  /**
   * Hide edit form
   */
  hideEditForm() {
    this.todoManager.stopEditing();
    this.elements.editForm?.classList.add(CLASSES.hidden);
    this.elements.todoForm?.classList.remove(CLASSES.hidden);
    this.elements.todoInput?.focus();
  }

  /**
   * Create todo item HTML element
   * @param {TodoItem} todo - Todo item
   * @returns {HTMLElement} Todo element
   */
  createTodoElement(todo) {
    const todoEl = document.createElement('div');
    todoEl.className = `${CLASSES.todoItem}${todo.completed ? ` ${CLASSES.completed}` : ''}`;
    todoEl.dataset.todoId = todo.id;
    todoEl.setAttribute('role', 'listitem');

    const sanitizedText = Utils.sanitizeHtml(todo.text);
    
    todoEl.innerHTML = `
      <button class="btn btn-icon btn-complete" 
              aria-label="${todo.completed ? 'Marcar como pendente' : 'Marcar como concluída'}"
              title="${todo.completed ? 'Marcar como pendente' : 'Marcar como concluída'}">
        <i class="fas ${todo.completed ? 'fa-undo' : 'fa-check'}" aria-hidden="true"></i>
      </button>
      
      <span class="${CLASSES.todoText}" title="${sanitizedText}">
        ${sanitizedText}
      </span>
      
      <div class="${CLASSES.todoActions}">
        <button class="btn btn-icon btn-ghost btn-edit" 
                aria-label="Editar tarefa"
                title="Editar tarefa">
          <i class="fas fa-edit" aria-hidden="true"></i>
        </button>
        
        <button class="btn btn-icon btn-danger btn-delete" 
                aria-label="Excluir tarefa"
                title="Excluir tarefa">
          <i class="fas fa-trash" aria-hidden="true"></i>
        </button>
      </div>
    `;

    return todoEl;
  }

  /**
   * Update statistics display
   */
  updateStats() {
    const stats = this.todoManager.getStats();
    
    if (this.elements.totalCount) {
      this.elements.totalCount.textContent = stats.total;
    }
    if (this.elements.pendingCount) {
      this.elements.pendingCount.textContent = stats.pending;
    }
    if (this.elements.completedCount) {
      this.elements.completedCount.textContent = stats.completed;
    }
  }

  /**
   * Show/hide empty state
   */
  updateEmptyState() {
    const isEmpty = this.todoManager.filteredTodos.length === 0;
    
    if (this.elements.emptyState) {
      this.elements.emptyState.classList.toggle(CLASSES.hidden, !isEmpty);
    }
    
    if (this.elements.todoList) {
      this.elements.todoList.setAttribute('aria-empty', isEmpty.toString());
    }
  }

  /**
   * Render the entire UI
   */
  render() {
    this.renderTodos();
    this.updateStats();
    this.updateEmptyState();
  }

  /**
   * Render todo list
   */
  renderTodos() {
    if (!this.elements.todoList) return;

    // Clear current todos
    this.elements.todoList.innerHTML = '';

    // Create and append todo elements
    this.todoManager.filteredTodos.forEach(todo => {
      const todoEl = this.createTodoElement(todo);
      this.elements.todoList.appendChild(todoEl);
    });
  }

  /**
   * Show loading state
   */
  showLoading() {
    this.elements.loading?.classList.remove(CLASSES.hidden);
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    this.elements.loading?.classList.add(CLASSES.hidden);
  }
}

// =============================================================================
// APPLICATION INITIALIZATION
// =============================================================================

/**
 * Todo Application
 * Main application class that orchestrates everything
 */
class TodoApp {
  constructor() {
    this.todoManager = null;
    this.uiController = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      // Show loading
      const loadingEl = document.querySelector(SELECTORS.loading);
      loadingEl?.classList.remove(CLASSES.hidden);

      // Initialize managers
      this.todoManager = new TodoManager();
      this.uiController = new UIController(this.todoManager);

      // Mark as initialized
      this.isInitialized = true;

      // Hide loading
      setTimeout(() => {
        loadingEl?.classList.add(CLASSES.hidden);
      }, 500); // Brief delay for better UX

      console.log('Todo Professional App initialized successfully!');
      
    } catch (error) {
      console.error('Failed to initialize Todo App:', error);
      Utils.showToast('Erro ao inicializar a aplicação. Recarregue a página.', 'error');
    }
  }

  /**
   * Destroy the application (cleanup)
   */
  destroy() {
    if (this.isInitialized) {
      // Cleanup would go here if needed
      this.isInitialized = false;
      console.log('Todo Professional App destroyed.');
    }
  }
}

// =============================================================================
// APPLICATION STARTUP
// =============================================================================

// Initialize app when DOM is ready
const app = new TodoApp();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => app.destroy());

// Export for testing purposes (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TodoApp, TodoItem, TodoManager, StorageService, Utils };
}