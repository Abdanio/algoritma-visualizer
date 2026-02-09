from flask import Flask, jsonify, request
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app) # Enable CORS for frontend

# --- Sorting Algorithms ---

def bubble_sort_algo(arr):
    steps = []
    a = list(arr)
    n = len(a)
    steps.append({"array": list(a), "highlight": [], "description": "Starting Bubble Sort"})
    
    for i in range(n):
        swapped = False
        for j in range(0, n-i-1):
            steps.append({"array": list(a), "highlight": [j, j+1], "description": f"Comparing {a[j]} and {a[j+1]}"})
            if a[j] > a[j+1]:
                a[j], a[j+1] = a[j+1], a[j]
                swapped = True
                steps.append({"array": list(a), "highlight": [j, j+1], "description": f"Swapped {a[j+1]} and {a[j]}"})
        if not swapped:
            break
            
    steps.append({"array": list(a), "highlight": [], "description": "Sorted!"})
    return steps

def quick_sort_algo(arr):
    steps = []
    a = list(arr)
    
    def partition(low, high):
        pivot = a[high]
        steps.append({"array": list(a), "highlight": [high], "description": f"Pivot chosen: {pivot}"})
        i = low - 1
        for j in range(low, high):
            steps.append({"array": list(a), "highlight": [j, high], "description": f"Comparing {a[j]} with pivot {pivot}"})
            if a[j] < pivot:
                i += 1
                a[i], a[j] = a[j], a[i]
                steps.append({"array": list(a), "highlight": [i, j], "description": f"Swapped {a[i]} and {a[j]}"})
        a[i+1], a[high] = a[high], a[i+1]
        steps.append({"array": list(a), "highlight": [i+1, high], "description": "Moves pivot to correct position"})
        return i + 1

    def quick_sort_recursive(low, high):
        if(low < high):
            pi = partition(low, high)
            quick_sort_recursive(low, pi - 1)
            quick_sort_recursive(pi + 1, high)

    steps.append({"array": list(a), "highlight": [], "description": "Starting Quick Sort"})
    quick_sort_recursive(0, len(a) - 1)
    steps.append({"array": list(a), "highlight": [], "description": "Sorted!"})
    return steps

def merge_sort_algo(arr):
    steps = []
    a = list(arr)
    
    def merge(l, m, r):
        n1 = m - l + 1
        n2 = r - m
        L = a[l:m+1]
        R = a[m+1:r+1]
        
        i = 0
        j = 0
        k = l
        
        while i < n1 and j < n2:
            steps.append({"array": list(a), "highlight": [l+i, m+1+j], "description": f"Comparing L[{i}]={L[i]} and R[{j}]={R[j]}"})
            if L[i] <= R[j]:
                a[k] = L[i]
                i += 1
            else:
                a[k] = R[j]
                j += 1
            steps.append({"array": list(a), "highlight": [k], "description": f"Overwriting index {k} with {a[k]}"})
            k += 1
            
        while i < n1:
            a[k] = L[i]
            i += 1
            k += 1
            steps.append({"array": list(a), "highlight": [k-1], "description": f"Remaining L element to index {k-1}"})

        while j < n2:
            a[k] = R[j]
            j += 1
            k += 1
            steps.append({"array": list(a), "highlight": [k-1], "description": f"Remaining R element to index {k-1}"})

    def merge_sort_recursive(l, r):
        if l < r:
            m = l+(r-l)//2
            merge_sort_recursive(l, m)
            merge_sort_recursive(m+1, r)
            merge(l, m, r)

    steps.append({"array": list(a), "highlight": [], "description": "Starting Merge Sort"})
    merge_sort_recursive(0, len(a)-1)
    steps.append({"array": list(a), "highlight": [], "description": "Sorted!"})
    return steps

# --- Routes ---

@app.route('/api/sort', methods=['POST'])
def sort_array():
    data = request.json
    arr = data.get('array', [])
    algo = data.get('algorithm', 'bubble')
    
    if algo == 'bubble':
        return jsonify({"steps": bubble_sort_algo(arr)})
    elif algo == 'quick':
        return jsonify({"steps": quick_sort_algo(arr)})
    elif algo == 'merge':
        return jsonify({"steps": merge_sort_algo(arr)})
        
    return jsonify({"error": "Algorithm not supported"}), 400

@app.route('/api/health')
def health():
    return jsonify({"status": "ok", "time": time.time()})

if __name__ == '__main__':
    app.run(debug=True, port=5328)
