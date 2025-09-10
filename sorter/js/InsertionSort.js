/**
 * Implementation of Insertion Sort algorithm
 * @extends SortingAlgorithm
 */
class InsertionSort extends SortingAlgorithm {
    /**
     * Setup method for insertion sort
     */
    setup() {
        this.i = 1; // Start with the second element
        this.j = 0; // Used to scan backwards
        this.key = 0; // Current element being inserted
        this.insertionPhase = false; // Whether we're in the phase of inserting an element
        this.currentIndices.sorted = [0]; // First element is initially sorted
    }

    /**
     * Performs one step of insertion sort
     * @returns {Object} Information about the current step
     */
    step() {
        if (this.finished) {
            return this.getState();
        }

        // Reset current indices for comparing/swapping
        this.currentIndices.comparing = [];
        this.currentIndices.swapping = [];

        // If we're done with all elements
        if (this.i >= this.array.length) {
            this.finished = true;
            return this.getState();
        }

        // If we're starting with a new element to insert
        if (!this.insertionPhase) {
            this.key = this.array[this.i];
            this.j = this.i - 1;
            this.insertionPhase = true;
            return this.getState();
        }

        // If we're still inserting the current element
        if (this.j >= 0) {
            // Compare current element with the key
            this.currentIndices.comparing = [this.j, this.j + 1];
            
            if (this.array[this.j] > this.key) {
                // Shift element to the right
                this.array[this.j + 1] = this.array[this.j];
                this.currentIndices.swapping = [this.j, this.j + 1];
                this.swaps++;
                this.j--;
            } else {
                // Found the right position
                this.array[this.j + 1] = this.key;
                this.currentIndices.sorted.push(this.i);
                this.i++;
                this.insertionPhase = false;
            }
            
            return this.getState();
        } else {
            // Insert at the beginning
            this.array[0] = this.key;
            this.currentIndices.sorted.push(this.i);
            this.i++;
            this.insertionPhase = false;
            return this.getState();
        }
    }
}
