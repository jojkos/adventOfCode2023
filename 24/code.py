from __future__ import division

import numpy as np
import math

def line(p1, p2):
    A = (p1[1] - p2[1])
    B = (p2[0] - p1[0])
    C = (p1[0]*p2[1] - p2[0]*p1[1])
    return A, B, -C

def intersection(L1, L2):
    D  = L1[0] * L2[1] - L1[1] * L2[0]
    Dx = L1[2] * L2[1] - L1[1] * L2[2]
    Dy = L1[0] * L2[2] - L1[2] * L2[0]
    if D != 0:
        x = Dx / D
        y = Dy / D
        return x,y
    else:
        return False

if __name__ == "__main__":
    # Opening a file and reading all lines
    file_path = 'input.txt'  # Replace with the actual file path

    # Attempting to open and read the file
    try:
        with open(file_path, 'r') as file:
            hailstones = file.readlines()  # Read all lines in the file
    except Exception as e:
        hailstones = str(e)  # Catching any errors that occur and returning them

    min = 200000000000000
    max = 400000000000000
    lines = []
    sum = 0

    for hailstone in hailstones:
        left_part, right_part = hailstone.split('@')
        x, y, z = [int(num.strip()) for num in left_part.split(',')]
        vx, vy, vz = [int(num.strip()) for num in right_part.split(',')]
        lines.append({"x": x, "y": y,"z":z,"vx": vx,"vy": vy,"vz":vz})

    for i in range(len(lines)):
        for j in range(i+1, len(lines)):
            l1 = lines[i]
            l2 = lines[j]
#
            L1 = line([l1["x"], l1["y"]], [l1["x"]+l1["vx"], l1["y"]+l1["vy"]])
            L2 = line([l2["x"], l2["y"]], [l2["x"]+l2["vx"], l2["y"]+l2["vy"]])

            R = intersection(L1, L2)

            if not R:
                continue

            intrX = R[0]
            intrY = R[1]

            if min <= intrX <= max and min <= intrY <= max:
                is_l1_x_ok = intrX >= l1["x"] if l1["vx"] >= 0 else intrX <= l1["x"]
                is_l1_y_ok = intrY >= l1["y"] if l1["vy"] >= 0 else intrY <= l1["y"]
                is_l2_x_ok = intrX >= l2["x"] if l2["vx"] >= 0 else intrX <= l2["x"]
                is_l2_y_ok = intrY >= l2["y"] if l2["vy"] >= 0 else intrY <= l2["y"]

                if is_l1_x_ok and is_l1_y_ok and is_l2_x_ok and is_l2_y_ok:
                    sum += 1

    print("result:", sum)