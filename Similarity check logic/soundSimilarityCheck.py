import librosa
import numpy as np
from scipy.spatial.distance import euclidean
from fastdtw import fastdtw
from time import time



# 음악 파일 미리 읽어 특징 벡터를 추출해 저장
def load_sound_list(path_list, debug=False):
    if debug:
        start_time = time()
        print("call : load_sound_list")

    features_list = []

    for path in path_list:
        if debug:
            sub_time_start = time()
            print("\tstart path :", path)

        y, sr = librosa.load(path)
        features = librosa.feature.mfcc(y=y, sr=sr)
        features_list.append(features)

        if debug:
            sub_time_end = time()
            print("\tmfcc feature complete")
            print(f"\t\truntime : {sub_time_end - sub_time_start:.2f}")


    if debug:
        end_time = time()
        print("return : load_sound_list")
        print(f"total runtime : {end_time - start_time:.2f}\n")

    return features_list



# 업로드된 사운드 파일을 읽어 특징벡터를 추출해 반환
def load_specific_sound(path, debug=False):
    if debug:
        start_time = time()
        print("call : load_specific_sound")

    y, sr = librosa.load(path)
    features = librosa.feature.mfcc(y=y, sr=sr)

    if debug:
        end_time = time()
        print("return : load_specific_sound")
        print(f"total runtime : {end_time - start_time:.2f}\n")

    return features



# 업로드된 사운드 파일과 저장된 사운드와 유사성을 추정
def compare_sound_waveform(target_features, features_list, debug=False):
    if debug:
        start_time = time()
        print("call : compare_sound_waveform")

    distance_list = []

    for idx, features in enumerate(features_list):
        if debug:
            sub_time_start = time()
            print("\tstart compare, index :", idx)

        distance, path = fastdtw(target_features.T, features.T, dist=euclidean)
        distance_list.append((idx, int(distance)))

        if debug:
            sub_time_end = time()
            print("\tcompare complete")
            print(f"\t\truntime : {sub_time_end - sub_time_start:.2f}")

    if debug:
        end_time = time()
        print("return : compare_sound_waveform")
        print(f"total runtime : {end_time - start_time:.2f}\n")

    return distance_list



# 유사도 정렬
def distance_idxsort(distance_list, count=None):
    distance_list.sort(key = lambda x : x[1])
    count_list = list()

    if count == None:
        return distance_list
    
    for i in range(count):
        idx, distance = distance_list[i]
        count_list.append((idx, distance))

    return count_list



# 음악 이름 탐색
def find_music(sound_list, sort_distance):
    music_list = []

    for idx, distance in sort_distance:
        music_list.append(sound_list[idx])

    return music_list



# 시스템 초기화
def prepare_system_process(sound_list):
    if sound_list == None or len(sound_list) < 1:
        return (False, "error: sound_list is empty")
    
    features_list = list()

    try:
        features_list = load_sound_list(sound_list)
    except:
        return (False, "error: interrupt load list or overload file feature")
    
    if features_list == []:
        return (False, "error: features_list is empty")
    
    return (True, features_list)
    


# 업로드된 사운드로 비교
def compare_process(path, sound_list, features_list, count=None):
    if len(path) < 1:
        return (False, "error: path is empty")
    
    trget_features = list()

    try:
        trget_features = load_specific_sound(path)
    except:
        return (False, "error: target feature load fail")
    if len(trget_features) <= 0:
        return (False, "error: trget_features is empty")

    try:
        distance_list = compare_sound_waveform(trget_features, features_list)
    except:
        return (False, "error: distance load fail")
    if len(distance_list) <= 0:
        return (False, "error: distance_list is empty")
    
    try:
        sort_distance = distance_idxsort(distance_list, count)
        music_list = find_music(sound_list, sort_distance)
    except:
        return (False, "error: sort fail")
    
    return (True, music_list, sort_distance)
