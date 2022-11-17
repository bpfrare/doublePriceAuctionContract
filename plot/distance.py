from scipy.spatial.distance import euclidean

if __name__ == '__main__':
    pt0 = (-23163217000, -45794390000)
    pt1 = (-23162580000, -45794539000)
    print(euclidean(pt0, pt1))