from scipy.spatial.distance import euclidean
from math import radians, pi

R = 6371.0

if __name__ == '__main__':
    pt0 = (-23163217000, -45794390000)
    pt1 = (-23162580000, -45794539000)
    distance = euclidean(pt0, pt1)
    print(distance)
    print((radians(distance) * R) / 10**9, 'km')
    print((radians(distance) * R) / 10**9 * 1000, 'm')