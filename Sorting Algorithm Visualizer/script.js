let array = [];
let comparisons = 0;
let swaps = 0;
let speed = 100;
let isSorting = false;

const arraySizeSlider = document.getElementById("arraySize");
const speedInput = document.getElementById("speedInput");
const barContainer = document.getElementById("barContainer");
const comparisonCount = document.getElementById("comparisonCount");
const swapCount = document.getElementById("swapCount");
const timeElapsed = document.getElementById("timeElapsed");
const currentAlgorithm = document.getElementById("currentAlgorithm");

speedInput.addEventListener("input", () => {
  speed = Number(speedInput.value);
});

function generateNewArray() {
  if (isSorting) return;
  array = [];
  let size = parseInt(arraySizeSlider.value);
  for (let i = 0; i < size; i++) {
    array.push(Math.floor(Math.random() * 100) + 1);
  }
  comparisons = 0;
  swaps = 0;
  timeElapsed.textContent = "0 ms";
  comparisonCount.textContent = swaps.textContent = 0;
  currentAlgorithm.textContent = "None";
  renderArray();
}

function renderArray(highlightIndices = []) {
  barContainer.innerHTML = "";
  array.forEach((value, idx) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value * 3}px`;
    if (highlightIndices.includes(idx)) {
      bar.style.backgroundColor = "orange";
    }
    barContainer.appendChild(bar);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function startSort(type) {
  if (isSorting) return;
  isSorting = true;
  comparisons = 0;
  swaps = 0;
  comparisonCount.textContent = 0;
  swapCount.textContent = 0;
  currentAlgorithm.textContent = type.charAt(0).toUpperCase() + type.slice(1) + " Sort";
  const startTime = performance.now();

  switch (type) {
    case 'bubble': await bubbleSort(); break;
    case 'selection': await selectionSort(); break;
    case 'insertion': await insertionSort(); break;
    case 'quick': await quickSort(0, array.length - 1); break;
    case 'merge': await mergeSort(0, array.length - 1); break;
  }

  const endTime = performance.now();
  timeElapsed.textContent = `${Math.round(endTime - startTime)} ms`;
  isSorting = false;
  renderArray();
}

async function bubbleSort() {
  let n = array.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      comparisonCount.textContent = comparisons;
      renderArray([j, j + 1]);
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swaps++;
        swapCount.textContent = swaps;
      }
      await sleep(speed);
    }
  }
}

async function selectionSort() {
  let n = array.length;
  for (let i = 0; i < n; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      comparisons++;
      comparisonCount.textContent = comparisons;
      renderArray([minIndex, j]);
      if (array[j] < array[minIndex]) minIndex = j;
      await sleep(speed);
    }
    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      swaps++;
      swapCount.textContent = swaps;
    }
  }
}

async function insertionSort() {
  let n = array.length;
  for (let i = 1; i < n; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      comparisons++;
      comparisonCount.textContent = comparisons;
      array[j + 1] = array[j];
      j--;
      swaps++;
      swapCount.textContent = swaps;
      renderArray([j, j + 1]);
      await sleep(speed);
    }
    array[j + 1] = key;
    renderArray([j + 1]);
    await sleep(speed);
  }
}

async function quickSort(low, high) {
  if (low < high) {
    let pi = await partition(low, high);
    await quickSort(low, pi - 1);
    await quickSort(pi + 1, high);
  }
}

async function partition(low, high) {
  let pivot = array[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    comparisons++;
    comparisonCount.textContent = comparisons;
    renderArray([j, high]);
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      swaps++;
      swapCount.textContent = swaps;
      renderArray([i, j]);
      await sleep(speed);
    }
  }
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  swaps++;
  swapCount.textContent = swaps;
  return i + 1;
}

async function mergeSort(start, end) {
  if (start >= end) return;
  const mid = Math.floor((start + end) / 2);
  await mergeSort(start, mid);
  await mergeSort(mid + 1, end);
  await merge(start, mid, end);
}

async function merge(start, mid, end) {
  let left = array.slice(start, mid + 1);
  let right = array.slice(mid + 1, end + 1);
  let i = 0, j = 0, k = start;

  while (i < left.length && j < right.length) {
    comparisons++;
    comparisonCount.textContent = comparisons;
    if (left[i] <= right[j]) {
      array[k++] = left[i++];
    } else {
      array[k++] = right[j++];
      swaps++;
      swapCount.textContent = swaps;
    }
    renderArray([k - 1]);
    await sleep(speed);
  }

  while (i < left.length) {
    array[k++] = left[i++];
    renderArray([k - 1]);
    await sleep(speed);
  }

  while (j < right.length) {
    array[k++] = right[j++];
    renderArray([k - 1]);
    await sleep(speed);
  }
}

// Initialize
generateNewArray();
