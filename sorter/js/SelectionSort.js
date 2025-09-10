/**
 * Implementation of Selection Sort algorithm
 * @extends SortingAlgorithm
 */
class SelectionSort extends SortingAlgorithm {
    /**
     * Setup method for selection sort
     */
    setup() {
        this.i = 0;
        this.j = 1;
        this.minIndex = 0;
        this.currentIndices.sorted = [];
    }

    /**
     * Performs one step of selection sort
     * @returns {Object} Information about the current step
     */
    step() {
        if (this.finished) {
            return this.getState();
        }

        // Reset current indices for comparing/swapping
        this.currentIndices.comparing = [];
        this.currentIndices.swapping = [];

        // If we're at the last element to be sorted
        if (this.i >= this.array.length - 1) {
            this.finished = true;
            this.currentIndices.sorted = Array.from({ length: this.array.length }, (_, i) => i);
            return this.getState();
        }

        // If we're starting a new pass
        if (this.j === this.i + 1) {
            this.minIndex = this.i;
        }

        // If we've gone through the unsorted portion
        if (this.j >= this.array.length) {
            // Swap the minimum element with the first unsorted element
            if (this.minIndex !== this.i) {
                this.swap(this.i, this.minIndex);
            }

            // Mark this position as sorted
            this.currentIndices.sorted.push(this.i);
            
            // Move to the next unsorted element
            this.i++;
            this.j = this.i + 1;
            this.minIndex = this.i;
            
            return this.getState();
        }

        // Compare current element with minimum
        if (this.compare(this.j, this.minIndex) < 0) {
            this.minIndex = this.j;
        }

        // Move to next element
        this.j++;
        return this.getState();
    }
}
