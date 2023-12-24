import numpy as np
import math

def get_intersect(a1, a2, b1, b2):
    """
    Returns the point of intersection of the lines passing through a2,a1 and b2,b1.
    a1: [x, y] a point on the first line
    a2: [x, y] another point on the first line
    b1: [x, y] a point on the second line
    b2: [x, y] another point on the second line
    """
    s = np.vstack([a1,a2,b1,b2])        # s for stacked
    h = np.hstack((s, np.ones((4, 1)))) # h for homogeneous
    l1 = np.cross(h[0], h[1])           # get first line
    l2 = np.cross(h[2], h[3])           # get second line
    x, y, z = np.cross(l1, l2)          # point of intersection
    if z == 0:                          # lines are parallel
        return None
    return (x/z, y/z)

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

            if (l1["vx"] == 0 or l1["vy"] == 0):
                print(l1)

            intersection = get_intersect((l1["x"], l1["y"]), (l1["x"]+l1["vx"], l1["y"]+l1["vy"]), (l2["x"], l2["y"]), (l2["x"]+l2["vx"], l2["y"]+l2["vy"]))

            if (intersection is None):
                continue

            intrX = intersection[0]
            intrY = intersection[1]

            if min <= intrX <= max and min <= intrY <= max:
                is_l1_x_ok = intrX >= l1["x"] if l1["vx"] >= 0 else intrX <= l1["x"]
                is_l1_y_ok = intrY >= l1["y"] if l1["vy"] >= 0 else intrY <= l1["y"]
                is_l2_x_ok = intrX >= l2["x"] if l2["vx"] >= 0 else intrX <= l2["x"]
                is_l2_y_ok = intrY >= l2["y"] if l2["vy"] >= 0 else intrY <= l2["y"]

                if is_l1_x_ok and is_l1_y_ok and is_l2_x_ok and is_l2_y_ok:
                    sum += 1
#             else:
#                 print("outside:", intersection, l1, l2)

    print(sum)

# 19521 TOO LOW