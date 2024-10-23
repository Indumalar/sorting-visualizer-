const n = 30;
const array = [];
let animationId = null;
let isAnimating = false;
let delay = 100;
init();

function init() {
    for (let i = 0; i < n; i++) {
        array[i] = Math.random();
    }
    showBars();
}

function play(sortType) {
    if (isAnimating) {
        clearTimeout(animationId);
        isAnimating = false;
    }
    isAnimating = true;
    const copy = [...array];
    let moves;

    switch (sortType) {
        case 'bubble':
            moves = bubbleSort(copy);
            break;
        case 'selection':
            moves = selectionSort(copy);
            break;
        case 'insertion':
            moves = insertionSort(copy);
            break;
        case 'merge':
            moves = mergeSort(copy);
            break;
        case 'quick':
            moves = quickSort(copy);
            break;
    }
    animate(moves);
}

function animate(moves) {
    if (moves.length === 0) {
        showBars();
        isAnimating = false;
        return;
    }
    const move = moves.shift();
    const [i, j] = move.indices;
    if (move.type === "swap") {
        [array[i], array[j]] = [array[j], array[i]];
    }
    showBars(move);
    animationId = setTimeout(() => animate(moves), delay);
}

function bubbleSort(array) {
    const moves = [];
    let swapped;
    do {
        swapped = false;
        for (let i = 1; i < array.length; i++) {
            moves.push({ indices: [i - 1, i], type: "compare" });
            if (array[i - 1] > array[i]) {
                swapped = true;
                moves.push({ indices: [i - 1, i], type: "swap" });
                [array[i - 1], array[i]] = [array[i], array[i - 1]];
            }
        }
    } while (swapped);
    return moves;
}

function selectionSort(array) {
    const moves = [];
    for (let i = 0; i < array.length; i++) {
        let minIdx = i;
        for (let j = i + 1; j < array.length; j++) {
            moves.push({ indices: [j, minIdx], type: "compare" });
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            moves.push({ indices: [i, minIdx], type: "swap" });
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
        }
    }
    return moves;
}

function insertionSort(array) {
    const moves = [];
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            moves.push({ indices: [j, j + 1], type: "compare" });
            moves.push({ indices: [j, j + 1], type: "swap" });
            array[j + 1] = array[j];
            j--;
        }
        array[j + 1] = key;
    }
    return moves;
}

function mergeSort(array) {
    const moves = [];
    function mergeSortHelper(arr, left, right) {
        if (left < right) {
            const mid = Math.floor((left + right) / 2);
            mergeSortHelper(arr, left, mid);
            mergeSortHelper(arr, mid + 1, right);
            merge(arr, left, mid, right);
        }
    }

    function merge(arr, left, mid, right) {
        const leftArray = arr.slice(left, mid + 1);
        const rightArray = arr.slice(mid + 1, right + 1);
        let i = 0, j = 0, k = left;

        while (i < leftArray.length && j < rightArray.length) {
            moves.push({ indices: [k, k], type: "compare" });
            if (leftArray[i] <= rightArray[j]) {
                arr[k] = leftArray[i];
                i++;
            } else {
                arr[k] = rightArray[j];
                j++;
            }
            k++;
        }

        while (i < leftArray.length) {
            arr[k] = leftArray[i];
            i++;
            k++;
        }

        while (j < rightArray.length) {
            arr[k] = rightArray[j];
            j++;
            k++;
        }
    }

    mergeSortHelper(array, 0, array.length - 1);
    return moves;
}

function quickSort(array) {
    const moves = [];
    function quickSortHelper(arr, low, high) {
        if (low < high) {
            const pi = partition(arr, low, high);
            quickSortHelper(arr, low, pi - 1);
            quickSortHelper(arr, pi + 1, high);
        }
    }

    function partition(arr, low, high) {
        const pivot = arr[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            moves.push({ indices: [j, high], type: "compare" });
            if (arr[j] < pivot) {
                i++;
                moves.push({ indices: [i, j], type: "swap" });
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }
        moves.push({ indices: [i + 1, high], type: "swap" });
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        return i + 1;
    }

    quickSortHelper(array, 0, array.length - 1);
    return moves;
}

function showBars(move) {
    const container = document.getElementById("container");
    container.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        bar.style.height = array[i] * 100 + "%";
        bar.classList.add("bar");
        if (move && move.indices.includes(i)) {
            bar.style.backgroundColor = move.type === "swap" ? "red" : "blue";
        }
        container.appendChild(bar);
    }
}

document.getElementById("initButton").onclick = init;
document.getElementById("sortButton").onclick = function() {
    const selectedSort = document.getElementById("sortSelect").value;
    const customDelay = parseInt(document.getElementById("delayInput").value);
    delay = customDelay || 100; // Default to 100 if input is empty
    play(selectedSort);
};
