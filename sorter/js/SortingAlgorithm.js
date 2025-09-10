/**
 * Abstract base class for all sorting algorithms
 */
class SortingAlgorithm {
    constructor() {
        this.array = [];
        this.comparisons = 0;
        this.swaps = 0;
        this.currentStep = 0;
        this.currentIndices = { comparing: [], swapping: [], sorted: [] };
        this.finished = false;
    }

    /**
     * Prepares the algorithm with the array to be sorted and begins the sorting process
     * @param {Array} array - The array to sort
     */
    run(array) {
        this.array = [...array]; // Create a copy of the array
        this.comparisons = 0;
        this.swaps = 0;
        this.currentStep = 0;
        this.currentIndices = { comparing: [], swapping: [], sorted: [] };
        this.finished = false;
        this.setup(); // Additional setup specific to each algorithm
    }

    /**
     * Setup method to be overridden by subclasses
     */
    setup() {
        // To be implemented by subclasses
    }

    /**
     * Performs one step of the sorting algorithm
     * @returns {Object} Information about the current step
     */
    step() {
        // To be implemented by subclasses
        throw new Error("Method 'step()' must be implemented by subclasses");
    }

    /**
     * Checks if the array is sorted
     * @returns {boolean} True if the array is sorted
     */
    isFinished() {
        return this.finished;
    }

    /**
     * Compares two elements in the array
     * @param {number} i - First index
     * @param {number} j - Second index
     * @returns {number} Negative if array[i] < array[j], positive if array[i] > array[j], 0 if equal
     */
    compare(i, j) {
        if (i < 0 || i >= this.array.length || j < 0 || j >= this.array.length) {
            throw new Error(`Index out of bounds: ${i}, ${j}`);
        }
        
        this.comparisons++;
        this.currentIndices.comparing = [i, j];
        return this.array[i] - this.array[j];
    }

    /**
     * Swaps two elements in the array
     * @param {number} i - First index
     * @param {number} j - Second index
     */
    swap(i, j) {
        if (i < 0 || i >= this.array.length || j < 0 || j >= this.array.length) {
            throw new Error(`Index out of bounds: ${i}, ${j}`);
        }
        
        if (i !== j) {
            this.swaps++;
            this.currentIndices.swapping = [i, j];
            [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
        }
    }

    /**
     * Gets the current state of the sort
     * @returns {Object} The current state of the sort
     */
    getState() {
        return {
            array: [...this.array],
            currentIndices: { ...this.currentIndices },
            comparisons: this.comparisons,
            swaps: this.swaps,
            finished: this.finished
        };
    }

    /**
     * Gets the number of comparisons made
     * @returns {number} Number of comparisons
     */
    getComparisons() {
        return this.comparisons;
    }

    /**
     * Gets the number of swaps performed
     * @returns {number} Number of swaps
     */
    getSwaps() {
        return this.swaps;
    }

    /**
     * Check if the array is sorted and mark as finished if it is
     * @returns {boolean} True if the array is sorted
     */
    checkSorted() {
        for (let i = 1; i < this.array.length; i++) {
            if (this.array[i] < this.array[i - 1]) {
                return false;
            }
        }
        this.finished = true;
        this.currentIndices.sorted = Array.from({ length: this.array.length }, (_, i) => i);
        return true;
    }
}
