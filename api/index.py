from flask import Flask, jsonify, request
from flask_cors import CORS
import time
import heapq

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

    steps.append({"array": list(a), "highlight": [], "description": "Sorted!"})
    return steps

def insertion_sort_algo(arr):
    steps = []
    a = list(arr)
    n = len(a)
    steps.append({"array": list(a), "highlight": [], "description": "Starting Insertion Sort"})
    
    for i in range(1, n):
        key = a[i]
        j = i - 1
        steps.append({"array": list(a), "highlight": [i], "description": f"Checking key {key}"})
        
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            steps.append({"array": list(a), "highlight": [j, j + 1], "description": f"Moving {a[j]} to the right"})
            j -= 1
        a[j + 1] = key
        steps.append({"array": list(a), "highlight": [j + 1], "description": f"Inserted {key} at index {j+1}"})
        
    steps.append({"array": list(a), "highlight": [], "description": "Sorted!"})
    return steps

# --- Pathfinding Algorithms ---

def bfs_algo(grid, start, end):
    rows = len(grid)
    cols = len(grid[0])
    queue = [(start[0], start[1])]
    visited = set()
    visited.add((start[0], start[1]))
    parent = {}
    steps = []
    
    steps.append({"type": "visit", "nodes": [[start[0], start[1]]]})

    while queue:
        curr = queue.pop(0)
        r, c = curr
        
        if (r, c) == (end[0], end[1]):
            break
            
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != 1 and (nr, nc) not in visited:
                queue.append((nr, nc))
                visited.add((nr, nc))
                parent[(nr, nc)] = (r, c)
                steps.append({"type": "visit", "nodes": [[nr, nc]]})
                if (nr, nc) == (end[0], end[1]):
                    break
                    
    # Reconstruct Path
    path = []
    curr = (end[0], end[1])
    if curr in parent: # Only if path found
        while curr != (start[0], start[1]):
            path.append([curr[0], curr[1]])
            curr = parent[curr]
        path.append([start[0], start[1]])
        path.reverse()
        steps.append({"type": "path", "nodes": path})
    
    return steps

def dijkstra_algo(grid, start, end):
    rows = len(grid)
    cols = len(grid[0])
    pq = [(0, start[0], start[1])] # cost, r, c
    visited = set()
    parent = {}
    steps = []
    
    # Distance map initialized to infinity
    dist = {}
    for r in range(rows):
        for c in range(cols):
            dist[(r, c)] = float('inf')
    dist[(start[0], start[1])] = 0

    steps.append({"type": "visit", "nodes": [[start[0], start[1]]]})

    while pq:
        d, r, c = heapq.heappop(pq)
        
        if (r, c) in visited:
            continue
        visited.add((r, c))
        steps.append({"type": "visit", "nodes": [[r, c]]})
        
        if (r, c) == (end[0], end[1]):
            break
            
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != 1:
                weight = 1 # Uniform weight for grid
                if dist[(r, c)] + weight < dist[(nr, nc)]:
                    dist[(nr, nc)] = dist[(r, c)] + weight
                    parent[(nr, nc)] = (r, c)
                    heapq.heappush(pq, (dist[(nr, nc)], nr, nc))
    
    # Reconstruct Path
    path = []
    curr = (end[0], end[1])
    if curr in parent or curr == (start[0], start[1]):
        while curr != (start[0], start[1]):
             if curr in parent:
                path.append([curr[0], curr[1]])
                curr = parent[curr]
             else:
                 break
        path.append([start[0], start[1]])
        path.reverse()
        steps.append({"type": "path", "nodes": path})
        
    return steps

def dfs_algo(grid, start, end):
    rows = len(grid)
    cols = len(grid[0])
    stack = [(start[0], start[1])]
    visited = set()
    parent = {}
    steps = []
    
    while stack:
        curr = stack.pop()
        r, c = curr
        
        if (r, c) in visited:
            continue
            
        visited.add((r, c))
        steps.append({"type": "visit", "nodes": [[r, c]]})
        
        if (r, c) == (end[0], end[1]):
            break
            
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != 1 and (nr, nc) not in visited:
                stack.append((nr, nc))
                parent[(nr, nc)] = (r, c)
                
    # Reconstruct Path
    path = []
    curr = (end[0], end[1])
    if curr in parent or curr == (start[0], start[1]):
        while curr != (start[0], start[1]):
            path.append([curr[0], curr[1]])
            curr = parent[curr]
        path.append([start[0], start[1]])
        path.reverse()
        steps.append({"type": "path", "nodes": path})
        
    return steps

def a_star_algo(grid, start, end):
    rows = len(grid)
    cols = len(grid[0])
    
    def heuristic(a, b):
        return abs(a[0] - b[0]) + abs(a[1] - b[1])
        
    pq = [(0, start[0], start[1])] # f_score, r, c
    visited = set()
    parent = {}
    g_score = {(r, c): float('inf') for r in range(rows) for c in range(cols)}
    g_score[(start[0], start[1])] = 0
    
    steps = []
    steps.append({"type": "visit", "nodes": [[start[0], start[1]]]})
    
    while pq:
        f, r, c = heapq.heappop(pq)
        
        if (r, c) in visited:
            continue
        visited.add((r, c))
        steps.append({"type": "visit", "nodes": [[r, c]]})
        
        if (r, c) == (end[0], end[1]):
            break
            
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != 1:
                tentative_g_score = g_score[(r, c)] + 1
                if tentative_g_score < g_score[(nr, nc)]:
                    parent[(nr, nc)] = (r, c)
                    g_score[(nr, nc)] = tentative_g_score
                    f_score = tentative_g_score + heuristic((nr, nc), end)
                    heapq.heappush(pq, (f_score, nr, nc))
                    
    # Reconstruct Path
    path = []
    curr = (end[0], end[1])
    if curr in parent or curr == (start[0], start[1]):
        while curr != (start[0], start[1]):
            path.append([curr[0], curr[1]])
            curr = parent[curr]
        path.append([start[0], start[1]])
        path.reverse()
        steps.append({"type": "path", "nodes": path})
        
    return steps
    
# --- Recursive Algorithms ---

def n_queens_algo(n):
    steps = []
    board = [[0]*n for _ in range(n)]
    
    def is_safe(board, row, col):
        # Check this row on left side
        for i in range(col):
            steps.append({"type": "check", "row": row, "col": i, "status": "checking"})
            if board[row][i] == 1:
                return False
        
        # Check upper diagonal on left side
        for i, j in zip(range(row, -1, -1), range(col, -1, -1)):
            if board[i][j] == 1:
                return False
        
        # Check lower diagonal on left side
        for i, j in zip(range(row, n, 1), range(col, -1, -1)):
            if board[i][j] == 1:
                return False
                
        return True

    def solve_nq_util(board, col):
        if col >= n:
            return True
            
        for i in range(n):
            steps.append({"type": "place", "row": i, "col": col, "status": "trying"})
            
            # Simple safety check logic for visualization steps
            safe = True
            # Row check
            for c in range(col):
                 if board[i][c] == 1: safe = False
            
            if safe:
                # Diagonals check omitted in simple step logic for brevity, assumed safe if is_safe returns true
                if is_safe(board, i, col):
                    board[i][col] = 1
                    steps.append({"type": "place", "row": i, "col": col, "status": "placed"})
                    
                    if solve_nq_util(board, col + 1):
                        return True
                    
                    board[i][col] = 0 # Backtrack
                    steps.append({"type": "place", "row": i, "col": col, "status": "backtrack"})
                else:
                    steps.append({"type": "place", "row": i, "col": col, "status": "unsafe"})
            else:
                 steps.append({"type": "place", "row": i, "col": col, "status": "unsafe"})
                 
        return False

    solve_nq_util(board, 0)
    return steps

def sierpinski_algo(order, size=100):
    steps = []
    
    def get_mid(p1, p2):
        return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2]
        
    def draw_triangle(p1, p2, p3):
        steps.append({"type": "triangle", "points": [p1, p2, p3]})
        
    def sierpinski_recursive(p1, p2, p3, order):
        if order == 0:
            draw_triangle(p1, p2, p3)
        else:
            p12 = get_mid(p1, p2)
            p23 = get_mid(p2, p3)
            p31 = get_mid(p3, p1)
            
            sierpinski_recursive(p1, p12, p31, order - 1)
            sierpinski_recursive(p12, p2, p23, order - 1)
            sierpinski_recursive(p31, p23, p3, order - 1)
            
    # Initial triangle points (equilateral)
    import math
    h = size * math.sqrt(3) / 2
    p1 = [size / 2, 0]
    p2 = [0, h]
    p3 = [size, h]
    
    sierpinski_recursive(p1, p2, p3, order)
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
    elif algo == 'insertion':
        return jsonify({"steps": insertion_sort_algo(arr)})
        
    return jsonify({"error": "Algorithm not supported"}), 400

@app.route('/api/pathfind', methods=['POST'])
def pathfind_grid():
    data = request.json
    grid = data.get('grid', [])
    start = data.get('start', [0, 0])
    end = data.get('end', [9, 9])
    algo = data.get('algorithm', 'bfs')
    
    if algo == 'bfs':
        return jsonify({"steps": bfs_algo(grid, start, end)})
    elif algo == 'dijkstra':
        return jsonify({"steps": dijkstra_algo(grid, start, end)})
    elif algo == 'dfs':
        return jsonify({"steps": dfs_algo(grid, start, end)})
    elif algo == 'astar':
        return jsonify({"steps": a_star_algo(grid, start, end)})
        
    return jsonify({"error": "Algorithm not supported"}), 400

@app.route('/api/recursive', methods=['POST'])
def recursive_algo():
    data = request.json
    algo = data.get('algorithm', 'nqueens')
    n = data.get('n', 8)
    
    if algo == 'nqueens':
        return jsonify({"steps": n_queens_algo(n)})
    elif algo == 'sierpinski':
        return jsonify({"steps": sierpinski_algo(data.get('order', 4))})
        
    return jsonify({"error": "Algorithm not supported"}), 400


@app.route('/api/health')
def health():
    return jsonify({"status": "ok", "time": time.time()})

if __name__ == '__main__':
    app.run(debug=True, port=5328)
