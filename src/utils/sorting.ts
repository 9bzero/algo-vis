export type SortAnimation =
  | { type: "compare"; indices: [number, number] }
  | { type: "swap"; indices: [number, number] }
  | { type: "overwrite"; index: number; value: number }
  | { type: "sorted"; index: number };

export function bubbleSort(array: number[]): SortAnimation[] {
  const anims: SortAnimation[] = [];
  const arr = [...array];
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      anims.push({ type: "compare", indices: [j, j + 1] });
      if (arr[j] > arr[j + 1]) {
        anims.push({ type: "swap", indices: [j, j + 1] });
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
    anims.push({ type: "sorted", index: n - i - 1 });
  }
  anims.push({ type: "sorted", index: 0 });
  return anims;
}

export function insertionSort(array: number[]): SortAnimation[] {
  const anims: SortAnimation[] = [];
  const arr = [...array];
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0) {
      anims.push({ type: "compare", indices: [j, j + 1] });
      if (arr[j] > key) {
        arr[j + 1] = arr[j];
        anims.push({ type: "overwrite", index: j + 1, value: arr[j] });
        j--;
      } else break;
    }
    arr[j + 1] = key;
    anims.push({ type: "overwrite", index: j + 1, value: key });
    anims.push({ type: "sorted", index: i });
  }
  anims.push({ type: "sorted", index: 0 });
  return anims;
}

export function mergeSort(array: number[]): SortAnimation[] {
  const anims: SortAnimation[] = [];
  const arr = [...array];
  const aux = [...array];
  mergeSortHelper(arr, aux, 0, arr.length - 1, anims);
  for (let i = 0; i < arr.length; i++) anims.push({ type: "sorted", index: i });
  return anims;
}

function mergeSortHelper(arr: number[], aux: number[], lo: number, hi: number, anims: SortAnimation[]) {
  if (lo >= hi) return;
  const mid = Math.floor((lo + hi) / 2);
  mergeSortHelper(aux, arr, lo, mid, anims);
  mergeSortHelper(aux, arr, mid + 1, hi, anims);
  merge(arr, aux, lo, mid, hi, anims);
}

function merge(arr: number[], aux: number[], lo: number, mid: number, hi: number, anims: SortAnimation[]) {
  let i = lo, j = mid + 1;
  for (let k = lo; k <= hi; k++) {
    anims.push({ type: "compare", indices: [i, j > hi ? hi : j] });
    if (i > mid) {
      arr[k] = aux[j];
      anims.push({ type: "overwrite", index: k, value: aux[j++] });
    } else if (j > hi) {
      arr[k] = aux[i];
      anims.push({ type: "overwrite", index: k, value: aux[i++] });
    } else if (aux[j] < aux[i]) {
      arr[k] = aux[j];
      anims.push({ type: "overwrite", index: k, value: aux[j++] });
    } else {
      arr[k] = aux[i];
      anims.push({ type: "overwrite", index: k, value: aux[i++] });
    }
  }
}

export function quickSort(array: number[]): SortAnimation[] {
  const anims: SortAnimation[] = [];
  const arr = [...array];
  quickSortHelper(arr, 0, arr.length - 1, anims);
  for (let i = 0; i < arr.length; i++) anims.push({ type: "sorted", index: i });
  return anims;
}

function quickSortHelper(arr: number[], lo: number, hi: number, anims: SortAnimation[]) {
  if (lo >= hi) return;
  const p = partition(arr, lo, hi, anims);
  quickSortHelper(arr, lo, p - 1, anims);
  quickSortHelper(arr, p + 1, hi, anims);
}

function partition(arr: number[], lo: number, hi: number, anims: SortAnimation[]): number {
  const pivot = arr[hi];
  let i = lo - 1;
  for (let j = lo; j < hi; j++) {
    anims.push({ type: "compare", indices: [j, hi] });
    if (arr[j] <= pivot) {
      i++;
      anims.push({ type: "swap", indices: [i, j] });
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  anims.push({ type: "swap", indices: [i + 1, hi] });
  [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
  return i + 1;
}

export function heapSort(array: number[]): SortAnimation[] {
  const anims: SortAnimation[] = [];
  const arr = [...array];
  const n = arr.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(arr, n, i, anims);
  for (let i = n - 1; i > 0; i--) {
    anims.push({ type: "swap", indices: [0, i] });
    [arr[0], arr[i]] = [arr[i], arr[0]];
    anims.push({ type: "sorted", index: i });
    heapify(arr, i, 0, anims);
  }
  anims.push({ type: "sorted", index: 0 });
  return anims;
}

function heapify(arr: number[], n: number, i: number, anims: SortAnimation[]) {
  let largest = i;
  const l = 2 * i + 1;
  const r = 2 * i + 2;
  if (l < n) { anims.push({ type: "compare", indices: [l, largest] }); if (arr[l] > arr[largest]) largest = l; }
  if (r < n) { anims.push({ type: "compare", indices: [r, largest] }); if (arr[r] > arr[largest]) largest = r; }
  if (largest !== i) {
    anims.push({ type: "swap", indices: [i, largest] });
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest, anims);
  }
}
