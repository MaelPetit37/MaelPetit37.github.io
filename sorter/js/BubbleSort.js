/**
 * Implementation of Bubble Sort algorithm
 * @extends SortingAlgorithm
 */
class BubbleSort extends SortingAlgorithm {
    /**
     * Setup method for bubble sort
     */
    setup() {
        this.i = 0;
        this.j = 0;
        this.swappedInPass = false;
        this.lastSorted = this.array.length;
    }

    /**
     * Performs one step of bubble sort
     * @returns {Object} Information about the current step
     */
    step() {
        if (this.finished) {
            return this.getState();
        }

        // Reset current indices
        this.currentIndices = { comparing: [], swapping: [], sorted: [] };

        // If we're at the end of a pass
        if (this.j >= this.lastSorted - 1) {
            // If we didn't swap anything in this pass, the array is sorted
            if (!this.swappedInPass) {
                this.finished = true;
                this.currentIndices.sorted = Array.from({ length: this.array.length }, (_, i) => i);
                return this.getState();
            }

            // Mark elements from lastSorted to end as sorted
            for (let k = this.lastSorted; k < this.array.length; k++) {
                if (!this.currentIndices.sorted.includes(k)) {
                    this.currentIndices.sorted.push(k);
                }
            }

            // Reset for next pass
            this.lastSorted--;
            this.j = 0;
            this.swappedInPass = false;
            return this.getState();
        }

        // Compare adjacent elements
        if (this.compare(this.j, this.j + 1) > 0) {
            this.swap(this.j, this.j + 1);
            this.swappedInPass = true;
        }

        // Move to next pair
        this.j++;
        return this.getState();
    }
}
