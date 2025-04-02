// NOTE(miha): Merge sort implementation from "The algorithm design manual - Skiena", page: 127.
const mergeSort = (arr, low, high) => {
    if (low < high) {
        const mid = Math.floor((low + high) / 2);
        mergeSort(arr, low, mid);
        mergeSort(arr, mid + 1, high);
        merge(arr, low, mid, high);
    }

    return arr;
}

const merge = (arr, low, mid, high) => {
    const buf1 = [];
    const buf2 = [];

    for (var i = low; i <= mid; i++)
        buf1.push(arr[i]);

    for (var i = mid + 1; i < high; i++)
        buf2.push(arr[i]);

    let index = low;
    while (buf1.length && buf2.length) {
        if (buf1[0] <= buf2[0])
            arr[index++] = buf1.shift();
        else
            arr[index++] = buf2.shift();

    }

    while (buf1.length)
        arr[index++] = buf1.shift();

    while (buf2.length)
        arr[index++] = buf2.shift();
}

export { mergeSort };
